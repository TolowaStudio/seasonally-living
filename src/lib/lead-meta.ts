// Maps a accepted /api/lead submission to Meta Conversions API input (TOL-3358 / TS-3282).

import type { MetaLeadInput } from "./meta-capi";

export type LeadMetaContext = {
  kind: "visit" | "note";
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

/** Build CAPI payload when the client sent a conversion event id (pixel de-dupe). */
export function buildMetaLeadInput(ctx: LeadMetaContext): MetaLeadInput | undefined {
  const eventId = ctx.eventId?.trim();
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