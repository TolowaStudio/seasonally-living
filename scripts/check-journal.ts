// Journal visibility and posting-state checks. Run: node --experimental-strip-types scripts/check-journal.ts
// isVisible must stay in sync with src/lib/journal.ts (plain node cannot load that module).
import assert from "node:assert/strict";
import type { JournalPost, JournalStatus } from "../src/content/journal.ts";
import { channelStillNeedsPost, hasPostedLink, postingLinks } from "../src/lib/post-state.ts";

const VISIBLE: JournalStatus[] = ["approved", "scheduled", "published"];

function isVisible(p: Pick<JournalPost, "status" | "publishAt" | "posted">, now = Date.now()): boolean {
  if (p.status === "hidden") return false;
  if (p.posted) return true;
  if (!VISIBLE.includes(p.status)) return false;
  return !p.publishAt || Date.parse(p.publishAt) <= now;
}

const now = Date.parse("2026-03-01T12:00:00Z");
assert.equal(isVisible({ status: "approved", publishAt: "2026-01-01T12:00:00Z" }, now), true);
assert.equal(isVisible({ status: "scheduled", publishAt: "2026-01-01T12:00:00Z" }, now), true);
assert.equal(isVisible({ status: "draft", publishAt: undefined }, now), false);
assert.equal(isVisible({ status: "approved", publishAt: "2026-06-01T12:00:00Z" }, now), false);
assert.equal(isVisible({ status: "draft", posted: true, publishAt: undefined }, now), true);
assert.equal(isVisible({ status: "hidden", posted: true, publishAt: undefined }, now), false);
assert.equal(isVisible({ status: "hidden", posted: false, publishAt: "2026-01-01T12:00:00Z" }, now), false);

// Studio publish wiping legacy results on the post does not clear automation's view of what posted.
const linksAfterEdit = postingLinks({ facebookUrl: "https://www.facebook.com/123" }, {});
assert.equal(hasPostedLink(linksAfterEdit), true);
assert.equal(channelStillNeedsPost("facebook", ["facebook", "instagram", "gbp"], linksAfterEdit), false);
assert.equal(channelStillNeedsPost("instagram", ["facebook", "instagram", "gbp"], linksAfterEdit), true);

const wipedPostOnly = postingLinks({}, {});
assert.equal(hasPostedLink(wipedPostOnly), false);
assert.equal(channelStillNeedsPost("facebook", ["facebook"], wipedPostOnly), true);

const legacyOnly = postingLinks({}, { instagramUrl: "https://www.instagram.com/p/x" });
assert.equal(channelStillNeedsPost("instagram", ["instagram"], legacyOnly), false);

const both = postingLinks({ facebookUrl: "https://www.facebook.com/state" }, { facebookUrl: "https://www.facebook.com/wiped" });
assert.equal(both.facebookUrl, "https://www.facebook.com/state");

console.log("journal checks passed");