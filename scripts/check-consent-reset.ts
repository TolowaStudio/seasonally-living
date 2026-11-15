// Run: node --experimental-strip-types scripts/check-consent-reset.ts   (TOL-3359)
// Checks that "Cookie settings" really forgets the visitor's choice: stored value removed, Google tags back to
// denied, the banner event fired, and a reload only when Meta Pixel / PostHog could have been loaded (granted).
import assert from "node:assert/strict";

const store = new Map<string, string>();
const calls: unknown[][] = [];
let reloads = 0;
let events = 0;
(globalThis as any).window = {
  localStorage: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) },
  gtag: (...a: unknown[]) => void calls.push(a),
  dispatchEvent: () => void events++,
  addEventListener() {},
  removeEventListener() {},
  location: { reload: () => void reloads++ },
};
(globalThis as any).Event = class {};

const { clearConsent, setConsent, CONSENT_KEY } = await import("../src/lib/consent.ts");

// Accepted visitor: choice cleared, Google denied, page reloads (Meta/PostHog cannot be unloaded in place).
setConsent("granted");
calls.length = 0; events = 0;
clearConsent();
assert.equal(store.has(CONSENT_KEY), false, "stored choice must be removed");
assert.deepEqual(calls[0]?.slice(0, 2), ["consent", "update"]);
assert.equal((calls[0]?.[2] as any).ad_storage, "denied");
assert.equal(reloads, 1, "accepted visitor: reload drops Meta Pixel and PostHog");

// Declined visitor: nothing was loaded, so no reload; the banner event brings the banner back.
setConsent("denied");
reloads = 0; events = 0;
clearConsent();
assert.equal(store.has(CONSENT_KEY), false);
assert.equal(reloads, 0);
assert.equal(events, 1, "banner must re-render");
console.log("consent reset: ok");
