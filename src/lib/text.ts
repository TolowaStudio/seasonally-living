// Input hygiene for anything a visitor types. Every reflected field (email subject, headers, logs)
// goes through oneLine(); free-text bodies go through multiLine().

// C0/C1 controls (CR, LF, NUL, ...), Unicode line/paragraph separators, zero-width and bidi override characters.
const UNSAFE = /[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028\u2029\u202a-\u202e\u2066-\u2069\ufeff]+/g;

/** Single-line, trimmed, length-capped. Safe for subjects, headers and log lines. */
export function oneLine(v: unknown, max = 200): string {
  if (typeof v !== "string") return "";
  return v.replace(UNSAFE, " ").replace(/ {2,}/g, " ").trim().slice(0, max);
}

/** Multi-line text for an email body: keeps line breaks, drops every other control character. */
export function multiLine(v: unknown, max = 2000): string {
  if (typeof v !== "string") return "";
  return v
    .replace(/\r\n?|\u2028|\u2029/g, "\n")
    .replace(/[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

// Conservative address check: no whitespace, quotes, angle brackets, commas or semicolons, so a
// value can never smuggle a second recipient or header into reply_to.
const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
export function cleanEmail(v: unknown): string | null {
  const e = oneLine(v, 254).toLowerCase();
  return e.length <= 254 && EMAIL_RE.test(e) ? e : null;
}

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Short non-reversible tag for log lines (so logs can be correlated without storing addresses). */
export async function tagOf(email: string): Promise<string> {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 12);
}
