"use client";

import { clearConsent } from "@/lib/consent";
import { anyTagEnabled } from "@/lib/tracking-config";

/**
 * Forgets the visitor's stored cookie choice and shows the banner again.
 * Renders nothing when no analytics or ad tag is switched on, because then there is no choice to change.
 */
export default function CookieSettingsLink({ className }: { className?: string }) {
  if (!anyTagEnabled) return null;
  return (
    <button
      type="button"
      className={className}
      onClick={clearConsent}
      style={{ background: "none", border: 0, padding: 0, font: "inherit", cursor: "pointer", textAlign: "left", color: "inherit" }}
    >
      Cookie settings
    </button>
  );
}
