import { getSiteUrl } from "./site";
import { signToken, TTL, type ConfirmToken } from "./tokens";

/**
 * Base URL for links we put in emails. Production always uses the configured site URL (never the
 * request Host header, which a caller controls). Outside production the request origin is fine.
 */
export function linkBase(requestOrigin?: string): string {
  return process.env.NODE_ENV !== "production" && requestOrigin ? requestOrigin : getSiteUrl();
}

export function confirmLink(base: string, payload: Omit<ConfirmToken, "t" | "exp">): string | null {
  const token = signToken({ ...payload, t: "confirm", exp: Date.now() + TTL.confirm });
  return token ? `${base}/note/confirm?t=${token}` : null;
}

export function unsubscribeLink(base: string, email: string): string | null {
  const token = signToken({ t: "unsub", e: email, exp: Date.now() + TTL.unsub });
  return token ? `${base}/note/unsubscribe?t=${token}` : null;
}

export function guideReadLink(base: string, slug: string, email: string): string | null {
  const token = signToken({ t: "guide", e: email, g: slug, exp: Date.now() + TTL.guide });
  return token ? `${base}/guides/${slug}/read?t=${token}` : null;
}

/** RFC 8058 one-click unsubscribe: mail clients POST to the URL in the List-Unsubscribe header, so it must be the API route, not the page. */
export const oneClickUnsubscribeUrl = (pageUrl: string) => pageUrl.replace("/note/unsubscribe?", "/api/note/unsubscribe?");
