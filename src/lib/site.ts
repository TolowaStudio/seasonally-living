/** Seasonally Living — public business facts. Keep in sync with Google Business Profile. */
export const site = {
  name: "Seasonally Living",
  legalName: "Seasonally Living by Chim Chimney",
  tagline: "Live for the season.",
  description:
    "Wenatchee's home resort showroom since 1995: Stûv wood stoves, gas and electric fireplaces, venting and chimney service, Cal Spas hot tubs and swim spas, Cal Saunas, outdoor living and pools.",
  founded: 1979,
  showroomOpened: 1995,
  owners: "Cam & Susan McNeill",
  phoneDisplay: "(509) 667-8833",
  phoneTel: "+15096678833",
  email: "sales@seasonallyliving.com",
  address: {
    line1: "1407 Maiden Ln",
    city: "Wenatchee",
    state: "WA",
    zip: "98801",
    note: "Next to Home Depot",
  },
  hours: [
    { days: "Tuesday – Saturday", time: "10am – 4pm" },
    { days: "Sunday & Monday", time: "Closed (appointments welcome)" },
  ],
  serviceArea: ["Wenatchee", "East Wenatchee", "Leavenworth", "Chelan", "Cashmere", "Manson"],
} as const;

export const addressBlock = `${site.address.line1}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.legalName} ${addressBlock}`,
)}`;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return explicit ? explicit.replace(/\/$/, "") : "https://seasonallyliving.com";
}

export type NavLink = { href: string; label: string; note?: string };
export type NavGroup = { label: string; href: string; items: NavLink[] };

/** Grouped navigation. Every page on the site is reachable from here. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Fire",
    href: "/fireplaces",
    items: [
      { href: "/fireplaces", label: "Stûv wood stoves & fireplaces", note: "The feature collection" },
      { href: "/fireplaces/gas-electric", label: "Gas & electric fireplaces", note: "Heat on burn-ban days" },
      { href: "/hearth-supplies", label: "Hearth & venting supplies", note: "Mantels, venting, parts" },
      { href: "/service", label: "Venting & chimney service", note: "Design, install, sweeps" },
    ],
  },
  {
    label: "Water",
    href: "/hot-tubs",
    items: [
      { href: "/hot-tubs", label: "Cal Spas hot tubs", note: "Try one in the showroom" },
      { href: "/swim-spas", label: "Swim spas", note: "Swim Pro & Swim Pro X" },
      { href: "/pre-owned", label: "Pre-owned spas", note: "Inspected trade-ins" },
      { href: "/spa-care", label: "Pool & spa care", note: "Water care, filters, covers" },
      { href: "/pools", label: "Pools", note: "Spring 2027 builds" },
    ],
  },
  {
    label: "Outdoor",
    href: "/outdoor-living",
    items: [
      { href: "/saunas", label: "Cal Saunas", note: "Traditional & infrared" },
      { href: "/outdoor-living", label: "Outdoor kitchens & projects", note: "Cal Flame, patios, gazebos" },
    ],
  },
];

export const NAV_LINKS: NavLink[] = [
  { href: "/builders", label: "Builders" },
  { href: "/about", label: "Our story" },
  { href: "/visit", label: "Visit" },
];

/** Flat list (footer, sitemap). */
export const ALL_PAGES: NavLink[] = [
  ...NAV_GROUPS.flatMap((g) => g.items),
  ...NAV_LINKS,
  { href: "/note", label: "The monthly note" },
];
