// Seed (or reset) Sanity content from the code defaults in src/content.
//
//   SANITY_TOKEN=... node --experimental-strip-types scripts/seed-sanity.ts            # create missing docs only
//   SANITY_TOKEN=... node --experimental-strip-types scripts/seed-sanity.ts --replace  # overwrite all docs with defaults
//
// The token needs write access to project 83r23z7t (an editor's own `sanity login` session works locally).
// By default existing documents are left alone, so edits made in the Studio are never clobbered.
import { ALL_PAGES } from "../src/content/pages.ts";
import { SETTINGS } from "../src/content/settings.ts";

const PROJECT = "83r23z7t";
const DATASET = "production";
const token = process.env.SANITY_TOKEN;
if (!token) throw new Error("SANITY_TOKEN is required");
const replace = process.argv.includes("--replace");

// No dots in IDs: dotted IDs are private paths the public API cannot read.
const docId = (pageId: string) => "page-" + (pageId === "/" ? "home" : pageId.replace(/^\//, "").replace(/\//g, "-"));

// Sanity needs a _key on every object inside an array.
let n = 0;
function withKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map((x) => (x && typeof x === "object" && !Array.isArray(x) ? { _key: `k${(n++).toString(36)}`, ...(withKeys(x) as object) } : withKeys(x)));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, withKeys(x)]));
  return v;
}

const docs = [
  { _id: "siteSettings", ...SETTINGS },
  ...ALL_PAGES.map((p) => ({ _id: docId(p.pageId), ...p })),
].map((d) => withKeys(d) as { _id: string; _type: string });

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
console.log(`${replace ? "createOrReplace" : "createIfNotExists"}: ${docs.length} documents`);
for (const d of docs) console.log(`  ${d._id} (${d._type})`);
console.log("transaction", body.transactionId);
