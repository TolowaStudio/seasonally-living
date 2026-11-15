// Checks the weekly draft wrapper (TOL-3371): the dry run works without a key and costs nothing, an
// Opus/Fable model is refused, and the launchd template fires on Sunday (Weekday 0) and points at the wrapper.
// Run: node --experimental-strip-types scripts/check-weekly-draft.ts
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const sh = "scripts/content/run-weekly-draft.sh";
const env = { ...process.env, ANTHROPIC_API_KEY: "", ANTHROPIC_API_KEY_FILE: "", DRAFT_OUT_ROOT: `${process.env.TMPDIR ?? "/tmp"}/sl-weekly-check` };

const dry = spawnSync("bash", [sh, "--dry-run"], { env, encoding: "utf8" });
assert.equal(dry.status, 0, `dry run failed: ${dry.stderr}`);
assert.match(dry.stdout, /weekly draft: week=\d{4}-\d{2}-\d{2}/);

const opus = spawnSync("bash", [sh, "--dry-run"], { env: { ...env, DRAFT_MODEL: "claude-opus-5-5" }, encoding: "utf8" });
assert.equal(opus.status, 2, "an Opus model must be refused for the unattended run");

const plist = readFileSync("automation/launchd/com.tolowa.seasonally-living.draft-week.plist", "utf8");
assert.match(plist, /<key>Weekday<\/key><integer>0<\/integer>/, "must fire on Sunday");
assert.ok(plist.includes("scripts/content/run-weekly-draft.sh"), "must call the wrapper");

console.log("weekly-draft checks passed");
