// Load reviewed draft files into Sanity as status "draft" posts, so Cam or Kimberly can edit and
// approve them in the Studio. OPT-IN: this is the only script in this folder that can write to Sanity,
// and it does nothing unless you pass --write.
//
//   node --experimental-strip-types scripts/content/import-drafts.ts out/content-drafts/2026-11-16            # dry run (default)
//   SANITY_TOKEN=... node --experimental-strip-types scripts/content/import-drafts.ts <dir-or-file> --write   # really write
//
// Safety: only status "draft" documents are accepted; existing documents are never overwritten
// (createIfNotExists); the draft metadata is stripped. The token needs write access to project 83r23z7t.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const PROJECT = "83r23z7t";
const DATASET = "production";
const args = process.argv.slice(2);
const write = args.includes("--write");
const target = args.find((a) => !a.startsWith("--"));
if (!target) throw new Error("Pass a drafts directory or a single .json file.");

const files = statSync(target).isDirectory()
  ? readdirSync(target).filter((f) => f.endsWith(".json")).sort().map((f) => join(target, f))
  : [target];

const docs = files.map((f) => {
  const { _draftMeta, ...doc } = JSON.parse(readFileSync(f, "utf8")) as Record<string, unknown> & { _draftMeta?: unknown; slug: { current: string }; status: string; title: string; needsConfirm?: string[] };
  void _draftMeta;
  if (doc._type !== "post") throw new Error(`${f}: not a post document`);
  if (doc.status !== "draft") throw new Error(`${f}: status is "${doc.status}"; only drafts can be imported`);
  return { file: f, doc: { _id: `post-${doc.slug.current}`, ...doc } };
});

console.log(`${docs.length} draft(s):`);
for (const { file, doc } of docs) console.log(`  ${doc._id}  "${doc.title}"  (${doc.needsConfirm?.length ?? 0} to check)  <- ${file}`);

if (!write) {
  console.log("\nDry run. Nothing was written. Add --write (and SANITY_TOKEN) to create these as draft posts.");
  process.exit(0);
}
const token = process.env.SANITY_TOKEN;
if (!token) throw new Error("SANITY_TOKEN is required with --write");

const res = await fetch(`https://${PROJECT}.api.sanity.io/v2025-01-01/data/mutate/${DATASET}?returnIds=true`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({ mutations: docs.map(({ doc }) => ({ createIfNotExists: doc })) }),
});
const body = (await res.json()) as { transactionId?: string; results?: { id: string; operation: string }[] };
if (!res.ok) {
  console.error("Sanity mutate failed", res.status, JSON.stringify(body).slice(0, 400));
  process.exit(1);
}
// createIfNotExists reports "create" for new documents and "none" for ones that already existed.
const created = (body.results ?? []).filter((r) => r.operation === "create").map((r) => r.id);
const skipped = (body.results ?? []).filter((r) => r.operation !== "create").map((r) => r.id);
console.log(`Created ${created.length}: ${created.join(", ") || "-"}`);
if (skipped.length) console.log(`Skipped ${skipped.length} that already exist (NOT updated; edit them in the Studio): ${skipped.join(", ")}`);
console.log(`Transaction ${body.transactionId}`);
