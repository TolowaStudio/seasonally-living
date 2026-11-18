// TOL-3675: the used hot tub gallery posts every spa's price. Checks the price rules without a browser:
//   - a price reaches the public page only as a clean, whole-dollar number, and never on a sold spa;
//   - the public GROQ projection selects `price` and never an intake / cost field;
//   - gallery order puts unpriced spas last for both price sorts;
//   - the old "Call for price" / "we don't post prices" copy is gone from src;
//   - the Studio has a price field that is required before a spa is listed.
// Run: node --experimental-strip-types scripts/check-pre-owned-prices.ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { MAX_PUBLIC_PRICE, SPA_FIELDS, cleanPrice, formatPrice, publicPrice } from "../src/lib/pre-owned-public.ts";
import { sortSpas } from "../src/lib/pre-owned-ui.ts";
import type { PreOwnedSpa } from "../src/content/types.ts";

// 1. cleanPrice / publicPrice
assert.equal(cleanPrice(4995), 4995);
assert.equal(cleanPrice(4995.4), 4995);
for (const bad of [0, -5, NaN, Infinity, MAX_PUBLIC_PRICE + 1, "4995", "$4,995", null, undefined, {}]) {
  assert.equal(cleanPrice(bad), undefined, `cleanPrice(${String(bad)})`);
}
assert.equal(publicPrice("listed", 4995), 4995);
assert.equal(publicPrice("reserved", 4995), 4995);
assert.equal(publicPrice("sold", 4995), undefined, "a sold spa must not carry a price");
assert.equal(formatPrice(4995), "$4,995");
assert.equal(formatPrice(12000), "$12,000");

// 2. The public projection selects price and no internal field.
assert.match(SPA_FIELDS, /\bprice\b/, "SPA_FIELDS must select price");
for (const field of ["acquisitionCost", "reconCost", "intakeNotes", "receivedDate", "source"]) {
  assert.ok(!new RegExp(`\\b${field}\\b`).test(SPA_FIELDS), `SPA_FIELDS must not select ${field}`);
}

// 3. sanity.ts builds the public spa through publicPrice (never spreads the raw price through).
const sanity = readFileSync("src/lib/sanity.ts", "utf8");
assert.match(sanity, /publicPrice\(status, price\)/, "toPublicSpa must publish price through publicPrice");
assert.match(sanity, /const \{ rawStatus, recon, price, \.\.\.rest \} = r;/, "raw price must be pulled out before ...rest");

// 4. Sort: available before reserved, featured first, unpriced spas last in both price sorts.
const spa = (slug: string, o: Partial<PreOwnedSpa> = {}): PreOwnedSpa => ({ title: slug, slug, status: "listed", ...o });
const set = [spa("none"), spa("mid", { price: 5000 }), spa("low", { price: 3000 }), spa("high", { price: 9000 }), spa("res", { price: 1000, status: "reserved" })];
const order = (s: PreOwnedSpa[]) => s.map((x) => x.slug).join(",");
assert.equal(order(sortSpas(set, "price-asc")), "low,mid,high,none,res");
assert.equal(order(sortSpas(set, "price-desc")), "high,mid,low,none,res");
assert.equal(order(sortSpas([...set, spa("star", { price: 8000, featured: true })], "price-asc")), "star,low,mid,high,none,res");
assert.equal(set[0].slug, "none", "sortSpas must not mutate its input");

// 5. No leftover "price on request" copy in the shipped source.
const OLD_COPY = ["Call for price", "We don't post prices", "We don&apos;t post prices", "Prices are not posted", "Prices are never shown"];
function walk(dir: string, out: string[] = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|css)$/.test(name)) out.push(p);
  }
  return out;
}
for (const f of walk("src")) {
  const text = readFileSync(f, "utf8");
  for (const phrase of OLD_COPY) assert.ok(!text.includes(phrase), `${f} still says "${phrase}"`);
}

// 6. The Studio price field exists, is public (listing group) and is required before listing.
const schema = readFileSync("studio/schemas.ts", "utf8");
const start = schema.indexOf('name: "price"');
assert.ok(start > 0, "studio/schemas.ts must define a price field");
const block = schema.slice(start, schema.indexOf('name: "listedDate"'));
assert.ok(block.includes('group: "listing"'), "price must be in the public listing group");
assert.ok(block.includes("Add the price before listing this spa."), "price must be required before a spa is listed or reserved");

console.log("check-pre-owned-prices: ok");
