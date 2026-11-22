// Run: node --experimental-strip-types scripts/check-lead-meta-capi.ts   (TS-3282)
// Fails if /api/lead drops Meta dispatch or planMetaLeadDispatch gating regresses.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const EVENT_ID = "7c9e2f1a-4b3d-4111-9e8f-0123456789ab";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const routeSrc = readFileSync(join(root, "src/app/api/lead/route.ts"), "utf8");
assert.match(routeSrc, /planMetaLeadDispatch\(/, "route must call planMetaLeadDispatch");
assert.match(routeSrc, /if \(metaLead\) void sendMetaLead\(metaLead\)/, "route must queue sendMetaLead");

const { buildMetaLeadInput, planMetaLeadDispatch, validateConversionEventId } = await import("../src/lib/lead-meta.ts");

assert.equal(validateConversionEventId(EVENT_ID), EVENT_ID);
assert.equal(validateConversionEventId("not-a-uuid"), undefined);

assert.equal(
  planMetaLeadDispatch({
    feedback: true,
    kind: "visit",
    adsConsentRaw: "granted",
    eventIdRaw: EVENT_ID,
    email: "pat@example.com",
    interests: ["pool"],
    origin: "https://seasonallyliving.com",
  }),
  undefined,
  "feedback visits must not trigger Meta CAPI",
);

const denied = planMetaLeadDispatch({
  feedback: false,
  kind: "visit",
  adsConsentRaw: "denied",
  eventIdRaw: EVENT_ID,
  email: "pat@example.com",
  interests: ["pool"],
  origin: "https://seasonallyliving.com",
});
assert.equal(denied, undefined, "CAPI must not send when ads consent is denied");

const built = planMetaLeadDispatch({
  feedback: false,
  kind: "visit",
  adsConsentRaw: "granted",
  eventIdRaw: EVENT_ID,
  email: "pat@example.com",
  phoneRaw: "(509) 555-0100",
  interests: ["pool"],
  sourceRaw: "/lp/pool-planning-2027",
  origin: "https://seasonallyliving.com",
  fbpRaw: "fb.1.1558571054389.1111111111",
  fbcRaw: "fb.1.1558571054390.AbCdEf",
  userAgent: "check-script",
  clientIp: "203.0.113.10",
});
assert.ok(built, "planMetaLeadDispatch must return input when consent granted");
assert.equal(built!.eventId, EVENT_ID);
assert.equal(built!.eventName, "Lead");
assert.equal(built!.sourceUrl, "https://seasonallyliving.com/lp/pool-planning-2027");

const note = buildMetaLeadInput({
  kind: "note",
  adsConsent: "granted",
  eventId: EVENT_ID,
  email: "pat@example.com",
  interests: ["hearth"],
  origin: "https://seasonallyliving.com",
});
assert.equal(note!.eventName, "Subscribe");

let posted = "";
const prevFetch = globalThis.fetch;
process.env.META_CAPI_TOKEN = "test-token";
process.env.NEXT_PUBLIC_META_PIXEL_ID = "999888777";
globalThis.fetch = async (_url, init) => {
  posted = String(init?.body ?? "");
  return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
};

const { sendMetaLead, metaCapiEnabled } = await import("../src/lib/meta-capi.ts");
assert.equal(metaCapiEnabled(), true);
const result = await sendMetaLead(built!);
assert.equal(result.sent, true);
const body = JSON.parse(posted) as { data: Array<{ event_id?: string; event_name?: string }> };
assert.equal(body.data[0]?.event_id, EVENT_ID, "sendMetaLead must post the same event id the client sent");
assert.equal(body.data[0]?.event_name, "Lead");

delete process.env.META_CAPI_TOKEN;
delete process.env.NEXT_PUBLIC_META_PIXEL_ID;
assert.equal(metaCapiEnabled(), false);
const skipped = await sendMetaLead(built!);
assert.equal(skipped.sent, false, "sendMetaLead must no-op when Meta env is unset");

globalThis.fetch = prevFetch;

console.log("lead meta capi: ok");