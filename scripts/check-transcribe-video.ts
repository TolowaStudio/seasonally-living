// transcribe-video.sh must fail clearly when whisper is missing (TS-3293).
// Run: node --experimental-strip-types scripts/check-transcribe-video.ts
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "sl-transcribe-"));
const video = join(dir, "clip.mp4");
writeFileSync(video, Buffer.from([0, 0, 0, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d]));

const missing = spawnSync("bash", ["scripts/content/transcribe-video.sh", video], {
  encoding: "utf8",
  env: { ...process.env, WHISPER_CMD: "whisper-definitely-not-installed-3293", PATH: "/usr/bin:/bin" },
});
assert.equal(missing.status, 3, "missing whisper should exit 3");
assert.match(missing.stderr, /not found/i);

const pipeline = spawnSync("bash", ["scripts/content/run-video-pipeline.sh", video, "--skip-transcribe"], { encoding: "utf8" });
assert.equal(pipeline.status, 2, "pipeline without --srt should exit 2");

const noSrtVal = spawnSync("bash", ["scripts/content/run-video-pipeline.sh", video, "--skip-transcribe", "--srt"], { encoding: "utf8" });
assert.equal(noSrtVal.status, 2, "pipeline --srt without value should exit 2");
assert.match(noSrtVal.stderr, /--srt needs a file path/);

const pipeScript = readFileSync("scripts/content/run-video-pipeline.sh", "utf8");
assert.ok(!/ls -1 out\/content-drafts\/transcripts/.test(pipeScript), "pipeline must not guess draft json with ls");
assert.match(pipeScript, /draft-from-transcript/, "pipeline must call draft-from-transcript for --draft");

console.log("transcribe-video checks passed");