"use client";

import { getStoredConsent, isGranted, type Consent } from "./consent";
import { getMetaBrowserIds, trackConversion, type TrackProps } from "./track";
import type { ConversionName } from "./tracking-config";

const nibble = () => Math.floor(Math.random() * 16).toString(16);
const hexRun = (n: number) => Array.from({ length: n }, nibble).join("");

/** Shared event id for the browser pixel and /api/lead Meta CAPI de-dupe (always RFC-4122-shaped). */
export function newLeadConversionEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${hexRun(8)}-${hexRun(4)}-4${hexRun(3)}-${"89ab"[Math.floor(Math.random() * 4)]}${hexRun(3)}-${hexRun(12)}`;
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