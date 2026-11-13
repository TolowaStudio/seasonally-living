// Draft a week of content: one post per slot in src/content/calendar.ts, each with a journal article
// (where the slot calls for one) plus Facebook, Instagram and Google Business Profile versions.
//
//   node --experimental-strip-types scripts/content/draft-week.ts [options]
//
// Options
//   --week YYYY-MM-DD     Monday of the week to draft (default: the coming Monday)
//   --theme "text"        A theme to lean on all week, e.g. "freeze prep" or "pool planning"
//   --season <s>          winter | spring | summer | fall (default: from --week)
//   --mix hearth=2,hot-tub=1   How many slots lean on each line (default: the season's lead lines)
//   --only Mon,Fri        Draft only these days (cheap test)
//   --arrival "text"      Facts for the Wednesday arrival post (model, year, seats, what the shop did). Or --arrival-file
//   --video "text"        What the Saturday video shows. Or --video-file / see draft-from-transcript.ts
//   --model <id>          Default claude-haiku-5-5 (try claude-sonnet-5-5 for polish)
//   --out <dir>           Default out/content-drafts (gitignored)
//   --dry-run             Print the first prompt and exit. No API call, no cost.
//
// DRAFT ONLY. This writes JSON files and a readable preview.md to disk. It never touches Sanity,
// Facebook, Instagram or Google. A person reviews each file, then import-drafts.ts (opt-in) loads them
// into Sanity as status "draft".
//
// Key: ANTHROPIC_API_KEY, or ANTHROPIC_API_KEY_FILE=<file holding it>. Find the secret with
// `motion-credential-probe anthropic`. The key is never printed.
import { readFileSync, writeFileSync } from "node:fs";
import { LOCAL_HOOKS, SEASONS, WEEKLY_RHYTHM, heroFor, seasonOf, type Day, type Line, type Slot } from "../../src/content/calendar.ts";
import { DEFAULT_MODEL, callWriter, pacificOffset, previewMarkdown, toPostDoc, writeJson } from "./lib.ts";

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").filter((l) => l.startsWith("//")).map((l) => l.slice(3)).join("\n"));
  process.exit(0);
}
const opt = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const text = (name: string) => opt(name) ?? (opt(`${name}-file`) ? readFileSync(opt(`${name}-file`)!, "utf8").trim() : undefined);

const DAY_INDEX: Record<Day, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

function comingMonday(): string {
  const d = new Date();
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  return d.toISOString().slice(0, 10);
}
const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

const week = opt("week") ?? comingMonday();
if (!/^\d{4}-\d{2}-\d{2}$/.test(week) || new Date(`${week}T12:00:00Z`).getUTCDay() !== 1) throw new Error(`--week must be a Monday as YYYY-MM-DD (got ${week})`);
const season = (opt("season") as keyof typeof SEASONS | undefined) ?? seasonOf(new Date(`${week}T12:00:00`));
if (!SEASONS[season]) throw new Error(`--season must be one of ${Object.keys(SEASONS).join(", ")}`);
const model = opt("model") ?? DEFAULT_MODEL;
const outDir = `${opt("out") ?? "out/content-drafts"}/${week}`;
const only = opt("only")?.split(",").map((d) => d.trim());
const theme = opt("theme");
const arrival = text("arrival");
const video = text("video");

// Line mix: "hearth=2,hot-tub=1" expands to a rotation; otherwise the season's lead lines rotate.
const rotation: Line[] = opt("mix")
  ? opt("mix")!.split(",").flatMap((p) => {
      const [line, n] = p.split("=");
      return Array(Math.max(1, Number(n) || 1)).fill(line.trim() as Line);
    })
  : [...SEASONS[season].lead, ...SEASONS[season].also.slice(0, 1)];

const month = Number(week.slice(5, 7));
const hooks = LOCAL_HOOKS.filter((h) => h.months.includes(month)).map((h) => h.hook);

function prompt(slot: Slot, date: string, line: Line): string {
  const input =
    slot.input === "arrival" ? arrival ?? "(none supplied: write the post with [[ADD: ...]] placeholders for every spec, never invent them)"
    : slot.input === "video" ? video ?? "(none supplied: write a caption template with [[ADD: what the video shows]] placeholders)"
    : "(none)";
  return `Draft one piece of content for ${date} (${slot.day}).

SLOT: ${slot.kind}. ${slot.brief}
SEASON: ${season}. Seasonal angles you may draw on: ${SEASONS[season].angles.join("; ")}.
LEAD LINE FOR THIS POST: ${slot.lines?.[0] ?? line}${theme ? `\nWEEK THEME: ${theme}` : ""}
LOCAL HOOKS you may mention (do not state dates or times): ${hooks.join("; ") || "none"}
FORMAT: ${slot.article ? "Write a journal article (body_markdown) AND the three social versions. The social posts point readers to the article." : "Social-only: leave body_markdown as an empty string. Write the three social versions."}

INPUT (the only shop-specific facts for this post):
${input}

Return it with the submit_draft tool.`;
}

const slots = WEEKLY_RHYTHM.filter((s) => !only || only.includes(s.day));
if (!slots.length) throw new Error(`No slots match --only ${opt("only")}. Days in the calendar: ${WEEKLY_RHYTHM.map((s) => s.day).join(", ")}`);

if (args.includes("--dry-run")) {
  console.log(`# dry run: week ${week}, season ${season}, model ${model}, ${slots.length} slot(s)\n`);
  console.log(prompt(slots[0], addDays(week, DAY_INDEX[slots[0].day]), rotation[0]));
  process.exit(0);
}

console.log(`Drafting ${slots.length} post(s) for the week of ${week} (${season}) with ${model}`);
let preview = `# Week of ${week}: drafts to proof\n\nNothing here is approved or posted. Each post is a JSON file beside this page.\n\n`;
let inTok = 0;
let outTok = 0;
let n = 0;
for (const slot of slots) {
  const date = addDays(week, DAY_INDEX[slot.day]);
  const line = rotation[n % rotation.length];
  const { draft, usage } = await callWriter({ model, user: prompt(slot, date, line) });
  inTok += usage.input;
  outTok += usage.output;
  const lines = (slot.lines ?? [line]) as Line[];
  const doc = toPostDoc(draft, {
    season,
    article: slot.article,
    publishAt: `${date}T08:00:00${pacificOffset(date)}`,
    hero: heroFor(draft.tags.length ? (draft.tags as Line[]) : lines, season, n),
    notes: slot.input !== "none" && !(slot.input === "arrival" ? arrival : video) ? [`TEMPLATE: no ${slot.input} details were supplied (--${slot.input}), so nothing here is true yet. Fill every [[ADD]] or delete the post.`] : [],
    meta: { generatedAt: new Date().toISOString(), model, slot: slot.kind, day: slot.day, week, theme: theme ?? null, usage },
  });
  const file = `${outDir}/${String(++n).padStart(2, "0")}-${slot.day.toLowerCase()}-${slot.kind}-${doc.slug.current}.json`;
  writeJson(file, doc);
  preview += previewMarkdown(doc, `${slot.day} ${date} (${slot.kind})`);
  console.log(`  ${slot.day} ${slot.kind}: "${doc.title}" -> ${file}${doc.needsConfirm.length ? `  [${doc.needsConfirm.length} to check]` : ""}`);
}
writeFileSync(`${outDir}/preview.md`, preview);
console.log(`Preview for proofing: ${outDir}/preview.md\nTokens: ${inTok} in, ${outTok} out (${model}). Nothing was sent anywhere.`);
