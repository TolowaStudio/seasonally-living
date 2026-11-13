// Turn a video transcript (plain text) into ONE draft: a journal article plus Facebook, Instagram and
// Google versions and a video caption. Run it again with a different --angle to slice a single shoot
// (say, one pool install) into many posts.
//
//   node --experimental-strip-types scripts/content/draft-from-transcript.ts <transcript.txt> [options]
//
// Options
//   --angle "text"     What this post should focus on, e.g. "how the crew sets the steel wall"
//   --line <line>      hot-tub | swim-spa | pool | pre-owned | spa-care | hearth | venting | local
//   --season <s>       winter | spring | summer | fall (default: today's season)
//   --date YYYY-MM-DD  Date to schedule the draft for (default: tomorrow)
//   --article          Also write a journal article (default: social only)
//   --model <id>       Default claude-haiku-5-5
//   --out <dir>        Default out/content-drafts/transcripts (gitignored)
//   --dry-run          Print the prompt and exit. No API call.
//
// DRAFT ONLY, like draft-week.ts: writes a JSON file and a preview. Video upload (Google Drive, YouTube,
// Facebook) is deliberately NOT part of this; the transcript comes from wherever you made it
// (a phone's voice memo transcript, Whisper, Descript...). The model only sees the text you pass in.
import { readFileSync, writeFileSync } from "node:fs";
import { SEASONS, heroFor, seasonOf, type Line } from "../../src/content/calendar.ts";
import { DEFAULT_MODEL, callWriter, pacificOffset, previewMarkdown, toPostDoc, writeJson } from "./lib.ts";

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
const flagValues = new Set(["angle", "line", "season", "date", "model", "out"].map((n) => opt(n)).filter(Boolean));
const file = args.find((a) => !a.startsWith("--") && !flagValues.has(a));
if (!file) throw new Error("Pass the transcript file path first.");

const transcript = readFileSync(file, "utf8").trim();
if (transcript.length < 80) throw new Error("That transcript is too short to draft from.");
const MAX = 24_000; // characters; plenty for a long shoot, caps the cost
const clipped = transcript.length > MAX;
const season = (opt("season") as keyof typeof SEASONS | undefined) ?? seasonOf(new Date());
const line = (opt("line") ?? "local") as Line;
const article = args.includes("--article");
const model = opt("model") ?? DEFAULT_MODEL;
const date = opt("date") ?? (() => {
  const d = new Date(Date.now() + 86_400_000); // tomorrow, as a local calendar date
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
})();
const outDir = opt("out") ?? "out/content-drafts/transcripts";

const user = `Draft one piece of content from a video transcript.

SLOT: video. ${article ? "Write a journal article (body_markdown) AND the three social versions, plus video_hook." : "Social-only: leave body_markdown empty. Write the three social versions, plus video_hook."}
SEASON: ${season}. LEAD LINE: ${line}.${opt("angle") ? `\nANGLE for this post: ${opt("angle")}` : ""}

The transcript is speech-to-text and may contain mistakes (names, model numbers, numbers). Use ONLY what the speakers actually say. If a name, number or model is unclear or looks wrong, put it in needs_confirm and use a [[ADD: ...]] placeholder instead of guessing. Do not present any claim as a customer quote. Do not add specs or process steps that are not in the transcript.

INPUT (transcript${clipped ? `, first ${MAX} characters of ${transcript.length}` : ""}):
"""
${transcript.slice(0, MAX)}
"""

Return it with the submit_draft tool.`;

if (args.includes("--dry-run")) {
  console.log(user);
  process.exit(0);
}

const { draft, usage } = await callWriter({ model, user });
const doc = toPostDoc(draft, {
  season,
  article,
  publishAt: `${date}T08:00:00${pacificOffset(date)}`,
  hero: heroFor([line], season),
  notes: ["Drafted from a transcript. Watch the video once and check every name, number and model against it."],
  meta: { generatedAt: new Date().toISOString(), model, slot: "video-transcript", transcript: file, angle: opt("angle") ?? null, videoHook: draft.video_hook ?? null, usage },
});
const out = `${outDir}/${date}-${doc.slug.current}.json`;
writeJson(out, doc);
writeFileSync(out.replace(/\.json$/, ".preview.md"), `${previewMarkdown(doc, "Video post")}${draft.video_hook ? `\n**Video hook (first 3 seconds):** ${draft.video_hook}\n` : ""}`);
console.log(`Draft: "${doc.title}"\n  -> ${out}\n  ${doc.needsConfirm.length} item(s) to check. Tokens: ${usage.input} in, ${usage.output} out. Nothing was sent anywhere.`);
