"use client";

// One entry point for conversions. Fans an event out to whichever tags are enabled (GA4, Google Ads,
// Meta Pixel, PostHog). With no tag enabled, or before a tag has loaded/consent is given, it does nothing.
//
// TOL-2922 (attribution.ts) exposes the same `trackConversion(name, props)` signature. When that merges,
// re-export from there (or call this from it) so there is a single fan-out. TODO(TOL-3346): after
// rebasing on origin/main, replace the DOM success observer in components/Tracking.tsx with a direct
// trackConversion() call in LeadForm / NoteForm, and pass the returned event id to /api/lead so the
// server can send the matching Meta Conversions API event (see lib/meta-capi.ts).

import { CONVERSION_NAMES, anyTagEnabled, tracking, type ConversionName } from "./tracking-config";

export type { ConversionName };
export { CONVERSION_NAMES };
export type TrackProps = Record<string, string | number | boolean | undefined>;

type Win = Window & {
  gtag?: (...a: unknown[]) => void;
  fbq?: (...a: unknown[]) => void;
  posthog?: { capture: (name: string, props?: Record<string, unknown>) => void };
};

/** Meta standard event for each conversion (custom event where none fits). */
const META_EVENT: Record<ConversionName, { name: string; custom?: boolean }> = {
  lead_submitted: { name: "Lead" },
  preowned_inquiry: { name: "Lead" },
  newsletter_signup: { name: "Subscribe" },
  call_click: { name: "Contact" },
  directions_click: { name: "FindLocation" },
  booking_started: { name: "BookingStarted", custom: true },
};

const uuid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

const clean = (props: TrackProps) =>
  Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined)) as Record<string, string | number | boolean>;

/**
 * Record a conversion on every enabled tag. Returns the event id shared by the pixel and (for lead events)
 * the server-side Conversions API call, so Meta can de-duplicate. Never throws.
 */
export function trackConversion(name: ConversionName, props: TrackProps = {}): string {
  const eventId = typeof props.event_id === "string" && props.event_id ? props.event_id : uuid();
  if (typeof window === "undefined" || !anyTagEnabled) return eventId;
  const w = window as Win;
  const p = clean({ ...props, event_id: eventId, page_path: window.location.pathname });
  try {
    if (typeof w.gtag === "function") {
      // GA4: one custom event per conversion (mark them as key events in GA4).
      if (tracking.ga4Id) w.gtag("event", name, { ...p, send_to: tracking.ga4Id });
      // Google Ads: a conversion event only when a label is set for this action.
      const label = tracking.adsLabels[name];
      if (tracking.adsId && label) {
        w.gtag("event", "conversion", { send_to: `${tracking.adsId}/${label}`, transaction_id: eventId });
      }
    }
    if (tracking.metaPixelId && typeof w.fbq === "function") {
      const m = META_EVENT[name];
      const params = { ...p };
      delete params.event_id;
      delete params.page_path;
      w.fbq(m.custom ? "trackCustom" : "track", m.name, params, { eventID: eventId });
    }
    if (tracking.posthogKey && w.posthog && typeof w.posthog.capture === "function") {
      w.posthog.capture(name, p);
    }
  } catch (err) {
    // Tracking must never break the page.
    if (process.env.NODE_ENV !== "production") console.warn("track: failed", name, err);
  }
  return eventId;
}

const readCookie = (n: string) => {
  try {
    return document.cookie.split("; ").find((c) => c.startsWith(n + "="))?.slice(n.length + 1);
  } catch {
    return undefined;
  }
};

/**
 * Browser identifiers Meta uses to match a server-side event to the click (`_fbp`, `_fbc`, or a `fbclid`
 * in the URL). Include them, with the event id, in the /api/lead payload for meta-capi.ts. Only set once
 * the Meta Pixel has loaded (i.e. after consent), so it is {} otherwise.
 */
export function getMetaBrowserIds(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined" || !tracking.metaPixelId) return {};
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");
  if (!fbc) {
    const id = new URLSearchParams(window.location.search).get("fbclid");
    if (id && fbp) fbc = `fb.1.${Date.now()}.${id}`;
  }
  return { fbp, fbc };
}
