"use client";

import { getMetaBrowserIds, trackConversion, type TrackProps } from "./track";
import type { ConversionName } from "./tracking-config";

/** Shared event id for the browser pixel and /api/lead Meta CAPI de-dupe. */
export function newLeadConversionEventId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function leadMetaPayload() {
  const { fbp, fbc } = getMetaBrowserIds();
  return { fbp, fbc };
}

/** Fire ad tags once after /api/lead accepts the submission. */
export function trackLeadConversion(name: ConversionName, props: TrackProps, eventId: string): string {
  return trackConversion(name, { ...props, event_id: eventId });
}