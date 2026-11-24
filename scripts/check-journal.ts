// Journal visibility and posting-state checks. Run: node --experimental-strip-types scripts/check-journal.ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { channelStillNeedsPost, hasPostedLink, postStateDocumentId, postingLinks } from "../src/lib/post-state.ts";
import { isVisible } from "../src/lib/journal-visible.ts";

const now = Date.parse("2026-03-01T12:00:00Z");
assert.equal(isVisible({ status: "approved", publishAt: "2026-01-01T12:00:00Z" }, now), true);
assert.equal(isVisible({ status: "scheduled", publishAt: "2026-01-01T12:00:00Z" }, now), true);
assert.equal(isVisible({ status: "draft", publishAt: undefined }, now), false);
assert.equal(isVisible({ status: "approved", publishAt: "2026-06-01T12:00:00Z" }, now), false);
assert.equal(isVisible({ status: "draft", posted: true, publishAt: undefined }, now), true);
assert.equal(isVisible({ status: "hidden", posted: true, publishAt: undefined }, now), false);
assert.equal(isVisible({ status: "hidden", posted: false, publishAt: "2026-01-01T12:00:00Z" }, now), false);

assert.equal(postStateDocumentId("post-freeze-tips"), "postState.post-freeze-tips");

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

// Hidden posts leave feeds that use getPosts (same filter as /journal).
assert.match(readFileSync("src/app/sitemap.ts", "utf8"), /\bgetPosts\b/);
assert.match(readFileSync("src/app/journal/rss.xml/route.ts", "utf8"), /\bgetPosts\b/);

const wf = JSON.parse(readFileSync("automation/n8n/social-approval-queue.json", "utf8")) as {
  nodes: { name: string; parameters?: { jsCode?: string } }[];
};
const build = wf.nodes.find((n) => n.name === "Build the Sanity update");
assert.ok(build?.parameters?.jsCode?.includes("createIfNotExists"), "n8n final Sanity patch must create postState when missing");
assert.match(build!.parameters!.jsCode!, /lastProblem/);

console.log("journal checks passed");