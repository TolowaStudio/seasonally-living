// Checks the weekly draft wrapper (TOL-3371, TS-4129): no paid API key, subscription fallback, dry run
// makes no model call, Opus/Fable refused, launchd template on Sunday.
// Run: node --experimental-strip-types scripts/check-weekly-draft.ts
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { refuseUnattendedModel, runWriterTiers, type TierAttempt } from "./content/writer-runner.ts";

const sh = "scripts/content/run-weekly-draft.sh";
const env = { ...process.env, DRAFT_WRITER_FORBIDDEN: "1", DRAFT_OUT_ROOT: `${process.env.TMPDIR ?? "/tmp"}/sl-weekly-check` };

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

// launchd starts jobs with PATH=/usr/bin:/bin:/usr/sbin:/sbin, which has no node. The first
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

// TS-4129: wrapper must not read GSM or env API keys
assert.ok(!wrapper.includes("gcloud secrets"), "wrapper must not read a GCP secret");
assert.ok(!wrapper.includes("ANTHROPIC_API_KEY"), "wrapper must not set ANTHROPIC_API_KEY");
for (const dir of ["scripts/content", "automation"]) {
  for (const file of readdirSync(dir, { recursive: true })) {
    if (typeof file !== "string" || !/\.(ts|sh|md)$/.test(file) || file.includes("history-notes")) continue;
    const path = join(dir, file);
    const text = readFileSync(path, "utf8");
    for (const needle of ["motion-anthropic-api-key", "ANTHROPIC_API_KEY", "api.anthropic.com"]) {
      assert.ok(!text.includes(needle), `${path} must not reference ${needle} (use history-notes if documenting rollback)`);
    }
  }
}

// Dry run must not invoke the writer (guard env would trip callWriter)
const guardedDry = spawnSync(
  "node",
  ["--experimental-strip-types", "scripts/content/draft-week.ts", "--dry-run", "--only", "Mon"],
  { env: { ...process.env, DRAFT_WRITER_FORBIDDEN: "1" }, encoding: "utf8" },
);
assert.equal(guardedDry.status, 0, guardedDry.stderr);

// Simulated Claude limit falls through to Neon then Composer
const order: string[] = [];
const mockDraft = {
  title: "Test",
  excerpt: "One.",
  tags: ["local"],
  body_markdown: "",
  facebook: "fb",
  instagram_caption: "ig",
  instagram_hashtags: ["#wenatchee"],
  gbp_text: "gbp",
  gbp_cta: "LEARN_MORE",
  needs_confirm: [] as string[],
};
const simTiers: TierAttempt[] = [
  {
    tier: "claude-max",
    run: () => {
      order.push("claude-max");
      throw Object.assign(new Error("rate limit"), { fallback: true });
    },
  },
  {
    tier: "neon",
    run: () => {
      order.push("neon");
      throw Object.assign(new Error("neon not signed in"), { fallback: true });
    },
  },
  {
    tier: "composer",
    run: (opts) => {
      order.push("composer");
      return { draft: mockDraft, usage: { input: 1, output: 2 }, tier: "composer", model: opts.model };
    },
  },
];
const fall = runWriterTiers({ model: "claude-haiku-5-5", user: "draft this" }, simTiers);
assert.deepEqual(order, ["claude-max", "neon", "composer"]);
assert.equal(fall.tier, "composer");

assert.throws(() => refuseUnattendedModel("claude-opus-5-5"));
process.env.DRAFT_WRITER_FORBIDDEN = "1";
assert.throws(() => runWriterTiers({ model: "claude-haiku-5-5", user: "x" }), /DRAFT_WRITER_FORBIDDEN/);
delete process.env.DRAFT_WRITER_FORBIDDEN;

console.log("weekly-draft checks passed");
