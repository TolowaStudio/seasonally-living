// Run: node --experimental-strip-types scripts/check-market-facts.ts   (TOL-2892)
// docs/TOL-2892-market-facts.md is research that people will quote. This keeps it honest against its data file:
//   1. every Google listing has a plausible star rating, a review count and a status, and "us" is present once;
//   2. the doc's ratings table states each listing's stars and reviews exactly as the data file does;
//   3. every second-home share and "solid" flag in the doc is the one computed from the counts (so a hand-edited
//      percentage, or a margin-of-error warning that was dropped, fails);
//   4. the DNS claims (no SPF, DMARC, DKIM; Google MX) the doc builds its "do not send yet" advice on match the data;
//   5. the page still says it changed nothing.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type Listing = { name: string; role: string; rating: number; reviews: number; status: string };
export type Area = { name: string; totalUnits: number; vacant: number; seasonal: number; seasonalMoe: number };

export const share = (a: Area): string => `${(Math.round((a.seasonal / a.totalUnits) * 1000) / 10).toFixed(1)}%`;
/** Solid = the 90% margin of error is under half of the estimate. */
export const solid = (a: Area): boolean => a.seasonalMoe * 2 < a.seasonal;

export function listingProblems(listings: Listing[]): string[] {
  const out: string[] = [];
  const us = listings.filter((l) => l.role === "us");
  if (us.length !== 1) out.push(`expected exactly one "us" listing, found ${us.length}`);
  for (const l of listings) {
    if (!(l.rating >= 1 && l.rating <= 5)) out.push(`${l.name}: rating ${l.rating} is not 1-5`);
    if (!Number.isInteger(l.reviews) || l.reviews < 1) out.push(`${l.name}: review count ${l.reviews} is not a positive integer`);
    if (!["open", "closed", "unknown"].includes(l.status)) out.push(`${l.name}: status "${l.status}"`);
  }
  return out;
}

/** Table rows the doc must contain for the ratings table: "| name | where | stars | reviews |" (stars/reviews only matter). */
export function ratingRowProblems(doc: string, listings: Listing[]): string[] {
  const out: string[] = [];
  for (const l of listings) {
    const base = l.name.replace(/ \(.*\)$/, "");
    const row = doc.split("\n").find((line) => line.startsWith("|") && line.includes(base) && (!/\(/.test(l.name) || line.includes(l.name.match(/\((.*)\)/)![1].split(",")[0])));
    if (!row) { out.push(`${l.name}: no row in the ratings table`); continue; }
    const cells = row.split("|").map((c) => c.trim().replace(/\*/g, ""));
    if (!cells.includes(l.rating.toFixed(1)) || !cells.includes(String(l.reviews))) out.push(`${l.name}: doc row does not say ${l.rating.toFixed(1)} stars / ${l.reviews} reviews`);
  }
  return out;
}

export function areaRowProblems(doc: string, areas: Area[]): string[] {
  const out: string[] = [];
  for (const a of areas) {
    const want = `| ${a.name} | ${a.seasonal} ±${a.seasonalMoe} | ${a.totalUnits} | ${share(a)} | ${solid(a) ? "yes" : "no"} |`;
    if (!doc.includes(want)) out.push(`missing or wrong row: ${want}`);
  }
  return out;
}

// ---- Self-test: each detector must be able to fail, or the repo checks below prove nothing. ----
{
  const a: Area = { name: "X", totalUnits: 1000, vacant: 300, seasonal: 200, seasonalMoe: 50 };
  assert.equal(share(a), "20.0%");
  assert.equal(solid(a), true);
  assert.equal(solid({ ...a, seasonalMoe: 100 }), false, "a margin as large as half the estimate is not solid");
  assert.deepEqual(areaRowProblems("| X | 200 ±50 | 1000 | 20.0% | yes |", [a]), []);
  assert.equal(areaRowProblems("| X | 200 ±50 | 1000 | 25.0% | yes |", [a]).length, 1, "a hand-edited share must be flagged");
  assert.equal(areaRowProblems("| X | 200 ±50 | 1000 | 20.0% | no |", [a]).length, 1, "a wrong solid flag must be flagged");
  const l: Listing = { name: "Acme", role: "us", rating: 3.9, reviews: 99, status: "open" };
  assert.deepEqual(listingProblems([l]), []);
  assert.equal(listingProblems([{ ...l, rating: 6 }]).length, 1, "rating out of range");
  assert.equal(listingProblems([l, { ...l, name: "B" }]).length, 1, "two 'us' listings");
  assert.deepEqual(ratingRowProblems("| **Acme (us)** | here | **3.9** | **99** | open |", [l]), []);
  assert.equal(ratingRowProblems("| Acme | here | 4.9 | 99 | open |", [l]).length, 1, "a wrong star rating must be flagged");
  assert.equal(ratingRowProblems("| Other | here | 3.9 | 99 | open |", [l]).length, 1, "a missing row must be flagged");
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, "docs/data/TOL-2892-market-facts.json"), "utf8"));
const doc = readFileSync(join(root, "docs/TOL-2892-market-facts.md"), "utf8");

// 1 and 2: Google listings.
assert.deepEqual(listingProblems(data.google.listings), [], "google listings in the data file");
assert.deepEqual(ratingRowProblems(doc, data.google.listings), [], "ratings table in the doc");

// 3: second homes.
assert.deepEqual(areaRowProblems(doc, data.secondHomes.areas), [], "second-home table in the doc");
for (const a of data.secondHomes.areas as Area[]) assert.ok(a.seasonal <= a.vacant, `${a.name}: seasonal units cannot exceed vacant units`);
const county = data.secondHomes.areas[0] as Area;
assert.match(county.name, /^Chelan County/, "first area is the county");
const oneYear = data.secondHomes.county1yr2024 as Area;
assert.ok(doc.includes(`${oneYear.seasonal} ±${oneYear.seasonalMoe} of ${oneYear.totalUnits}`) && doc.includes(`(${share(oneYear)})`), "doc quotes the one-year county figure from the data");

// 4: DNS claims the "do not send yet" advice rests on.
const dns = data.dns["seasonallyliving.com"];
assert.equal(dns.spf, false, "data says no SPF; if that changed, the doc's send advice must be rewritten");
assert.equal(dns.dmarc, false);
assert.equal(dns.dkimGoogleSelector, false);
assert.ok(dns.mx.every((m: string) => /google\.com\.?$/.test(m)) && dns.mx.length === 5, "five Google MX records");
assert.ok(dns.apexTxt.length === 0, "no apex TXT");
assert.match(doc, /\*\*SPF\*\*|\| SPF \| \*\*none\*\*/, "doc states SPF is none");
assert.match(doc, /expires 2027-05-28/, "doc states the domain expiry from the data");
assert.equal(dns.expires, "2027-05-28");

// 5: research only.
assert.match(doc, /research only/i, "page says research only");
assert.match(doc, /no review reply, profile edit, DNS change, send or post/i, "page says it changed nothing");
assert.match(doc, /## Workarounds left/, "page has the Workarounds left section");

console.log(`ok: ${data.google.listings.length} listings, ${data.secondHomes.areas.length} areas, DNS claims, research-only wording`);
