// Caption helpers (TOL-3371, video half). Pure functions, no I/O, no network: parse an SRT or WebVTT
// file (from Whisper, Descript, a phone, YouTube auto-captions...), clean it to platform-friendly cues,
// flag problems a person should look at, and write SRT / WebVTT / plain transcript back out.
// Nothing here uploads or posts anything.

export type Cue = { start: number; end: number; text: string }; // milliseconds, text may hold "\n"

export const LIMITS = {
  maxLineChars: 42, // Facebook/Instagram/YouTube caption guidance; short enough for a phone screen
  maxLines: 2,
  maxCueMs: 7000,
  minCueMs: 700,
} as const;

const TIME = /(?:(\d{1,2}):)?(\d{1,2}):(\d{2})[,.](\d{1,3})/;

function toMs(h: string | undefined, m: string, s: string, frac: string): number {
  return (Number(h ?? 0) * 3600 + Number(m) * 60 + Number(s)) * 1000 + Number(frac.padEnd(3, "0"));
}

/** Strip markup captioning tools leave behind (<i>, <c.color>, <00:00:01.000>, {\an8}) and tidy whitespace. */
export function cleanText(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/\{\\[^}]*\}/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .split(/\r?\n/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");
}

/** Parse SRT or WebVTT (auto-detected). Cue numbers, NOTE/STYLE/REGION blocks and cue settings are dropped. */
export function parseCaptions(input: string): Cue[] {
  const blocks = input.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").split(/\n{2,}/);
  const cues: Cue[] = [];
  for (const block of blocks) {
    const lines = block.split("\n").filter((l, i, a) => !(i === a.length - 1 && l === ""));
    const at = lines.findIndex((l) => l.includes("-->"));
    if (at < 0) continue; // header, NOTE, STYLE, or stray text
    const [a, b] = lines[at].split("-->");
    const ta = TIME.exec(a);
    const tb = TIME.exec(b);
    if (!ta || !tb) continue;
    const text = cleanText(lines.slice(at + 1).join("\n"));
    if (!text) continue;
    cues.push({ start: toMs(ta[1], ta[2], ta[3], ta[4]), end: toMs(tb[1], tb[2], tb[3], tb[4]), text });
  }
  return cues.sort((x, y) => x.start - y.start);
}

/** Greedy word wrap into lines of at most `max` characters (a single longer word keeps its own line). */
export function wrapWords(words: string[], max: number): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (cur && cur.length + 1 + w.length > max) {
      lines.push(cur);
      cur = w;
    } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) lines.push(cur);
  return lines;
}

/**
 * Re-cut cues so each fits LIMITS: at most 2 lines of 42 characters and 7 seconds. A cue that is too
 * long is split at word boundaries and its time is shared out in proportion to character count, so the
 * words stay in order and the whole span is still covered. Cues that already fit are only re-wrapped.
 */
export function reflow(cues: Cue[], limits = LIMITS): Cue[] {
  const out: Cue[] = [];
  for (const cue of cues) {
    const words = cue.text.split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    const perCue = limits.maxLineChars * limits.maxLines;
    const span = cue.end - cue.start;
    const pieces = Math.max(Math.ceil(words.join(" ").length / perCue), span > limits.maxCueMs ? Math.ceil(span / limits.maxCueMs) : 1);
    // Fill pieces by word count target, each piece also respecting the 2-line wrap.
    const groups: string[][] = [];
    let cur: string[] = [];
    const target = Math.ceil(words.length / pieces);
    for (const w of words) {
      const next = [...cur, w];
      const tooLong = wrapWords(next, limits.maxLineChars).length > limits.maxLines;
      if (cur.length && (tooLong || cur.length >= target)) {
        groups.push(cur);
        cur = [w];
      } else cur = next;
    }
    if (cur.length) groups.push(cur);
    const total = groups.reduce((n, g) => n + g.join(" ").length, 0) || 1;
    let t = cue.start;
    groups.forEach((g, i) => {
      const last = i === groups.length - 1;
      const end = last ? cue.end : t + Math.round((span * g.join(" ").length) / total);
      out.push({ start: t, end, text: wrapWords(g, limits.maxLineChars).join("\n") });
      t = end;
    });
  }
  return out;
}

/** Problems a person should look at. Empty list = nothing flagged. */
export function lintCues(cues: Cue[], limits = LIMITS): string[] {
  const notes: string[] = [];
  const at = (c: Cue) => fmt(c.start, ".").slice(0, 8);
  cues.forEach((c, i) => {
    const lines = c.text.split("\n");
    if (c.end <= c.start) notes.push(`${at(c)}: cue ends before it starts`);
    if (lines.length > limits.maxLines || lines.some((l) => l.length > limits.maxLineChars)) notes.push(`${at(c)}: cue is longer than ${limits.maxLines} lines of ${limits.maxLineChars} characters`);
    if (c.end - c.start > limits.maxCueMs) notes.push(`${at(c)}: cue stays on screen over ${limits.maxCueMs / 1000} seconds`);
    if (c.end > c.start && c.end - c.start < limits.minCueMs) notes.push(`${at(c)}: cue is on screen under ${limits.minCueMs} ms (hard to read)`);
    const prev = cues[i - 1];
    if (prev && c.start < prev.end) notes.push(`${at(c)}: overlaps the cue before it`);
  });
  return notes;
}

function fmt(ms: number, sep: "," | "."): string {
  const n = Math.max(0, Math.round(ms));
  const p = (v: number, w = 2) => String(v).padStart(w, "0");
  return `${p(Math.floor(n / 3600000))}:${p(Math.floor(n / 60000) % 60)}:${p(Math.floor(n / 1000) % 60)}${sep}${p(n % 1000, 3)}`;
}

export function toSrt(cues: Cue[]): string {
  return cues.map((c, i) => `${i + 1}\n${fmt(c.start, ",")} --> ${fmt(c.end, ",")}\n${c.text}\n`).join("\n");
}

export function toVtt(cues: Cue[]): string {
  return `WEBVTT\n\n${cues.map((c) => `${fmt(c.start, ".")} --> ${fmt(c.end, ".")}\n${c.text}\n`).join("\n")}`;
}

/** Plain speech text for draft-from-transcript.ts: no timing, one paragraph per ~8 cues. */
export function toTranscript(cues: Cue[]): string {
  const lines = cues.map((c) => c.text.replace(/\n/g, " "));
  const paras: string[] = [];
  for (let i = 0; i < lines.length; i += 8) paras.push(lines.slice(i, i + 8).join(" "));
  return `${paras.join("\n\n")}\n`;
}

/** True when a file name or its content says it is a timed caption file rather than plain text. */
export function looksLikeCaptions(file: string, content: string): boolean {
  return /\.(srt|vtt)$/i.test(file) || /^\uFEFF?WEBVTT/.test(content) || /\d:\d{2}[,.]\d{1,3}\s*-->\s*\d/.test(content.slice(0, 2000));
}
