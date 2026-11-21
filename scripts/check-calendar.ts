// Calendar data and Cam view (TS-3293).
// Run: node --experimental-strip-types scripts/check-calendar.ts
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { eventsInWeek, eventsOnDate, LOCAL_EVENTS } from "../src/content/calendar.ts";

assert.ok(LOCAL_EVENTS.length >= 5, "expected a handful of real local events");

// Apple blossom week should surface the festival.
const blossom = eventsInWeek("2026-04-27");
assert.ok(blossom.some((e) => e.name.includes("Apple Blossom")), "Apple Blossom week should list the festival");

// Mid-summer should not invent apple blossom.
const july = eventsOnDate("2026-07-15");
assert.ok(!july.some((e) => e.name.includes("Apple Blossom")), "mid-July should not show apple blossom");

const render = spawnSync("node", ["--experimental-strip-types", "scripts/content/render-calendar.ts", "--week", "2026-04-27", "--weeks", "1"], {
  encoding: "utf8",
});
assert.equal(render.status, 0, render.stderr);
assert.match(render.stdout, /Apple Blossom/);
assert.match(render.stdout, /Weekly rhythm/);

const draftDry = spawnSync(
  "node",
  ["--experimental-strip-types", "scripts/content/draft-week.ts", "--week", "2026-04-27", "--dry-run"],
  { encoding: "utf8", env: { ...process.env, ANTHROPIC_API_KEY: "", ANTHROPIC_API_KEY_FILE: "" } },
);
assert.equal(draftDry.status, 0, draftDry.stderr);
assert.match(draftDry.stdout, /LOCAL EVENTS near this week/);
assert.match(draftDry.stdout, /Apple Blossom/);

console.log("calendar checks passed");