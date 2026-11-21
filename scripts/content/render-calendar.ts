// Cam's content calendar view: weekly rhythm, season, local hooks and dated valley events.
// Nothing is posted or generated; this only reads src/content/calendar.ts and prints markdown.
//
//   node --experimental-strip-types scripts/content/render-calendar.ts [--week YYYY-MM-DD] [--weeks N] [--out file.md]
//
// --week must be a Monday (default: the coming Monday). --weeks is how many weeks ahead to list (default 4).
import { writeFileSync } from "node:fs";
import {
  LOCAL_EVENTS,
  LOCAL_HOOKS,
  SEASONS,
  WEEKLY_RHYTHM,
  addCalendarDays,
  eventsBetween,
  eventsInWeek,
  seasonOf,
  type Day,
  type Slot,
} from "../../src/content/calendar.ts";

const args = process.argv.slice(2);
const opt = (name: string) => {
  const i = args.indexOf(`--${name}`);
  if (i < 0) return undefined;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) throw new Error(`--${name} needs a value`);
  return v;
};

function comingMonday(): string {
  const d = new Date();
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const week = opt("week") ?? comingMonday();
if (!/^\d{4}-\d{2}-\d{2}$/.test(week) || new Date(`${week}T12:00:00Z`).getUTCDay() !== 1) {
  throw new Error(`--week must be a Monday as YYYY-MM-DD (got ${week})`);
}
const weeks = Math.max(1, Math.min(12, Number(opt("weeks") ?? "4") || 4));
const outFile = opt("out");

const DAY_INDEX: Record<Day, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

function slotLine(slot: Slot, date: string): string {
  const input =
    slot.input === "arrival" ? "needs **arrival** facts from the shop" : slot.input === "video" ? "needs a **video** transcript or description" : "no extra input";
  const fmt = slot.article ? "journal + social" : "social only";
  return `| ${slot.day} ${date} | ${slot.kind} | ${fmt} | ${input} |`;
}

let md = `# Content calendar (Cam view)\n\nGenerated ${new Date().toISOString().slice(0, 10)}. Event windows are **typical** — confirm this year's dates before posting.\n\n`;

md += `## Weekly rhythm\n\n| Day | Slot | Format | Input |\n| --- | --- | --- | --- |\n`;
for (const slot of WEEKLY_RHYTHM) {
  md += slotLine(slot, `—`) + "\n";
}

for (let w = 0; w < weeks; w++) {
  const monday = addCalendarDays(week, w * 7);
  const season = seasonOf(new Date(`${monday}T12:00:00`));
  const month = Number(monday.slice(5, 7));
  const hooks = LOCAL_HOOKS.filter((h) => h.months.includes(month)).map((h) => h.hook);
  const ev = eventsInWeek(monday);

  md += `\n## Week of ${monday}\n\n**Season:** ${season}. **Angles:** ${SEASONS[season].angles.join("; ")}\n\n`;
  md += `### Posts this week\n\n| Day | Slot | Format | Input |\n| --- | --- | --- | --- |\n`;
  for (const slot of WEEKLY_RHYTHM) {
    const date = addCalendarDays(monday, DAY_INDEX[slot.day]);
    md += slotLine(slot, date) + "\n";
  }

  md += `\n### Local hooks (no fixed dates)\n\n`;
  md += hooks.length ? hooks.map((h) => `- ${h}`).join("\n") : "- (none for this month)\n";

  md += `\n### Local events touching this week\n\n`;
  if (ev.length) {
    for (const e of ev) {
      md += `- **${e.name}** (${e.place}), typical ~${e.startMd}–${e.endMd} — ${e.hook}\n`;
    }
  } else md += "- (none in the typical event list)\n";
}

const horizonEnd = addCalendarDays(week, weeks * 7 - 1);
const onHorizon = eventsBetween(week, horizonEnd);
md += `\n## All listed events on the horizon (${week} → ${horizonEnd})\n\n`;
for (const e of onHorizon.length ? onHorizon : LOCAL_EVENTS.filter(() => false)) {
  md += `- **${e.name}** (${e.place}), typical ~${e.startMd}–${e.endMd} — ${e.hook}\n`;
}
if (!onHorizon.length) md += "- (none overlap this range)\n";

md += `\n## Full event list (reference)\n\n`;
for (const e of LOCAL_EVENTS) {
  md += `- **${e.name}** (${e.place}), ~${e.startMd}–${e.endMd} — ${e.hook}\n`;
}

if (outFile) {
  writeFileSync(outFile, md);
  console.log(`Wrote ${outFile}`);
} else {
  process.stdout.write(md);
}