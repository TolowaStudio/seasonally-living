// Ad and analytics tags are OFF unless their env var is set. Every NEXT_PUBLIC_* below is read with a
// literal `process.env.NAME` so Next inlines it at build time. On Cloud Run that means: pass the value as a
// Docker build arg (see Dockerfile), then redeploy. With none set, no tag script loads and no request is made.
//
// Safe to import from server and client code. No secrets here (META_CAPI_TOKEN lives in meta-capi.ts only).

const clean = (v: string | undefined) => {
  const t = (v ?? "").trim();
  return t || undefined;
};

/** Events that can map to a Google Ads conversion action (label from Ads: Goals > Conversions > tag setup). */
export const CONVERSION_NAMES = [
  "lead_submitted",
  "newsletter_signup",
  "preowned_inquiry",
  "call_click",
  "directions_click",
  "booking_started",
] as const;
export type ConversionName = (typeof CONVERSION_NAMES)[number];

export const tracking = {
  ga4Id: clean(process.env.NEXT_PUBLIC_GA4_ID), // G-XXXXXXXXXX
  adsId: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID), // AW-XXXXXXXXX
  adsLabels: {
    lead_submitted: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_LEAD),
    newsletter_signup: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_NEWSLETTER),
    preowned_inquiry: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_PREOWNED),
    call_click: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_CALL),
    directions_click: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_DIRECTIONS),
    booking_started: clean(process.env.NEXT_PUBLIC_GOOGLE_ADS_LABEL_BOOKING),
  } as Record<ConversionName, string | undefined>,
  metaPixelId: clean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  posthogKey: clean(process.env.NEXT_PUBLIC_POSTHOG_KEY),
  posthogHost: clean(process.env.NEXT_PUBLIC_POSTHOG_HOST) ?? "https://us.i.posthog.com",
  /** What Google tags assume before the visitor chooses. "denied" unless explicitly "granted". */
  consentDefault: process.env.NEXT_PUBLIC_CONSENT_DEFAULT === "granted" ? ("granted" as const) : ("denied" as const),
};

export const googleEnabled = !!(tracking.ga4Id || tracking.adsId);
export const metaEnabled = !!tracking.metaPixelId;
export const posthogEnabled = !!tracking.posthogKey;
/** True when at least one tag is configured. Gates scripts, listeners and the consent banner. */
export const anyTagEnabled = googleEnabled || metaEnabled || posthogEnabled;
