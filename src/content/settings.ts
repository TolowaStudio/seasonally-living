import type { SiteSettings } from "./types";

/** Defaults for the siteSettings document. Sanity overrides any field it has. */
export const SETTINGS: SiteSettings = {
  _type: "siteSettings",
  name: "Seasonally Living",
  legalName: "Seasonally Living by Chim Chimney",
  description:
    "Wenatchee's home resort showroom since 1995: Cal Spas hot tubs and swim spas, Stûv wood stoves, gas and electric fireplaces, venting and chimney service, Cal Saunas, outdoor living and pools.",
  founded: 1979,
  showroomOpened: 1995,
  owners: "Cam & Susan McNeill",
  phoneDisplay: "(509) 667-8833",
  phoneTel: "+15096678833",
  email: "sales@seasonallyliving.com",
  address: { line1: "1407 Maiden Ln", city: "Wenatchee", state: "WA", zip: "98801", note: "Next to Home Depot" },
  hours: [
    { days: "Tuesday – Saturday", time: "10am – 4pm" },
    { days: "Sunday & Monday", time: "Closed (appointments welcome)" },
  ],
  serviceArea: ["Wenatchee", "East Wenatchee", "Leavenworth", "Chelan", "Cashmere", "Manson"],
  logo: "seasonally-living/brand/logo/seasonally-living-script-blue",
  navGroups: [
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
      label: "Outdoor",
      href: "/outdoor-living",
      items: [
        { href: "/saunas", label: "Cal Saunas", note: "Traditional & infrared" },
        { href: "/outdoor-living", label: "Outdoor kitchens & projects", note: "Cal Flame, patios, gazebos" },
      ],
    },
  ],
  navLinks: [
    { href: "/builders", label: "Builders" },
    { href: "/about", label: "Our story" },
    { href: "/visit", label: "Visit" },
  ],
};
