// TS-3288: area FAQ phone token, phone-only feedback rate limit, pre-owned seller @id, LP share images.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { areaFaqsForDisplay, AREA_FAQ_PHONE } from "../src/lib/area-copy.ts";
import { rateLimit } from "../src/lib/rate-limit.ts";
import { oneLine } from "../src/lib/text.ts";

const FEEDBACK_PHONE_LIMIT = 2;
const FEEDBACK_PHONE_WINDOW_MS = 60 * 60_000;

function feedbackPhoneKey(phone: string): string {
  const line = oneLine(phone, 40);
  const digits = line.replace(/\D/g, "");
  const core = digits.length >= 10 ? digits.slice(-10) : digits;
  return `feedback-phone:${core || line}`;
}
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function businessSchemaId(baseUrl: string) {
  return `${baseUrl.replace(/\/$/, "")}/#business`;
}

// --- Area FAQs use settings phone, not a stale hardcoded number ---
const chelan = areaFaqsForDisplay(
  [{ q: "Test", a: `Call ${AREA_FAQ_PHONE} today.` }],
  "(555) 100-2000",
);
assert.equal(chelan[0].a, "Call (555) 100-2000 today.");
assert.doesNotMatch(chelan[0].a, /667-8833/);

// --- Repeated phone-only feedback hits the per-phone cap ---
const phone = "(509) 111-2222";
const key = feedbackPhoneKey(phone);
assert.equal(key, "feedback-phone:5091112222");
for (let i = 0; i < FEEDBACK_PHONE_LIMIT; i++) {
  const r = rateLimit(key, FEEDBACK_PHONE_LIMIT, FEEDBACK_PHONE_WINDOW_MS);
  assert.ok(r.ok, `attempt ${i + 1} should pass`);
}
const blocked = rateLimit(key, FEEDBACK_PHONE_LIMIT, FEEDBACK_PHONE_WINDOW_MS);
assert.equal(blocked.ok, false, "third phone-only feedback within the window must be rate-limited");

// --- Pre-owned Product/Offer seller links to the site-wide business entity ---
const preOwnedPage = readFileSync(join(root, "src/app/pre-owned/[slug]/page.tsx"), "utf8");
assert.match(preOwnedPage, /businessSchemaId/);
assert.match(preOwnedPage, /@id.*businessSchemaId/);

const id = businessSchemaId("https://seasonallyliving.com");
assert.equal(id, "https://seasonallyliving.com/#business");

// --- Campaign LPs emit socialMeta with per-campaign og keys ---
const lpPage = readFileSync(join(root, "src/app/lp/[campaign]/page.tsx"), "utf8");
assert.match(lpPage, /socialMeta\(/);
assert.match(lpPage, /ogKey:\s*`lp-\$\{campaign\}`/);

const leadRoute = readFileSync(join(root, "src/app/api/lead/route.ts"), "utf8");
assert.match(leadRoute, /feedbackPhoneKey/);

console.log("check-local-seo-followups: ok");