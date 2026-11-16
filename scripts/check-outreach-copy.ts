// Run: node --experimental-strip-types scripts/check-outreach-copy.ts [--ready]   (TOL-2898)
// Guards the draft outreach copy in docs/outreach/ against the rules on the ticket:
//   emails are plain text, personal and signed by Cam; no review incentive (or review ask) anywhere;
//   no chemical or percent-off lead; nothing the owners no longer carry (Cal Saunas, outdoor kitchens...),
//   no chimney sweeps or liners (out of scope, TOL-3325); every email has the street address and an unsubscribe;
//   every site link is tagged utm_campaign=wave-... so the site records it as LIST_WAVE (docs/crm/source-standard.md);
//   Kimberly's call fits two minutes; the hot-list header has the ticket's five columns first and no data rows.
// With --ready it also fails while any [[placeholder]] is left, so the send step (TOL-2899) cannot go out half-filled.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface Email {
  id: string;
  subject: string;
  body: string;
}

const REVIEW_WORDS = /\b(reviews?|ratings?|stars?|testimonials?|google|yelp|birdeye|bbb|feedback)\b/i;
const DISCOUNT_WORDS = /(\d+\s?%|percent off|discounts?|coupons?|promo(?:tion)?(?: code)?s?|\bsale\b|chemicals?)/i;
const NOT_CARRIED = [/cal\s?saunas?/i, /cal\s?flame/i, /outdoor kitchens?/i, /marquis/i, /river\s?pools/i, /\bATV\b/];
const OUT_OF_SCOPE = /chimney sweep|sweeping|\bliners?\b|\bsweeps?\b/i;
const HOURS = /\b\d{1,2}(?::\d{2})?\s?(?:am|a\.m\.|a)?\s?[–—-]\s?\d{1,2}(?::\d{2})?\s?(?:pm|p\.m\.|p)\b/i;
const PLACEHOLDER = /\[\[[^\]]+\]\]/g;
export const MAX_EMAIL_WORDS = 220;
export const MAX_CALL_WORDS = 260; // two minutes at about 130 spoken words a minute
export const REQUIRED_HOT_LIST_COLUMNS = ["name", "owns", "tub_age_years", "phone", "replied"];
export const OTHER_HOT_LIST_COLUMNS = ["reply_code", "dnc", "minutes", "outcome", "email"];

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

/** `## Email X ...` sections: a `Subject:` line, then the first ```text fence is the body. */
export function parseEmails(md: string): Email[] {
  const out: Email[] = [];
  for (const sec of md.split(/^## /m).slice(1)) {
    const head = sec.match(/^Email ([A-Z])\b/);
    if (!head) continue;
    const subject = sec.match(/^Subject:\s*(.+)$/m)?.[1].trim() ?? "";
    const body = sec.match(/```text\n([\s\S]*?)\n```/)?.[1] ?? "";
    out.push({ id: head[1], subject, body });
  }
  return out;
}

/** The message proper: everything above the `--` footer separator. */
const messageOf = (body: string) => body.split(/^--$/m)[0];

/** Every seasonallyliving.com link must be recorded as LIST_WAVE by docs/crm/source-standard.md. */
export function linkViolations(text: string, tag: string): string[] {
  const v: string[] = [];
  for (const url of text.match(/https?:\/\/[^\s)`]+/g) ?? []) {
    if (!/seasonallyliving\.com/.test(url)) continue;
    if (!/utm_campaign=wave-/.test(url)) v.push(`${tag}: ${url} has no utm_campaign=wave-... (would not be recorded as LIST_WAVE)`);
    if (/utm_source=(ghost|note)\b/.test(url)) v.push(`${tag}: ${url} uses utm_source ghost/note, which tags GHOST_SEGMENT not LIST_WAVE`);
  }
  return v;
}

export function emailViolations(e: Email): string[] {
  const v: string[] = [];
  const msg = messageOf(e.body);
  const all = `${e.subject}\n${e.body}`;
  const tag = `Email ${e.id}`;
  if (!e.subject) v.push(`${tag}: no Subject line`);
  if (!e.body) v.push(`${tag}: no \`\`\`text body`);
  if (/<\/?[a-z][^>]*>|!\[|\*\*|^#{1,6}\s/m.test(e.body)) v.push(`${tag}: not plain text (HTML or markdown found)`);
  if (e.subject.length > 60 || /!/.test(e.subject) || /\b[A-Z]{4,}\b/.test(e.subject.replace(/\{\{[^}]*\}\}/g, ""))) v.push(`${tag}: subject is too long or shouts`);
  if (!/^Cam( McNeill)?\s*$/m.test(msg)) v.push(`${tag}: not signed by Cam`);
  if (words(msg.replace(PLACEHOLDER, "")) > MAX_EMAIL_WORDS) v.push(`${tag}: over ${MAX_EMAIL_WORDS} words (a personal email, not a newsletter)`);
  if (!/1407 Maiden Ln/.test(e.body)) v.push(`${tag}: no street address in the footer`);
  if (!/\{\{unsubscribe_url\}\}/.test(e.body)) v.push(`${tag}: no {{unsubscribe_url}} in the footer`);
  if (REVIEW_WORDS.test(all)) v.push(`${tag}: mentions reviews or ratings (no review incentive or ask in this set)`);
  if (DISCOUNT_WORDS.test(all)) v.push(`${tag}: leads with a discount or chemicals`);
  if (NOT_CARRIED.some((re) => re.test(all))) v.push(`${tag}: offers a line the owners no longer carry`);
  if (OUT_OF_SCOPE.test(all)) v.push(`${tag}: offers chimney sweeping or liners (out of scope)`);
  if (HOURS.test(all)) v.push(`${tag}: states showroom hours (they live in siteSettings only)`);
  v.push(...linkViolations(all, tag));
  return v;
}

/** Spoken lines are the `> ` blockquotes. Words on one call = Open + the longest Branch + Close. */
export function callWords(md: string): { open: number; branch: number; close: number; total: number } {
  const spoken = (title: RegExp) =>
    md
      .split(/^## /m)
      .slice(1)
      .filter((s) => title.test(s.split("\n")[0]))
      .map((s) => words(s.split("\n").filter((l) => l.startsWith("> ")).map((l) => l.slice(2)).join(" ").replace(/\{\{[^}]*\}\}/g, "x")));
  const open = spoken(/^Open\b/)[0] ?? 0;
  const close = spoken(/^Close\b/)[0] ?? 0;
  const branch = Math.max(0, ...spoken(/^Branch:/));
  return { open, branch, close, total: open + branch + close };
}

export function callViolations(md: string): string[] {
  const v: string[] = [];
  const c = callWords(md);
  if (c.total === 0) v.push("call script: no spoken lines found (Open, Branch and Close need `> ` lines)");
  if (c.total > MAX_CALL_WORDS) v.push(`call script: ${c.total} spoken words on the longest path, over ${MAX_CALL_WORDS} (two minutes)`);
  const spokenText = md.split("\n").filter((l) => l.startsWith("> ")).join(" ");
  if (REVIEW_WORDS.test(spokenText)) v.push("call script: spoken lines mention reviews or ratings");
  if (/\$\s?\d/.test(spokenText) || DISCOUNT_WORDS.test(spokenText)) v.push("call script: quotes a price, discount or chemicals on the phone");
  if (NOT_CARRIED.some((re) => re.test(spokenText)) || OUT_OF_SCOPE.test(spokenText)) v.push("call script: offers something the owners do not carry or do");
  if (!/^## If they say stop/m.test(md) || !/dnc = Y/.test(md)) v.push("call script: no stop handling that sets dnc = Y");
  if (!/^## Voicemail/m.test(md)) v.push("call script: no voicemail line");
  return v;
}

export function hotListViolations(csv: string, doc: string): string[] {
  const v: string[] = [];
  const lines = csv.split("\n").filter((l) => l.trim());
  const cols = (lines[0] ?? "").split(",").map((c) => c.trim());
  REQUIRED_HOT_LIST_COLUMNS.forEach((c, i) => {
    if (cols[i] !== c) v.push(`hot list: column ${i + 1} must be ${c} (the ticket's five come first, in order), found ${cols[i] ?? "nothing"}`);
  });
  for (const c of OTHER_HOT_LIST_COLUMNS) if (!cols.includes(c)) v.push(`hot list: header is missing ${c}`);
  if (lines.length > 1) v.push("hot list: the template holds a data row; customer data never goes in this repo");
  for (const c of cols) if (!doc.includes(`\`${c}\``)) v.push(`hot list: format doc does not describe column ${c}`);
  return v;
}

export const placeholders = (md: string) => md.match(PLACEHOLDER) ?? [];

// ---- Self-test: every rule must be able to fail, or the repo checks below prove nothing. ----
const good: Email = {
  id: "A",
  subject: "Your 2017 hot tub",
  body: "Pat,\n\nIt's Cam at Seasonally Living. Reply with \"tub\" and a number and Kimberly will call.\n\nCam McNeill\n\n--\nSeasonally Living by Chim Chimney\n1407 Maiden Ln, Wenatchee, WA 98801\nStop these emails: {{unsubscribe_url}}",
};
const bad = (body: string, subject = good.subject): string[] => emailViolations({ ...good, body, subject });
const withLine = (line: string) => good.body.replace("Kimberly will call.", `Kimberly will call. ${line}`);
{
  assert.deepEqual(emailViolations(good), [], "the good fixture must pass or the cases below prove nothing");
  assert.ok(bad(withLine("Leave us a Google review for a free orientation.")).some((x) => /review/.test(x)), "review incentive must be caught");
  assert.ok(bad(withLine("Tell us your rating.")).some((x) => /review|rating/.test(x)), "rating ask must be caught");
  assert.ok(bad(withLine("Stock up on spa chemicals.")).some((x) => /discount|chemical/.test(x)), "chemical lead must be caught");
  assert.ok(bad(withLine("Take 15% off this week.")).some((x) => /discount/.test(x)), "percent-off must be caught");
  assert.ok(bad(good.body, "Spa chemicals, 20% off").length > 0, "a chemical-discount subject must be caught");
  assert.ok(bad(good.body.replace("Cam McNeill", "The Seasonally Living team")).some((x) => /signed by Cam/.test(x)), "must be signed by Cam");
  assert.ok(bad(good.body.replace("1407 Maiden Ln, Wenatchee, WA 98801\n", "")).some((x) => /address/.test(x)), "street address must be required");
  assert.ok(bad(good.body.replace("{{unsubscribe_url}}", "later")).some((x) => /unsubscribe/.test(x)), "unsubscribe must be required");
  assert.ok(bad(`<p>${good.body}</p>`).some((x) => /plain text/.test(x)), "HTML must be caught");
  assert.ok(bad(withLine("**Book now**")).some((x) => /plain text/.test(x)), "markdown bold must be caught");
  assert.ok(bad(withLine("Ask about a Cal Sauna.")).some((x) => /no longer carry/.test(x)), "Cal Saunas must be caught");
  assert.ok(bad(withLine("We also do chimney sweeps.")).some((x) => /sweep/.test(x)), "chimney sweeps must be caught");
  assert.ok(bad(withLine("We reline with new liners.")).some((x) => /liners/.test(x)), "liners must be caught");
  assert.ok(bad(withLine("Open Tuesday - Saturday 10am - 4pm.")).some((x) => /hours/.test(x)), "showroom hours must be caught");
  assert.ok(bad(withLine("See https://seasonallyliving.com/pre-owned")).some((x) => /utm_campaign/.test(x)), "an untagged site link must be caught");
  assert.ok(bad(withLine("See https://seasonallyliving.com/note?utm_source=note&utm_campaign=wave-1-x")).some((x) => /GHOST_SEGMENT/.test(x)), "a ghost/note utm_source must be caught");
  assert.deepEqual(bad(withLine("See https://seasonallyliving.com/note?utm_source=cam-email&utm_medium=email&utm_campaign=wave-1-x")), [], "a tagged link must pass");
  assert.ok(bad(withLine("word ".repeat(MAX_EMAIL_WORDS))).some((x) => /words/.test(x)), "a long email must be caught");
  assert.ok(bad(good.body, "BIG SALE NOW!").some((x) => /subject/.test(x)), "a shouting subject must be caught");
  assert.ok(bad("", "").length >= 2, "an empty email must be caught");

  const call = "## Open\n> Hi, it's Kimberly.\n## Branch: a\n> Which tub do you have?\n## Close\n> Thanks.\n## If they say stop\n> Understood.\nSet dnc = Y.\n## Voicemail\n> Hi.\n";
  assert.deepEqual(callViolations(call), [], "the good call fixture must pass");
  assert.ok(callViolations(call.replace("Which tub do you have?", "word ".repeat(MAX_CALL_WORDS))).some((x) => /two minutes/.test(x)), "a call over two minutes must be caught");
  assert.ok(callViolations(call.replace("Which tub do you have?", "A review would help.")).some((x) => /review/.test(x)), "a review ask on the phone must be caught");
  assert.ok(callViolations(call.replace("Which tub do you have?", "Credit is $2,000.")).some((x) => /price/.test(x)), "a price on the phone must be caught");
  assert.ok(callViolations(call.replace("dnc = Y", "later")).some((x) => /stop handling/.test(x)), "missing stop handling must be caught");
  const twoBranches = call.replace("## Close", "## Branch: b\n> " + "word ".repeat(40) + "\n## Close");
  assert.equal(callWords(twoBranches).branch, 40, "the longest branch counts, not the sum");

  const header = "name,owns,tub_age_years,phone,replied,reply_code,dnc,minutes,outcome,email\n";
  const doc = "`name` `owns` `tub_age_years` `phone` `replied` `reply_code` `dnc` `minutes` `outcome` `email`";
  assert.deepEqual(hotListViolations(header, doc), [], "the good hot list must pass");
  assert.ok(hotListViolations("owns,name,tub_age_years,phone,replied,reply_code,dnc,minutes,outcome,email\n", doc).length > 0, "the ticket's columns must come first, in order");
  assert.ok(hotListViolations(header.replace(",dnc", ""), doc).some((x) => /dnc/.test(x)), "dnc column must be required");
  assert.ok(hotListViolations(header + "Pat,Cal Spa,6,5095550100,tub,want-call,N,2,,p@x.com\n", doc).some((x) => /data row/.test(x)), "customer data in the template must be caught");
  assert.ok(hotListViolations(header, doc.replace("`dnc`", "")).some((x) => /does not describe/.test(x)), "an undocumented column must be caught");
  assert.deepEqual(placeholders("a [[TRADE-IN]] b [[X: y]]"), ["[[TRADE-IN]]", "[[X: y]]"], "placeholders must be found");
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string) => readFileSync(join(root, "docs/outreach", p), "utf8");
const emailsMd = read("segment-emails.md");
const callMd = read("kimberly-callback-script.md");
const emails = parseEmails(emailsMd);

assert.deepEqual(emails.map((e) => e.id), ["A", "B", "C", "D"], "one email per segment: A older tubs, B hearth, C recent spa owners, D everyone");
const problems = [
  ...emails.flatMap(emailViolations),
  ...linkViolations(emailsMd, "segment-emails.md"), // includes the {{note_signup_url}} definition, which sits outside the email bodies
  ...callViolations(callMd),
  ...hotListViolations(read("hot-list-template.csv"), read("hot-list-format.md")),
];
if (process.argv.includes("--ready")) {
  for (const f of ["segment-emails.md", "kimberly-callback-script.md"]) for (const p of placeholders(read(f))) problems.push(`${f}: placeholder still open: ${p}`);
}
assert.deepEqual(problems, [], `outreach copy breaks a rule:\n${problems.join("\n")}`);

const open = placeholders(emailsMd).length + placeholders(callMd).length;
console.log(`ok: ${emails.length} emails, call script ${callWords(callMd).total}/${MAX_CALL_WORDS} spoken words, hot-list header; ${open} placeholders still open (--ready fails on them)`);
