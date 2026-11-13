// Seed the hearth brand pages (Sanity "hearthBrand" documents) from src/content/brands.ts.
//
//   node --experimental-strip-types scripts/seed-brands.ts                                  # dry run: print, write nothing
//   SANITY_TOKEN=... node --experimental-strip-types scripts/seed-brands.ts --write          # create missing brands only
//   SANITY_TOKEN=... node --experimental-strip-types scripts/seed-brands.ts --write --replace # overwrite brands with code
//
// SANITY_DATASET picks the dataset (default "production"). Deploy the Studio schema first (cd studio && npm run deploy)
// so editors can open the documents. Without --replace, brands already in Sanity are left alone, so Studio edits
// (like the "In our showroom" toggles) are never clobbered.
import { BRANDS } from "../src/content/brands.ts";

const PROJECT = "83r23z7t";
const DATASET = process.env.SANITY_DATASET || "production";
const write = process.argv.includes("--write");
const replace = process.argv.includes("--replace");

// Sanity needs a unique _key on every object inside an array.
let n = 0;
function withKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map((x) => (x && typeof x === "object" && !Array.isArray(x) ? { _key: `k${(n++).toString(36)}`, ...(withKeys(x) as object) } : withKeys(x)));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, withKeys(x)]));
  return v;
}

const docs = BRANDS.map((b, i) => {
  const { slug, sections, ...rest } = b;
  return withKeys({
    _id: `hearthBrand-${slug}`, // no dots: dotted IDs are private paths the public API cannot read
    _type: "hearthBrand",
    ...rest,
    slug: { _type: "slug", current: slug },
    sortOrder: (i + 1) * 10,
    sections: sections.map((s) => ({ ...s, models: s.models.map((m) => ({ ...m, inShowroom: m.inShowroom === true })) })),
  }) as { _id: string; _type: string; sections: { models: { name: string; inShowroom: boolean }[] }[] };
});

for (const d of docs) {
  const models = d.sections.flatMap((s) => s.models);
  const floor = models.filter((m) => m.inShowroom).map((m) => m.name);
  console.log(`${d._id}: ${d.sections.length} families, ${models.length} models, in showroom: ${floor.join(", ") || "none"}`);
}

if (!write) {
  console.log(`\nDry run: nothing written. Add --write to send ${docs.length} documents to ${PROJECT}/${DATASET}.`);
  process.exit(0);
}

const token = process.env.SANITY_TOKEN;
if (!token) throw new Error("SANITY_TOKEN is required with --write");
const mutations = docs.map((d) => (replace ? { createOrReplace: d } : { createIfNotExists: d }));
const res = await fetch(`https://${PROJECT}.api.sanity.io/v2025-01-01/data/mutate/${DATASET}?returnIds=true`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ mutations }),
});
const body = await res.json();
if (!res.ok) {
  console.error("Sanity mutate failed", res.status, JSON.stringify(body).slice(0, 500));
  process.exit(1);
}
console.log(`${replace ? "createOrReplace" : "createIfNotExists"}: ${docs.length} documents in ${PROJECT}/${DATASET}, transaction ${body.transactionId}`);
