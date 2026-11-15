import { createHmac, timingSafeEqual } from "node:crypto";

// Signed, stateless tokens for the double opt-in link, the unsubscribe link and guide access.
// Format: base64url(JSON payload) + "." + base64url(HMAC-SHA256). The secret is NOTE_SIGNING_SECRET.
// There is no database: the payload itself carries what the confirm step needs.

export type ConfirmToken = {
  t: "confirm";
  e: string; // email
  n?: string; // first name
  i: string[]; // interest ids
  s: string; // source page
  g?: string; // guide slug, when the signup came from a guide
  ct: string; // consent text shown at signup
  cv: string; // consent text version
  ts: number; // consent time (ms)
  rid: string; // request id, ties this to the signup log line
  exp: number;
};
export type UnsubToken = { t: "unsub"; e: string; exp: number };
export type GuideToken = { t: "guide"; e: string; g: string; exp: number };
export type AnyToken = ConfirmToken | UnsubToken | GuideToken;

const DAY = 86400_000;
export const TTL = { confirm: 7 * DAY, unsub: 3650 * DAY, guide: 365 * DAY };

/** Null means signing is unavailable (production without NOTE_SIGNING_SECRET): callers must not send links. */
function secret(): string | null {
  const s = process.env.NOTE_SIGNING_SECRET;
  if (s && s.length >= 16) return s;
  return process.env.NODE_ENV === "production" ? null : "dev-only-signing-secret-not-for-production";
}

export const signingAvailable = () => secret() !== null;

const b64 = (b: Buffer) => b.toString("base64url");

export function signToken(payload: AnyToken): string | null {
  const key = secret();
  if (!key) return null;
  const body = b64(Buffer.from(JSON.stringify(payload)));
  return `${body}.${b64(createHmac("sha256", key).update(body).digest())}`;
}

export function verifyToken<T extends AnyToken["t"]>(token: unknown, type: T): Extract<AnyToken, { t: T }> | null {
  const key = secret();
  if (!key || typeof token !== "string" || token.length > 4000) return null;
  const [body, sig, extra] = token.split(".");
  if (!body || !sig || extra !== undefined) return null;
  const want = createHmac("sha256", key).update(body).digest();
  let got: Buffer;
  try {
    got = Buffer.from(sig, "base64url");
  } catch {
    return null;
  }
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as AnyToken;
    if (p.t !== type || typeof p.e !== "string" || typeof p.exp !== "number" || p.exp < Date.now()) return null;
    return p as Extract<AnyToken, { t: T }>;
  } catch {
    return null;
  }
}
