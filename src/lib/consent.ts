"use client";

import { useSyncExternalStore } from "react";

export type Consent = "granted" | "denied" | "unset";

export const CONSENT_KEY = "sl-consent";
const EVENT = "sl-consent-change";

function read(): Consent {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : "unset";
  } catch {
    return "unset";
  }
}

export function setConsent(value: "granted" | "denied") {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* private mode: the choice lasts until reload */
  }
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      analytics_storage: value,
    });
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** The visitor's stored choice. "unset" on the server and until they choose. */
export function useConsent(): Consent {
  return useSyncExternalStore(subscribe, read, () => "unset" as Consent);
}

/** Meta Pixel and PostHog only load after an explicit Accept, whatever the Google default. Google tags load earlier, in Consent Mode. */
export function isGranted(c: Consent): boolean {
  return c === "granted";
}
