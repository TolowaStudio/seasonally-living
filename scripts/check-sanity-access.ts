// TOL-3348: guards the code side of making the Sanity dataset private.
// Run: node --experimental-strip-types scripts/check-sanity-access.ts
//  1. The shared read client sends SANITY_READ_TOKEN when set and sends none when unset.
//  2. The token env name is server-only (never NEXT_PUBLIC_*), so it cannot be inlined into browser code.
//  3. No second Sanity client exists under src/ (a second one would stay anonymous and 401 once the dataset is private).
//  4. A 401/403 read failure is logged with the real cause instead of looking like "old copy".
//  5. The public pre-owned projection never selects a staff-only (intake group) field. reconChecklist is the one
//     allowed exception: it is read only to turn ticked boxes into public labels.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describeSanityError, sanityClientConfig } from "../src/lib/sanity-client.ts";

// 1
assert.equal(sanityClientConfig({ SANITY_READ_TOKEN: "sk-test" }).token, "sk-test", "token must be passed to the client");
assert.equal(sanityClientConfig({ SANITY_READ_TOKEN: "  sk-test  " }).token, "sk-test", "token is trimmed");
for (const v of [undefined, "", "   "]) assert.ok(!("token" in sanityClientConfig({ SANITY_READ_TOKEN: v })), `no token key for ${JSON.stringify(v)}`);
assert.equal(sanityClientConfig({}).perspective, "published");

// 2
const clientSrc = readFileSync("src/lib/sanity-client.ts", "utf8");
assert.ok(!/NEXT_PUBLIC_[A-Z_]*TOKEN/.test(clientSrc), "the read token must not use a NEXT_PUBLIC_ name");
assert.ok(clientSrc.includes("process.env") && clientSrc.includes("SANITY_READ_TOKEN"));

// 3
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(n) ? [p] : [];
  });
}
const builders = walk("src").filter((f) => /createClient\s*\(/.test(readFileSync(f, "utf8")) && /@sanity\/client/.test(readFileSync(f, "utf8")));
assert.deepEqual(builders, [join("src", "lib", "sanity-client.ts")], `only src/lib/sanity-client.ts may build a Sanity client, found: ${builders.join(", ")}`);

// 4
const err401 = Object.assign(new Error("Unauthorized"), { statusCode: 401 });
assert.match(describeSanityError(err401, {}), /SANITY_READ_TOKEN is not set/);
assert.match(describeSanityError(err401, { SANITY_READ_TOKEN: "x" }), /rejected/);
assert.equal(describeSanityError(new Error("boom"), {}), "boom");
assert.ok(!describeSanityError(err401, { SANITY_READ_TOKEN: "super-secret" }).includes("super-secret"), "never log the token");

// 5
const schemas = readFileSync("studio/schemas.ts", "utf8");
const spaBlock = schemas.slice(schemas.indexOf('name: "preOwnedSpa"'), schemas.indexOf('name: "hearthBrand"'));
const intakeFields = [...spaBlock.matchAll(/name: "(\w+)",\s*(?:title: "[^"]*",\s*)?group: "intake"/g)].map((m) => m[1]);
assert.ok(intakeFields.includes("acquisitionCost") && intakeFields.includes("reconCost") && intakeFields.includes("intakeNotes"), `schema parse found: ${intakeFields}`);
const lib = readFileSync("src/lib/pre-owned-public.ts", "utf8");
const spaFields = lib.match(/export const SPA_FIELDS = `([^`]*)`/)?.[1];
assert.ok(spaFields, "SPA_FIELDS not found in src/lib/pre-owned-public.ts");
for (const f of intakeFields.filter((f) => f !== "reconChecklist")) {
  assert.ok(!new RegExp(`\\b${f}\\b`).test(spaFields), `public pre-owned projection must not select staff-only field "${f}"`);
}

console.log("check-sanity-access: ok");
