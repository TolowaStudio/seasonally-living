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

// macOS has no GNU `timeout`: the wrapper must not call it (it would exit 127 on the Mini every Sunday),
// and the portable cap it uses instead has to actually kill a runaway child.
const wrapper = readFileSync(sh, "utf8");
assert.ok(!/^\s*timeout\s/m.test(wrapper), "wrapper must not call GNU timeout (absent on stock macOS)");
assert.ok(wrapper.includes("alarm 3600"), "wrapper must cap the run at 60 minutes");
const cap = spawnSync("perl", ["-e", "alarm 1; exec @ARGV", "--", "sleep", "10"], { encoding: "utf8", timeout: 8000 });
assert.equal(cap.signal, "SIGALRM", "the perl alarm cap must kill a runaway child");

const plist = readFileSync("automation/launchd/com.tolowa.seasonally-living.draft-week.plist", "utf8");
assert.match(plist, /<key>Weekday<\/key><integer>0<\/integer>/, "must fire on Sunday");
assert.ok(plist.includes("scripts/content/run-weekly-draft.sh"), "must call the wrapper");

console.log("weekly-draft checks passed");
