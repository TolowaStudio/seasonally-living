// Checks the weekly draft wrapper (TOL-3371, TS-4129): no paid API key, subscription fallback, dry run
// makes no model call, Opus/Fable refused, launchd template on Sunday.
// Run: node --experimental-strip-types scripts/check-weekly-draft.ts
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { commitContentDrafts, previewMarkdown, type PostDoc } from "./content/lib.ts";
import {
  isTierFallbackError,
  refuseUnattendedModel,
  runWriterTiers,
  subscriptionWriterEnv,
  tierLabel,
  type TierAttempt,
} from "./content/writer-runner.ts";

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

// Subscription child env must not pass paid API keys into CLIs
assert.ok(!("ANTHROPIC_API_KEY" in subscriptionWriterEnv({ ANTHROPIC_API_KEY: "sk-test", FOO: "bar" })));
assert.ok(!("ANTHROPIC_API_KEY_FILE" in subscriptionWriterEnv({ ANTHROPIC_API_KEY_FILE: "/tmp/key", FOO: "bar" })));

assert.ok(isTierFallbackError("Claude AI usage limit reached", 1, null), "usage-limit stderr must trigger fallback");
assert.ok(isTierFallbackError("", 127, null), "missing CLI exit 127 must trigger fallback");

assert.equal(tierLabel("neon", "claude-haiku-5-5"), "neon (antigravity)");
assert.equal(tierLabel("composer", "claude-haiku-5-5"), "composer (cursor agent)");

const stubPost = {
  title: "Stub",
  slug: { _type: "slug" as const, current: "stub" },
  tags: ["local"],
  season: "winter" as const,
  heroImage: "x",
  heroAlt: "x",
  excerpt: "x",
  body: [],
  social: {
    facebook: "fb",
    instagram: { caption: "ig", hashtags: ["#wenatchee"] },
    gbp: { text: "gbp", cta: "LEARN_MORE" as const },
  },
  channels: ["facebook"],
  needsConfirm: [],
  status: "draft" as const,
  publishAt: "2026-01-01T08:00:00-08:00",
  _draftMeta: {},
} satisfies PostDoc;
const previewChunk = previewMarkdown(stubPost, "Mon 2026-01-05 (local)", "neon (antigravity)");
assert.match(previewChunk, /\*\*Writer tier:\*\* neon \(antigravity\)/);

// No partial JSON on disk when a later slot fails (draft-week defers commitContentDrafts)
const partialDir = mkdtempSync(join(tmpdir(), "sl-partial-draft-"));
assert.throws(() => {
  const wouldCommit = [{ file: join(partialDir, "01-mon-local-stub.json"), doc: { _type: "post" }, previewChunk: previewChunk }];
  assert.equal(wouldCommit.length, 1, "slot 1 succeeded in memory only");
  throw new Error("tier exhausted on slot 2");
}, /tier exhausted/);
assert.deepEqual(readdirSync(partialDir), [], "failed mid-week run must not leave JSON files");
commitContentDrafts(partialDir, `# Week\n\n${previewChunk}`, [
  { file: join(partialDir, "01-mon-local-stub.json"), doc: stubPost, previewChunk: "" },
]);
const previewPath = join(partialDir, "preview.md");
assert.ok(existsSync(previewPath));
assert.match(readFileSync(previewPath, "utf8"), /\*\*Writer tier:\*\* neon \(antigravity\)/);

function tierFailure(stderr: string, exitCode: number | null): Error & { fallback?: boolean } {
  const err = new Error(`claude-max exited ${exitCode}: ${stderr}`) as Error & { fallback?: boolean };
  err.fallback = isTierFallbackError(stderr, exitCode, null);
  return err;
}

// Simulated Claude limit falls through to Neon then Composer (classifier sets fallback, not a baked-in flag)
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
      throw tierFailure("Claude AI usage limit reached", 1);
    },
  },
  {
    tier: "neon",
    run: () => {
      order.push("neon");
      throw tierFailure("not signed in", 1);
    },
  },
  {
    tier: "composer",
    run: () => {
      order.push("composer");
      return { draft: mockDraft, usage: { input: 1, output: 2 }, tier: "composer", model: "composer" };
    },
  },
];
const fall = runWriterTiers({ model: "claude-haiku-5-5", user: "draft this" }, simTiers);
assert.deepEqual(order, ["claude-max", "neon", "composer"]);
assert.equal(fall.tier, "composer");

// Missing claude CLI is a fallback (ENOENT path)
const missingClaude: TierAttempt[] = [
  {
    tier: "claude-max",
    run: () => {
      order.push("claude-missing");
      const err = new Error("claude-max: claude not on PATH") as Error & { fallback?: boolean };
      err.fallback = true;
      throw err;
    },
  },
  {
    tier: "neon",
    run: () => ({ draft: mockDraft, usage: { input: 0, output: 0 }, tier: "neon", model: "neon" }),
  },
];
order.length = 0;
const fromMissing = runWriterTiers({ model: "claude-haiku-5-5", user: "draft" }, missingClaude);
assert.deepEqual(order, ["claude-missing"]);
assert.equal(fromMissing.tier, "neon");

assert.throws(
  () =>
    runWriterTiers({ model: "claude-haiku-5-5", user: "draft" }, [
      {
        tier: "claude-max",
        run: () => {
          throw tierFailure("quota", 1);
        },
      },
      {
        tier: "neon",
        run: () => {
          throw tierFailure("auth", 1);
        },
      },
      {
        tier: "composer",
        run: () => {
          throw tierFailure("offline", 1);
        },
      },
    ]),
  /No subscription writer tier available/,
);

assert.throws(() => refuseUnattendedModel("claude-opus-5-5"));
process.env.DRAFT_WRITER_FORBIDDEN = "1";
assert.throws(() => runWriterTiers({ model: "claude-haiku-5-5", user: "x" }), /DRAFT_WRITER_FORBIDDEN/);
delete process.env.DRAFT_WRITER_FORBIDDEN;

console.log("weekly-draft checks passed");
