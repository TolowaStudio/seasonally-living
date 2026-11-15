// Checks that Sanity brand documents render like the code brands and that list edits never leak
// photos or "In our showroom" badges between models. Run: node --experimental-strip-types scripts/check-brand-content.ts
import assert from "node:assert/strict";
import { BRANDS } from "../src/content/brands.ts";
import { brandFromSanity } from "../src/lib/brand-content.ts";
import type { BrandContent } from "../src/content/types.ts";

const clean = (v: unknown) => JSON.parse(JSON.stringify(v, (k, x) => (k === "inShowroom" && x === false ? undefined : x)));
const brand = (slug: string): BrandContent => structuredClone(BRANDS.find((b) => b.slug === slug)!);

// 1. A seeded doc (as the GROQ projection returns it, with _keys) round-trips to the code brand, with no fallback.
for (const b of BRANDS) {
  const doc = JSON.parse(
    JSON.stringify({
      ...b,
      _id: `hearthBrand-${b.slug}`,
      sections: b.sections.map((s) => ({ _key: "s", ...s, models: s.models.map((m) => ({ _key: "m", ...m, inShowroom: m.inShowroom === true })) })),
    }),
  );
  assert.deepEqual(clean(brandFromSanity(doc)), clean(b), b.slug);
}

// 2. Deleting the first Kuma model must not hand its photo or badge to the next one.
const kuma = brand("kuma");
const first = kuma.sections[0].models.shift()!;
kuma.sections[0].models[0].image = "";
const out = brandFromSanity(kuma, brand("kuma"))!;
assert.equal(out.sections[0].models[0].image, undefined);
assert.notEqual(out.sections[0].models[0].name, first.name);

// 3. Toggled off or never set: no badge.
const nap = brand("napoleon");
nap.sections.forEach((s) => s.models.forEach((m) => (m.inShowroom = false)));
delete nap.sections[0].models[0].inShowroom;
assert.equal(brandFromSanity(nap)!.sections.flatMap((s) => s.models).filter((m) => m.inShowroom).length, 0);

// 4. Blank top-level fields fall back to code; a brand that can't render returns null.
const blank = brandFromSanity({ slug: "stuv", heroImage: "", summary: "  " }, BRANDS[0])!;
assert.equal(blank.heroImage, BRANDS[0].heroImage);
assert.equal(blank.summary, BRANDS[0].summary);
assert.equal(brandFromSanity({ slug: "new-brand", name: "New" }), null);
assert.equal(brandFromSanity(null), null);

console.log("brand-content checks passed");
