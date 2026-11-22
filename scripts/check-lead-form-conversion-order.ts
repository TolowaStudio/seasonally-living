// Run: node --experimental-strip-types scripts/check-lead-form-conversion-order.ts   (TS-3282)
// Ensures lead forms fire trackLeadConversion only after /api/lead reports success.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const forms = [
  "src/components/LeadForm.tsx",
  "src/components/NoteForm.tsx",
  "src/components/PreOwnedSellForm.tsx",
];

for (const rel of forms) {
  const src = readFileSync(join(root, rel), "utf8");
  const trackIdx = src.indexOf("trackLeadConversion(");
  const failIdx = src.search(/if \(!res\.ok \|\| !data\.success\)/);
  const catchIdx = src.indexOf("} catch");
  assert.ok(trackIdx >= 0, `${rel} must call trackLeadConversion`);
  assert.ok(failIdx >= 0, `${rel} must guard on res.ok/data.success`);
  assert.ok(trackIdx > failIdx, `${rel}: trackLeadConversion must come after the success guard`);
  assert.ok(catchIdx < 0 || trackIdx < catchIdx, `${rel}: trackLeadConversion must not be in the catch block`);
  const count = (src.match(/trackLeadConversion\(/g) ?? []).length;
  assert.equal(count, 1, `${rel}: exactly one trackLeadConversion call`);
  assert.match(src, /leadConversionFields\(\)/, `${rel} must use leadConversionFields()`);
}

console.log("lead form conversion order: ok");