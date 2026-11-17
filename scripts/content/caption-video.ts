// Clean up a timed caption file for a shop video: SRT or WebVTT in, platform-ready SRT + WebVTT out, plus
// a plain transcript for draft-from-transcript.ts and a short report of anything to check (TOL-3371).
//
//   node --experimental-strip-types scripts/content/caption-video.ts <captions.srt|.vtt> [options]
//
// Options
//   --video <file>   The video these captions belong to. Needs ffprobe; flags captions that run past the
//                    end of the video (the usual sign they came from a different cut).
//   --name <slug>    Output file stem. Default: the caption file's name.
//   --out <dir>      Default out/content-drafts/captions (gitignored)
//
// Get the captions wherever suits: Descript, a phone's transcript export, YouTube auto-captions, Whisper.
// This script makes NO speech-to-text call, uploads nothing and posts nothing. Facebook accepts the .srt
// as a caption file when a video is uploaded; Instagram has no caption-file upload, so Reels/feed video
// need the captions burned in by an editor (see docs/content-engine.md). A person reads the report and
// watches the video once before anything is approved.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { lintCues, parseCaptions, reflow, toSrt, toTranscript, toVtt } from "./captions.ts";

const args = process.argv.slice(2);
if (!args.length || args.includes("--help") || args.includes("-h")) {
  console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").filter((l) => l.startsWith("//")).map((l) => l.slice(3)).join("\n"));
  process.exit(args.length ? 0 : 1);
}
const opt = (name: string) => {
  const i = args.indexOf(`--${name}`);
  if (i < 0) return undefined;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) throw new Error(`--${name} needs a value`);
  return v;
};
const flagValues = new Set(["video", "name", "out"].map((n) => opt(n)).filter(Boolean));
const file = args.find((a) => !a.startsWith("--") && !flagValues.has(a));
if (!file) throw new Error("Pass the caption file (.srt or .vtt) first.");

const raw = readFileSync(file, "utf8");
const parsed = parseCaptions(raw);
if (!parsed.length) throw new Error(`No timed captions found in ${file}. Is it an SRT or WebVTT file?`);

const cues = reflow(parsed);
const notes = lintCues(cues);

const video = opt("video");
if (video) {
  const probe = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", video], { encoding: "utf8" });
  const seconds = Number.parseFloat(probe.stdout);
  if (probe.status !== 0 || !Number.isFinite(seconds)) throw new Error(`ffprobe could not read the duration of ${video}`);
  const lastEnd = cues[cues.length - 1].end;
  if (lastEnd > seconds * 1000 + 1000) notes.push(`Captions run to ${(lastEnd / 1000).toFixed(1)} s but the video is ${seconds.toFixed(1)} s. They may belong to a different cut.`);
  if (lastEnd < seconds * 1000 * 0.5) notes.push(`Captions stop at ${(lastEnd / 1000).toFixed(1)} s of a ${seconds.toFixed(1)} s video. Part of the speech may be uncaptioned.`);
}

const outDir = resolve(opt("out") ?? "out/content-drafts/captions");
const stem = (opt("name") ?? basename(file, extname(file))).replace(/[^\w.-]+/g, "-");
const targets = { srt: join(outDir, `${stem}.srt`), vtt: join(outDir, `${stem}.vtt`), txt: join(outDir, `${stem}.transcript.txt`), report: join(outDir, `${stem}.captions-report.md`) };
for (const t of Object.values(targets)) if (resolve(t) === resolve(file)) throw new Error(`Output would overwrite the input (${file}). Use --name or --out.`);
mkdirSync(outDir, { recursive: true });
writeFileSync(targets.srt, toSrt(cues));
writeFileSync(targets.vtt, toVtt(cues));
writeFileSync(targets.txt, toTranscript(cues));
writeFileSync(
  targets.report,
  `# Captions: ${stem}\n\n${cues.length} cues (from ${parsed.length}), ${((cues[cues.length - 1].end - cues[0].start) / 1000).toFixed(1)} s of speech.\n\n` +
    (notes.length ? `## Check before using\n\n${notes.map((n) => `- ${n}`).join("\n")}\n` : "No problems flagged. Still watch the video once with the captions on.\n") +
    `\nSpeech-to-text mishears names, model numbers and numbers. Read every cue against the audio.\n`,
);
console.log(`Captions: ${cues.length} cues\n  -> ${targets.srt}\n  -> ${targets.vtt}\n  -> ${targets.txt} (feed to draft-from-transcript.ts)\n  ${notes.length} item(s) to check${existsSync(targets.report) ? ` (${targets.report})` : ""}. Nothing was uploaded or posted.`);
