// Checks the weekly draft wrapper (TOL-3371): the dry run works without a key and costs nothing, an
// Opus/Fable model is refused, and the launchd template fires on Sunday (Weekday 0) and points at the wrapper.
// Run: node --experimental-strip-types scripts/check-weekly-draft.ts
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const sh = "scripts/content/run-weekly-draft.sh";
const env = { ...process.env, ANTHROPIC_API_KEY: "", ANTHROPIC_API_KEY_FILE: "", DRAFT_OUT_ROOT: `${process.env.TMPDIR ?? "/tmp"}/sl-weekly-check` };

const dry = spawnSync("bash", [sh, "--dry-run"], { env, encoding: "utf8" });
assert.equal(dry.status, 0, `dry run failed: ${dry.stderr}`);
assert.match(dry.stdout, /weekly draft: week=\d{4}-\d{2}-\d{2}/);
assert.match(dry.stdout, /LOCAL EVENTS near this week/, "wrapper dry-run must echo draft-week prompt");

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

// launchd starts jobs with PATH=/usr/bin:/bin:/usr/sbin:/sbin, which has no node or gcloud. The first
// scheduled run died with "node: command not found" (exit 127). Under that PATH the wrapper must either
// work (it adds the Homebrew dirs) or stop with its own exit 3 naming the tool; never a bare 127.
const launchdPath = spawnSync("bash", [sh, "--dry-run"], { env: { ...env, PATH: "/usr/bin:/bin:/usr/sbin:/sbin" }, encoding: "utf8" });
assert.ok(
  launchdPath.status === 0 || (launchdPath.status === 3 && /'node' not found on PATH/.test(launchdPath.stderr)),
  `under launchd's PATH the wrapper exited ${launchdPath.status}: ${launchdPath.stderr}`,
);
assert.match(plist, /<key>PATH<\/key><string>[^<]*\/opt\/homebrew\/bin/, "plist must set a PATH that includes Homebrew");

// The installer renders the template with the real checkout path and home, leaves no placeholder, and
// writes a valid plist. --no-load keeps the check from touching launchctl (a real job could be loaded).
const installer = "scripts/content/install-weekly-schedule.sh";
const shown = spawnSync("bash", [installer], { encoding: "utf8" });
assert.equal(shown.status, 0, shown.stderr);
assert.ok(!shown.stdout.includes("REPLACE_ME"), "rendered plist still has a placeholder");
const wrapperPath = /<string>([^<]*run-weekly-draft\.sh)<\/string>/.exec(shown.stdout)?.[1];
assert.ok(wrapperPath && existsSync(wrapperPath), `rendered plist points at ${wrapperPath}, which does not exist`);
const fakeHome = mkdtempSync(join(tmpdir(), "sl-install-"));
const agents = join(fakeHome, "LaunchAgents");
const ienv = { ...process.env, HOME: fakeHome, LAUNCH_AGENTS_DIR: agents };
const dest = join(agents, "com.tolowa.seasonally-living.draft-week.plist");
const inst = spawnSync("bash", [installer, "--install", "--no-load"], { env: ienv, encoding: "utf8" });
assert.equal(inst.status, 0, inst.stderr);
assert.ok(existsSync(dest) && !readFileSync(dest, "utf8").includes("REPLACE_ME"), "install must write a filled-in plist");
if (process.platform === "darwin") {
  assert.equal(spawnSync("plutil", ["-lint", dest]).status, 0, "installed plist must lint");
}
const gone = spawnSync("bash", [installer, "--uninstall", "--no-load"], { env: ienv, encoding: "utf8" });
assert.equal(gone.status, 0, gone.stderr);
assert.ok(!existsSync(dest), "uninstall must remove the plist");
assert.equal(spawnSync("bash", [installer, "--bogus"], { encoding: "utf8" }).status, 2, "unknown flag must be refused");

console.log("weekly-draft checks passed");
