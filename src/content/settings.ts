import type { SiteSettings } from "./types";

/** Defaults for the siteSettings document. Sanity overrides any field it has. */
export const SETTINGS: SiteSettings = {
  _type: "siteSettings",
  name: "Seasonally Living",
  legalName: "Seasonally Living by Chim Chimney",
  description:
    "Wenatchee's home resort showroom since 1995: Cal Spas hot tubs, swim spas and pre-owned spas, swimming pool installation, pool and spa chemicals, Stûv wood stoves, gas and electric inserts, and venting.",
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
  // TODO-confirm (TOL-2908): set the real Google review link in the Studio once the profile is claimed.
  googleReviewUrl: "",
  // TODO-confirm: the business Facebook page (not Susan's personal profile).
  facebookUrl: "",
  facebookReviewUrl: "",
  sameAs: [],
  // Geocoded from 1407 Maiden Ln, Wenatchee (OpenStreetMap, 2026-11-12). TODO-confirm against the Google pin.
  geo: { lat: 47.453, lng: -120.3357 },
  navGroups: [
    {
      label: "Water",
      href: "/hot-tubs",
      items: [
        { href: "/hot-tubs", label: "Cal Spas hot tubs", note: "Try one in the showroom" },
        { href: "/swim-spas", label: "Swim spas", note: "Swim Pro & Swim Pro X" },
        { href: "/pre-owned", label: "Pre-owned spas", note: "Inspected trade-ins" },
        { href: "/pre-owned/sell", label: "Sell or trade in your tub", note: "We haul it away" },
        { href: "/pools", label: "Swimming pools", note: "Installed by our crew" },
        { href: "/spa-care", label: "Pool & spa care", note: "Chemicals, filters, supplies" },
      ],
    },
    {
      label: "Fire",
      href: "/fireplaces",
      items: [
        { href: "/fireplaces", label: "Fireplaces & stoves", note: "Every line, by kind of fire" },
        { href: "/fireplaces/stuv", label: "Stûv", note: "Belgian wood stoves & fireplaces" },
        { href: "/fireplaces/kuma", label: "Kuma", note: "American-built wood stoves" },
        { href: "/fireplaces/morso", label: "Morsø", note: "Danish cast-iron stoves" },
        { href: "/fireplaces/napoleon", label: "Napoleon", note: "Gas & electric fireplaces" },
        { href: "/fireplaces/gas-electric", label: "Gas & electric inserts", note: "Heat on burn-ban days" },
        { href: "/hearth-supplies", label: "Hearth & venting supplies", note: "Mantels, venting, parts" },
        { href: "/service", label: "Venting service", note: "Design, install, inspections" },
      ],
    },
  ],
  navLinks: [
    { href: "/builders", label: "Builders" },
    { href: "/about", label: "Our story" },
    { href: "/visit", label: "Visit" },
  ],
};
