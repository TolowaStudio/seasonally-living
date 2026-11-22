// Run: node --experimental-strip-types scripts/check-lead-meta-capi.ts   (TS-3282)
// Fails until /api/lead maps the client's conversion event id into sendMetaLead (Meta mocked).
import assert from "node:assert/strict";

const EVENT_ID = "7c9e2f1a-4b3d-4111-9e8f-0123456789ab";

const { buildMetaLeadInput, validateConversionEventId } = await import("../src/lib/lead-meta.ts");

assert.equal(validateConversionEventId(EVENT_ID), EVENT_ID);
assert.equal(validateConversionEventId("not-a-uuid"), undefined);
assert.equal(validateConversionEventId("7c9e2f1a-4b3d-4a11-9e8f-check-lead-meta"), undefined);

const denied = buildMetaLeadInput({
  kind: "visit",
  adsConsent: "denied",
  eventId: EVENT_ID,
  email: "pat@example.com",
  interests: ["pool"],
  origin: "https://seasonallyliving.com",
});
assert.equal(denied, undefined, "CAPI must not send when ads consent is denied");

const built = buildMetaLeadInput({
  kind: "visit",
  adsConsent: "granted",
  eventId: EVENT_ID,
  email: "pat@example.com",
  phone: "(509) 555-0100",
  interests: ["pool"],
  source: "/lp/pool-planning-2027",
  origin: "https://seasonallyliving.com",
  fbp: "fb.1.1558571054389.1111111111",
  fbc: "fb.1.1558571054390.AbCdEf",
  userAgent: "check-script",
  clientIp: "203.0.113.10",
});
assert.ok(built, "buildMetaLeadInput must accept event id + contact when consent granted");
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
assert.equal(
  buildMetaLeadInput({ kind: "visit", adsConsent: "granted", interests: [], origin: "https://x.test" }),
  undefined,
);

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

globalThis.fetch = prevFetch;
delete process.env.META_CAPI_TOKEN;
delete process.env.NEXT_PUBLIC_META_PIXEL_ID;

console.log("lead meta capi: ok");