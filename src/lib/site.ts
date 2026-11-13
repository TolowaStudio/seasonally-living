/** Seasonally Living — public business facts. Keep in sync with Google Business Profile. */
export const site = {
  name: "Seasonally Living",
  legalName: "Seasonally Living by Chim Chimney",
  tagline: "Live for the season.",
  description:
    "Wenatchee's home resort showroom: Stûv wood stoves and fireplaces, venting and chimney service, Cal Spas hot tubs, swim spas, saunas and pools.",
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

export const NAV = [
  { href: "/fireplaces", label: "Fireplaces & Stoves" },
  { href: "/hot-tubs", label: "Hot Tubs" },
  { href: "/swim-spas", label: "Swim Spas" },
  { href: "/pools", label: "Pools" },
  { href: "/service", label: "Venting & Service" },
  { href: "/visit", label: "Visit" },
] as const;
