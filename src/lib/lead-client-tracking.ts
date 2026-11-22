"use client";

import { getStoredConsent, isGranted, type Consent } from "./consent";
import { getMetaBrowserIds, trackConversion, type TrackProps } from "./track";
import type { ConversionName } from "./tracking-config";

/** Shared event id for the browser pixel and /api/lead Meta CAPI de-dupe. */
export function newLeadConversionEventId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export type LeadConversionFields = {
  adsConsent: Consent;
  eventId?: string;
  fbp?: string;
  fbc?: string;
};

/** Meta ids and conversion event id are only sent after the visitor accepts cookies (pixel loads). */
export function leadConversionFields(): LeadConversionFields {
  const adsConsent = getStoredConsent();
  if (!isGranted(adsConsent)) return { adsConsent };
  const eventId = newLeadConversionEventId();
  const { fbp, fbc } = getMetaBrowserIds();
  return { adsConsent, eventId, fbp, fbc };
}

/** Fire ad tags once after /api/lead accepts the submission (skips Meta when consent not granted). */
export function trackLeadConversion(name: ConversionName, props: TrackProps, eventId?: string): string | undefined {
  if (!eventId) return trackConversion(name, props);
  return trackConversion(name, { ...props, event_id: eventId });
}