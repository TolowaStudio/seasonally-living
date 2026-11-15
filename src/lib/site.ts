import { SETTINGS } from "@/content/settings";
import type { NavGroup, NavLink, SiteSettings } from "@/content/types";

export type { NavGroup, NavLink };

/** Static defaults (used by client components and as the Sanity fallback). Live values come from getSettings(). */
export const site = SETTINGS;

export const addressOf = (s: Pick<SiteSettings, "address">) =>
  `${s.address.line1}, ${s.address.city}, ${s.address.state} ${s.address.zip}`;
export const mapsUrlOf = (s: Pick<SiteSettings, "address" | "legalName">) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.legalName} ${addressOf(s)}`)}`;

export const addressBlock = addressOf(SETTINGS);
export const mapsUrl = mapsUrlOf(SETTINGS);

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return explicit ? explicit.replace(/\/$/, "") : "https://seasonallyliving.com";
}

/** Every page reachable from the nav plus the note page. */
export function allPagesOf(s: Pick<SiteSettings, "navGroups" | "navLinks">): NavLink[] {
  return [...s.navGroups.flatMap((g) => g.items), ...s.navLinks, { href: "/note", label: "The monthly note" }];
}
