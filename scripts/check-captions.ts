// Checks the caption tooling (TOL-3371, video half): SRT/VTT parsing, re-cutting long cues without losing
// words or time, the lint list, the CLI end to end (including the video-length check and the
// never-overwrite-the-input rule), and that draft-from-transcript.ts accepts a caption file and sends the
// model only the speech.
// Run: node --experimental-strip-types scripts/check-captions.ts
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { LIMITS, looksLikeCaptions, lintCues, parseCaptions, reflow, toSrt, toTranscript, toVtt, wrapWords } from "./content/captions.ts";

const words = (cues: { text: string }[]) => cues.flatMap((c) => c.text.split(/\s+/)).filter(Boolean);

// --- parsing: SRT and VTT give the same cues; markup, notes and cue settings are dropped
const srt = "\uFEFF1\r\n00:00:01,000 --> 00:00:03,500\r\n<i>Hot tubs</i> need a level pad.\r\n\r\n2\r\n00:00:04,000 --> 00:00:06,000\r\nEvery time.\r\n";
const vtt = `WEBVTT

NOTE made by a tool

STYLE
::cue { color: red }

intro
00:01.000 --> 00:03.500 align:start position:0%
<c.yellow>Hot tubs</c.yellow> need a level pad.

00:00:04.000 --> 00:00:06.000
Every   time.
`;
const a = parseCaptions(srt);
const b = parseCaptions(vtt);
assert.deepEqual(a, [{ start: 1000, end: 3500, text: "Hot tubs need a level pad." }, { start: 4000, end: 6000, text: "Every time." }]);
assert.deepEqual(b, a, "VTT (with header, NOTE, STYLE, id, settings, short timestamps) must parse to the same cues as SRT");
assert.deepEqual(parseCaptions("just words, no timing"), []);

// --- round trip through both writers
assert.deepEqual(parseCaptions(toSrt(a)), a);
assert.deepEqual(parseCaptions(toVtt(a)), a);
assert.ok(toVtt(a).startsWith("WEBVTT\n\n00:00:01.000 --> 00:00:03.500"));
assert.ok(toSrt(a).startsWith("1\n00:00:01,000 --> 00:00:03,500"));

// --- reflow: one 20 s, 300-character cue becomes many legal cues covering the same words and the same time
const long = "We set the steel wall first, then the crew levels the pad and checks it twice before anyone brings the spa near it, because a spa on an uneven pad can crack its shell over the first winter and nobody wants that call on a cold morning.";
const [one] = parseCaptions(`1\n00:00:10,000 --> 00:00:30,000\n${long}\n`);
const cut = reflow([one]);
assert.ok(cut.length >= 3, `expected the long cue to be split, got ${cut.length}`);
assert.deepEqual(words(cut), long.split(/\s+/), "no word may be lost, added or reordered");
assert.equal(cut[0].start, 10_000);
assert.equal(cut[cut.length - 1].end, 30_000, "the whole time span stays covered");
cut.forEach((c, i) => {
  assert.ok(c.text.split("\n").length <= LIMITS.maxLines, `cue ${i} has too many lines`);
  assert.ok(c.text.split("\n").every((l) => l.length <= LIMITS.maxLineChars), `cue ${i} has a line over ${LIMITS.maxLineChars}`);
  assert.ok(c.end - c.start <= LIMITS.maxCueMs, `cue ${i} stays up too long`);
  if (i) assert.equal(c.start, cut[i - 1].end, "pieces must be contiguous");
});
assert.deepEqual(lintCues(cut), [], "a reflowed cue set must lint clean");
assert.deepEqual(reflow(a), a.map((c) => ({ ...c })), "cues that already fit are left alone");
assert.deepEqual(wrapWords("aaaa bbbb cccc".split(" "), 9), ["aaaa bbbb", "cccc"]);

// --- lint on bad input
const bad = parseCaptions(`1\n00:00:00,000 --> 00:00:09,000\n${long}\n\n2\n00:00:08,000 --> 00:00:08,200\nHi\n`);
const notes = lintCues(bad).join("\n");
assert.match(notes, /longer than 2 lines/);
assert.match(notes, /over 7 seconds/);
assert.match(notes, /overlaps the cue before it/);
assert.match(notes, /under 700 ms/);

// --- transcript has speech only
const transcript = toTranscript(a);
assert.equal(transcript, "Hot tubs need a level pad. Every time.\n");
assert.ok(!/-->|\d:\d\d/.test(transcript));
assert.ok(looksLikeCaptions("x.srt", "") && looksLikeCaptions("x.txt", "WEBVTT\n") && looksLikeCaptions("x.txt", srt) && !looksLikeCaptions("x.txt", "plain speech. nothing timed."));

// --- CLI end to end
const dir = mkdtempSync(join(tmpdir(), "sl-captions-"));
try {
  const run = (script: string, ...rest: string[]) => spawnSync("node", ["--experimental-strip-types", "--no-warnings", script, ...rest], { encoding: "utf8" });
  const src = join(dir, "shoot.srt");
  writeFileSync(src, `1\n00:00:00,500 --> 00:00:09,000\n${long}\n`);
  const out = join(dir, "out");
  const r = run("scripts/content/caption-video.ts", src, "--out", out, "--name", "pool-install");
  assert.equal(r.status, 0, r.stderr);
  for (const ext of ["srt", "vtt", "transcript.txt", "captions-report.md"]) assert.ok(existsSync(join(out, `pool-install.${ext}`)), `missing .${ext}`);
  const cleaned = parseCaptions(readFileSync(join(out, "pool-install.srt"), "utf8"));
  assert.deepEqual(words(cleaned), long.split(/\s+/));
  assert.match(readFileSync(join(out, "pool-install.captions-report.md"), "utf8"), /No problems flagged/);
  assert.match(r.stdout, /Nothing was uploaded or posted/);

  // never overwrite the input
  const clash = run("scripts/content/caption-video.ts", src, "--out", dir);
  assert.notEqual(clash.status, 0, "writing over the input file must be refused");
  assert.equal(readFileSync(src, "utf8").startsWith("1\n00:00:00,500"), true, "the input must be untouched");

  // not a caption file
  const txt = join(dir, "notes.txt");
  writeFileSync(txt, "just a transcript with no timing at all");
  assert.notEqual(run("scripts/content/caption-video.ts", txt, "--out", out).status, 0);

  // video-length check (needs ffmpeg/ffprobe, present on the CI runner)
  if (spawnSync("ffmpeg", ["-version"]).status === 0 && spawnSync("ffprobe", ["-version"]).status === 0) {
    const mp4 = join(dir, "clip.mp4");
    const mk = spawnSync("ffmpeg", ["-v", "error", "-f", "lavfi", "-i", "testsrc=size=160x90:rate=10:duration=3", "-pix_fmt", "yuv420p", mp4], { encoding: "utf8" });
    assert.equal(mk.status, 0, mk.stderr);
    const long20 = join(dir, "long.srt");
    writeFileSync(long20, "1\n00:00:00,000 --> 00:00:03,000\nShort.\n\n2\n00:00:15,000 --> 00:00:20,000\nFar past the end of a three second clip.\n");
    const v = run("scripts/content/caption-video.ts", long20, "--video", mp4, "--out", out, "--name", "wrong-cut");
    assert.equal(v.status, 0, v.stderr);
    assert.match(readFileSync(join(out, "wrong-cut.captions-report.md"), "utf8"), /may belong to a different cut/);
    const fits = join(dir, "fits.srt");
    writeFileSync(fits, "1\n00:00:00,200 --> 00:00:02,800\nThis one fits the clip.\n");
    run("scripts/content/caption-video.ts", fits, "--video", mp4, "--out", out, "--name", "right-cut");
    assert.match(readFileSync(join(out, "right-cut.captions-report.md"), "utf8"), /No problems flagged/);
  } else console.log("ffmpeg/ffprobe not found: skipped the video-length check");

  // draft-from-transcript takes a caption file and shows the model only the speech (dry run: no key, no cost)
  const dry = run("scripts/content/draft-from-transcript.ts", src, "--dry-run", "--date", "2026-11-17");
  assert.equal(dry.status, 0, dry.stderr);
  assert.ok(dry.stdout.includes("We set the steel wall first"), "the speech must reach the prompt");
  assert.ok(!dry.stdout.includes("-->"), "caption timing must not reach the prompt");
} finally {
  rmSync(dir, { recursive: true, force: true });
}

console.log("caption checks passed");
