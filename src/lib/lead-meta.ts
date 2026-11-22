// Maps a accepted /api/lead submission to Meta Conversions API input (TOL-3358 / TS-3282).

import type { MetaLeadInput } from "./meta-capi";

export type AdsConsent = "granted" | "denied" | "unset";

const EVENT_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseAdsConsent(raw: unknown): AdsConsent {
  return raw === "granted" || raw === "denied" ? raw : "unset";
}

/** Reject forged or malformed ids; only RFC-4122 UUIDs (from crypto.randomUUID) are accepted. */
export function validateConversionEventId(raw?: string): string | undefined {
  const id = raw?.trim();
  if (!id || id.length > 64 || !EVENT_ID.test(id)) return undefined;
  return id;
}

export type LeadMetaContext = {
  kind: "visit" | "note";
  adsConsent: AdsConsent;
  eventId?: string;
  email?: string;
  phone?: string;
  interests: string[];
  source?: string;
  origin: string;
  fbp?: string;
  fbc?: string;
  userAgent?: string;
  clientIp?: string;
};

/** Build CAPI payload when the visitor granted ads cookies and sent a valid event id (pixel de-dupe). */
export function buildMetaLeadInput(ctx: LeadMetaContext): MetaLeadInput | undefined {
  if (ctx.adsConsent !== "granted") return undefined;
  const eventId = validateConversionEventId(ctx.eventId);
  if (!eventId) return undefined;
  const email = ctx.email?.trim();
  const phone = ctx.phone?.trim();
  if (!email && !phone) return undefined;
  const source = ctx.source?.trim();
  return {
    eventId,
    email: email || undefined,
    phone: phone || undefined,
    sourceUrl: source ? `${ctx.origin.replace(/\/$/, "")}${source.startsWith("/") ? source : `/${source}`}` : undefined,
    userAgent: ctx.userAgent,
    clientIp: ctx.clientIp,
    fbp: ctx.fbp?.trim() || undefined,
    fbc: ctx.fbc?.trim() || undefined,
    interest: ctx.interests[0],
    eventName: ctx.kind === "note" ? "Subscribe" : "Lead",
  };
}