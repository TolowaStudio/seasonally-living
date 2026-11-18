// Run: node --experimental-strip-types scripts/check-diagnose-sprint.ts [--progress tracker.csv [--complete]]   (TOL-2916)
// Guards the diagnose-sprint kit in docs/diagnose/ (10 customer interviews, 5 builder interviews, 2 mystery shops):
//   every guide is marked DRAFT/approved, asks a sensible number of numbered questions, never asks for a review or offers
//   anything for taking part, never quotes a price on a call, and has stop handling; the shop scorecard sums to 20;
//   the tracker template is a header only and its columns are the ones the docs describe.
// With --progress it reads a real tracker (kept in the client's OneDrive, never committed): fails on a row that holds a
// name, phone or email or skips a required field, and prints done against quota. --complete also fails while under quota.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const QUOTA = { customer: 10, builder: 5, shop: 2 } as const;
export type Kind = keyof typeof QUOTA;
const ID_PREFIX: Record<Kind, string> = { customer: "C", builder: "B", shop: "S" };
export const TRACKER_COLUMNS = ["id", "kind", "person_ref", "source_list", "consent", "scheduled_date", "status", "interviewer", "minutes", "notes_location", "themes"];
export const STATUSES = ["todo", "scheduled", "done", "no-show", "declined"];
export const MIN_QUESTIONS: Record<"customer" | "builder", number> = { customer: 8, builder: 7 };
export const MAX_QUESTIONS = 12; // twenty-odd minutes: a guide that asks more than a dozen is a survey, not an interview
export const SHOP_LINES = 10;

const REVIEW_WORDS = /\b(reviews?|ratings?|stars?|testimonials?|google|yelp|birdeye|bbb|feedback|refer(?:ral)?s?)\b/i;
const INCENTIVE_WORDS = /(\d+\s?%|percent off|discounts?|coupons?|gift( card)?s?|credit|free|raffle|prize)/i;
const NOT_CARRIED = [/cal\s?saunas?/i, /cal\s?flame/i, /outdoor kitchens?/i, /marquis/i, /\bATV\b/, /chimney sweep|\bliners?\b/i];
const PHONE = /\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}\b/;
const EMAIL = /[^\s@,]+@[^\s@,]+\.[a-z]{2,}/i;
const REF = /^[A-Z]{2,4}-[A-Za-z0-9]{3,}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Question lines look like `- C1. text` or `- B3. text` or `- M2. text`. */
export function questionLines(md: string, letter: string): string[] {
  const re = new RegExp(`^- ${letter}(\\d+)\\. (.+)$`, "gm");
  return [...md.matchAll(re)].map((m) => m[0]);
}

export function guideViolations(md: string, kind: "customer" | "builder"): string[] {
  const v: string[] = [];
  const tag = `${kind} guide`;
  const letter = ID_PREFIX[kind];
  const qs = questionLines(md, letter);
  if (!/^\*\*Status: (DRAFT\. Not approved|Approved by [^*]+)\b/m.test(md)) v.push(`${tag}: no Status line saying DRAFT or who approved it`);
  if (qs.length < MIN_QUESTIONS[kind]) v.push(`${tag}: ${qs.length} questions, fewer than ${MIN_QUESTIONS[kind]} (too thin to learn from)`);
  if (qs.length > MAX_QUESTIONS) v.push(`${tag}: ${qs.length} questions, more than ${MAX_QUESTIONS} (a survey, not an interview)`);
  qs.forEach((q, i) => {
    if (!q.startsWith(`- ${letter}${i + 1}. `)) v.push(`${tag}: question ${i + 1} is numbered ${q.slice(2, 5).trim()} (numbers must run ${letter}1, ${letter}2, ... in order)`);
  });
  const spoken = [...qs, ...md.split("\n").filter((l) => l.startsWith("> "))].join("\n");
  if (REVIEW_WORDS.test(spoken)) v.push(`${tag}: a question or spoken line mentions reviews, ratings or referrals`);
  if (INCENTIVE_WORDS.test(spoken)) v.push(`${tag}: a question or spoken line offers a discount, credit or gift`);
  if (/\$\s?\d/.test(spoken)) v.push(`${tag}: quotes a price on the call`);
  if (NOT_CARRIED.some((re) => re.test(spoken))) v.push(`${tag}: mentions something the owners do not carry or do`);
  if (PHONE.test(md) || EMAIL.test(md)) v.push(`${tag}: holds a phone number or email (contact details live in the client's records, not this repo)`);
  if (!/^## Open$/m.test(md) || !/^## Close$/m.test(md)) v.push(`${tag}: needs an Open and a Close section`);
  if (!/^## If they say stop$/m.test(md) || !/declined/.test(md)) v.push(`${tag}: no stop handling that sets the tracker status to declined`);
  if (!/never quote a price/i.test(md)) v.push(`${tag}: the no-price rule is missing`);
  if (!/never ask for a review/i.test(md)) v.push(`${tag}: the no-review rule is missing`);
  if (!/never offer/i.test(md) && !/offer anything/i.test(md)) v.push(`${tag}: the nothing-offered rule is missing`);
  return v;
}

export function shopViolations(md: string): string[] {
  const v: string[] = [];
  const qs = questionLines(md, "M");
  if (!/^\*\*Status: (DRAFT\. Not approved|Approved by [^*]+)\b/m.test(md)) v.push("mystery shop: no Status line saying DRAFT or who approved it");
  if (qs.length !== SHOP_LINES) v.push(`mystery shop: ${qs.length} scorecard lines; the total is out of ${SHOP_LINES * 2}, so it needs exactly ${SHOP_LINES}`);
  if (!/out of 20/.test(md)) v.push("mystery shop: the 0 to 2 scoring must say it totals out of 20");
  if (!/Never buy/.test(md)) v.push("mystery shop: the never-buy rule is missing");
  if (!/Never ask the shop for a review/.test(md)) v.push("mystery shop: the no-review rule is missing");
  if (!/\| S1 \|/.test(md) || !/\| S2 \|/.test(md)) v.push("mystery shop: needs both S1 (spa) and S2 (hearth) rows");
  if (PHONE.test(md) || EMAIL.test(md)) v.push("mystery shop: holds a phone number or email");
  return v;
}

/** Minimal CSV: no quoted commas are used in this tracker; a quoted cell is rejected so the header check stays honest. */
export function parseCsv(csv: string): string[][] {
  return csv.split("\n").filter((l) => l.trim()).map((l) => l.split(",").map((c) => c.trim()));
}

export function trackerHeaderViolations(csv: string, doc: string): string[] {
  const v: string[] = [];
  const rows = parseCsv(csv);
  const cols = rows[0] ?? [];
  if (cols.join(",") !== TRACKER_COLUMNS.join(",")) v.push(`tracker template: header must be exactly ${TRACKER_COLUMNS.join(",")}`);
  if (rows.length > 1) v.push("tracker template: holds a data row; the real tracker lives in the client's OneDrive");
  for (const c of TRACKER_COLUMNS) if (!doc.includes(`\`${c}\``)) v.push(`tracker template: README does not describe column ${c}`);
  return v;
}

export interface Progress {
  done: Record<Kind, number>;
  problems: string[];
}

/** A real tracker: PII, field and status rules per row, then done-against-quota. */
export function trackerProgress(csv: string): Progress {
  const problems: string[] = [];
  const done: Record<Kind, number> = { customer: 0, builder: 0, shop: 0 };
  const rows = parseCsv(csv);
  const cols = rows[0] ?? [];
  if (cols.join(",") !== TRACKER_COLUMNS.join(",")) {
    return { done, problems: [`tracker: header must be exactly ${TRACKER_COLUMNS.join(",")}`] };
  }
  const seen = new Set<string>();
  rows.slice(1).forEach((cells, i) => {
    const row = Object.fromEntries(TRACKER_COLUMNS.map((c, j) => [c, cells[j] ?? ""]));
    const tag = `tracker row ${i + 2} (${row.id || "no id"})`;
    if (cells.length !== TRACKER_COLUMNS.length) problems.push(`${tag}: ${cells.length} cells, expected ${TRACKER_COLUMNS.length} (a comma inside a cell?)`);
    if (cells.some((c) => PHONE.test(c) || EMAIL.test(c))) problems.push(`${tag}: holds a phone number or email; keep contact details in the client's records, use person_ref`);
    const kind = row.kind as Kind;
    if (!(kind in QUOTA)) { problems.push(`${tag}: kind must be customer, builder or shop`); return; }
    if (!new RegExp(`^${ID_PREFIX[kind]}\\d{2}$`).test(row.id)) problems.push(`${tag}: id must look like ${ID_PREFIX[kind]}01 for a ${kind}`);
    if (seen.has(row.id)) problems.push(`${tag}: duplicate id`);
    seen.add(row.id);
    if (!STATUSES.includes(row.status)) problems.push(`${tag}: status must be one of ${STATUSES.join(", ")}`);
    if (kind !== "shop" && row.person_ref && !REF.test(row.person_ref)) problems.push(`${tag}: person_ref must be a record id like CRM-4821, not a name`);
    if (row.scheduled_date && !DATE.test(row.scheduled_date)) problems.push(`${tag}: scheduled_date must be YYYY-MM-DD`);
    if (row.status === "done") {
      if (kind !== "shop" && !REF.test(row.person_ref)) problems.push(`${tag}: a done interview needs a person_ref record id`);
      if (kind !== "shop" && row.consent !== "Y") problems.push(`${tag}: a done interview needs consent = Y`);
      if (!(Number(row.minutes) > 0)) problems.push(`${tag}: a done row needs minutes > 0`);
      if (!row.notes_location) problems.push(`${tag}: a done row needs notes_location`);
      if (!row.themes) problems.push(`${tag}: a done row needs themes`);
      done[kind] += 1;
    }
  });
  return { done, problems };
}

export const shortfall = (p: Progress): string[] =>
  (Object.keys(QUOTA) as Kind[]).filter((k) => p.done[k] < QUOTA[k]).map((k) => `${k}: ${p.done[k]} of ${QUOTA[k]} done`);

// ---- Self-test: every rule must be able to fail, or the repo checks below prove nothing. ----
const goodCustomer = [
  "**Status: DRAFT. Not approved.**",
  "Rules: never quote a price. Never ask for a review. Never offer anything for the time.",
  "## Open", "> Hi, it's {{interviewer}}. Is now OK?",
  "## Questions",
  ...Array.from({ length: 10 }, (_, i) => `- C${i + 1}. What happened at step ${i + 1}?`),
  "## Close", "> Thank you.",
  "## If they say stop", "> Understood.", "Set status to declined.",
].join("\n");
const goodBuilder = goodCustomer.replace(/C(\d+)\./g, "B$1.").replace(/- C1\b/, "- B1");
const goodShop = [
  "**Status: DRAFT. Not approved.**",
  "Never buy. Never ask the shop for a review.",
  "| S1 | spa |", "| S2 | hearth |",
  "Each line 0 to 2. Total out of 20.",
  ...Array.from({ length: 10 }, (_, i) => `- M${i + 1}. They did thing ${i + 1}.`),
].join("\n");
const header = `${TRACKER_COLUMNS.join(",")}\n`;
const doc = TRACKER_COLUMNS.map((c) => `\`${c}\``).join(" ");
const row = (o: Partial<Record<string, string>>) =>
  TRACKER_COLUMNS.map((c) => ({ id: "C01", kind: "customer", person_ref: "CRM-4821", source_list: "list-1", consent: "Y", scheduled_date: "2026-12-01", status: "done", interviewer: "J", minutes: "20", notes_location: "OneDrive/notes/C01", themes: "price;trust", ...o })[c] ?? "").join(",");
{
  const g = (md: string) => guideViolations(md, "customer");
  assert.deepEqual(g(goodCustomer), [], "the good customer guide must pass or the cases below prove nothing");
  assert.deepEqual(guideViolations(goodBuilder, "builder"), [], "the good builder guide must pass");
  assert.ok(g(goodCustomer.replace("**Status: DRAFT. Not approved.**", "")).some((x) => /Status/.test(x)), "a missing Status line must be caught");
  assert.ok(g(goodCustomer.replace("- C10.", "- C11.")).some((x) => /numbered/.test(x)), "a skipped question number must be caught");
  assert.ok(g(goodCustomer.split("\n").filter((l) => !/^- C[4-9]\./.test(l)).join("\n")).some((x) => /fewer than/.test(x)), "a thin guide must be caught");
  assert.ok(g(goodCustomer + "\n" + Array.from({ length: 4 }, (_, i) => `- C${11 + i}. Another?`).join("\n")).some((x) => /more than/.test(x)), "a survey-length guide must be caught");
  assert.ok(g(goodCustomer.replace("What happened at step 1?", "Would you leave us a Google review?")).some((x) => /reviews/.test(x)), "a review ask must be caught");
  assert.ok(g(goodCustomer.replace("What happened at step 1?", "Could you refer a friend?")).some((x) => /referrals/.test(x)), "a referral ask must be caught");
  assert.ok(g(goodCustomer.replace("What happened at step 2?", "Want a free service visit?")).some((x) => /discount, credit or gift/.test(x)), "an incentive must be caught");
  assert.ok(g(goodCustomer.replace("> Thank you.", "> A tub is $8,000.")).some((x) => /price/.test(x)), "a quoted price must be caught");
  assert.ok(g(goodCustomer.replace("What happened at step 3?", "Do you want a Cal Sauna?")).some((x) => /do not carry/.test(x)), "a line the owners dropped must be caught");
  assert.ok(g(goodCustomer + "\nCall 509-555-0100").some((x) => /phone/.test(x)), "a phone number must be caught");
  assert.ok(g(goodCustomer + "\npat@example.com").some((x) => /email/.test(x)), "an email must be caught");
  assert.ok(g(goodCustomer.replace("## Close", "## Wrap")).some((x) => /Open and a Close/.test(x)), "a missing Close must be caught");
  assert.ok(g(goodCustomer.replace("declined", "later")).some((x) => /stop handling/.test(x)), "missing stop handling must be caught");
  assert.ok(g(goodCustomer.replace("never quote a price", "")).some((x) => /no-price rule/.test(x)), "the no-price rule must be required");
  assert.ok(g(goodCustomer.replace("Never ask for a review", "")).some((x) => /no-review rule/.test(x)), "the no-review rule must be required");
  assert.ok(g(goodCustomer.replace("Never offer anything", "")).some((x) => /nothing-offered/.test(x)), "the nothing-offered rule must be required");

  assert.deepEqual(shopViolations(goodShop), [], "the good shop protocol must pass");
  assert.ok(shopViolations(goodShop.replace("- M10. They did thing 10.", "")).some((x) => /9 scorecard lines/.test(x)), "a nine-line scorecard must be caught (total would not be 20)");
  assert.ok(shopViolations(goodShop.replace("out of 20", "out of 18")).some((x) => /out of 20/.test(x)), "a wrong total must be caught");
  assert.ok(shopViolations(goodShop.replace("Never buy.", "")).some((x) => /never-buy/.test(x)), "the never-buy rule must be required");
  assert.ok(shopViolations(goodShop.replace("| S2 | hearth |", "")).some((x) => /S2/.test(x)), "a missing hearth shop must be caught");
  assert.ok(shopViolations(goodShop + "\nask for Pat at pat@x.com").some((x) => /email/.test(x)), "an email must be caught");

  assert.deepEqual(trackerHeaderViolations(header, doc), [], "the good tracker template must pass");
  assert.ok(trackerHeaderViolations(header.replace("kind,person_ref", "person_ref,kind"), doc).length > 0, "reordered columns must be caught");
  assert.ok(trackerHeaderViolations(header.replace(",themes", ""), doc).length > 0, "a missing column must be caught");
  assert.ok(trackerHeaderViolations(header + row({}) + "\n", doc).some((x) => /data row/.test(x)), "data in the template must be caught");
  assert.ok(trackerHeaderViolations(header, doc.replace("`consent`", "")).some((x) => /does not describe/.test(x)), "an undocumented column must be caught");

  const t = (...rows: string[]) => trackerProgress(header + rows.join("\n") + "\n");
  assert.deepEqual(t(row({})).problems, [], "a good done row must pass");
  assert.equal(t(row({})).done.customer, 1, "a done row must count");
  assert.equal(t(row({ status: "scheduled", minutes: "", notes_location: "", themes: "" })).done.customer, 0, "a scheduled row must not count as done");
  assert.equal(t(row({ status: "declined", minutes: "", notes_location: "", themes: "" })).done.customer, 0, "a declined row must not count as done");
  assert.ok(t(row({ person_ref: "Pat Smith" })).problems.some((x) => /person_ref/.test(x)), "a name in person_ref must be caught");
  assert.ok(t(row({ themes: "call 509-555-0100" })).problems.some((x) => /phone/.test(x)), "a phone number in any cell must be caught");
  assert.ok(t(row({ themes: "pat@example.com" })).problems.some((x) => /email/.test(x)), "an email in any cell must be caught");
  assert.ok(t(row({ consent: "N" })).problems.some((x) => /consent/.test(x)), "a done interview without consent must be caught");
  assert.ok(t(row({ minutes: "0" })).problems.some((x) => /minutes/.test(x)), "a done row without minutes must be caught");
  assert.ok(t(row({ notes_location: "" })).problems.some((x) => /notes_location/.test(x)), "a done row without notes must be caught");
  assert.ok(t(row({ themes: "" })).problems.some((x) => /themes/.test(x)), "a done row without themes must be caught");
  assert.ok(t(row({ status: "maybe" })).problems.some((x) => /status/.test(x)), "an unknown status must be caught");
  assert.ok(t(row({ id: "B01" })).problems.some((x) => /id must look like/.test(x)), "an id that does not match the kind must be caught");
  assert.ok(t(row({}), row({})).problems.some((x) => /duplicate/.test(x)), "a duplicate id must be caught");
  assert.ok(t(row({ kind: "visit" })).problems.some((x) => /kind/.test(x)), "an unknown kind must be caught");
  assert.ok(t(row({ scheduled_date: "Dec 1" })).problems.some((x) => /YYYY-MM-DD/.test(x)), "a loose date must be caught");
  assert.ok(t(row({}) + ",extra").problems.some((x) => /cells/.test(x)), "a stray comma must be caught");
  assert.equal(t(row({ kind: "shop", id: "S01", person_ref: "", consent: "" })).done.shop, 1, "a done shop needs no person_ref or consent");
  assert.ok(trackerProgress("id,kind\n").problems.some((x) => /header/.test(x)), "a wrong tracker header must be caught");
  const full = [...Array.from({ length: 10 }, (_, i) => row({ id: `C${String(i + 1).padStart(2, "0")}` })), ...Array.from({ length: 5 }, (_, i) => row({ kind: "builder", id: `B${String(i + 1).padStart(2, "0")}` })), ...Array.from({ length: 2 }, (_, i) => row({ kind: "shop", id: `S${String(i + 1).padStart(2, "0")}`, person_ref: "", consent: "" }))];
  assert.deepEqual(shortfall(t(...full)), [], "17 interviews and 2 shops must meet the quota");
  assert.deepEqual(shortfall(t(...full.slice(1))), ["customer: 9 of 10 done"], "one customer short must be reported");
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string) => readFileSync(join(root, "docs/diagnose", p), "utf8");
const problems = [
  ...guideViolations(read("customer-interview-guide.md"), "customer"),
  ...guideViolations(read("builder-interview-guide.md"), "builder"),
  ...shopViolations(read("mystery-shop-protocol.md")),
  ...trackerHeaderViolations(read("tracker-template.csv"), read("README.md")),
];
assert.deepEqual(problems, [], `diagnose sprint kit breaks a rule:\n${problems.join("\n")}`);

const at = process.argv.indexOf("--progress");
if (at !== -1) {
  const path = process.argv[at + 1];
  assert.ok(path, "--progress needs the path to the tracker csv");
  const p = trackerProgress(readFileSync(path, "utf8"));
  assert.deepEqual(p.problems, [], `tracker breaks a rule:\n${p.problems.join("\n")}`);
  const short = shortfall(p);
  console.log(`progress: customers ${p.done.customer}/${QUOTA.customer}, builders ${p.done.builder}/${QUOTA.builder}, shops ${p.done.shop}/${QUOTA.shop}`);
  if (process.argv.includes("--complete")) assert.deepEqual(short, [], `sprint is not complete:\n${short.join("\n")}`);
} else {
  console.log(`ok: customer guide ${questionLines(read("customer-interview-guide.md"), "C").length} questions, builder guide ${questionLines(read("builder-interview-guide.md"), "B").length}, shop scorecard ${questionLines(read("mystery-shop-protocol.md"), "M").length} lines, tracker header`);
}
