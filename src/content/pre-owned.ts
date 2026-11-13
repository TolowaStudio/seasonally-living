import type { PreOwnedSpa } from "./types";

// Demo listings for local preview only. Used when PREOWNED_DEMO=1; never in production.
export const DEMO_PRE_OWNED: PreOwnedSpa[] = [
  {
    title: "2019 Cal Spas Escape",
    slug: "2019-cal-spas-escape",
    status: "available",
    brand: "Cal Spas",
    model: "Escape",
    year: 2019,
    seats: 6,
    size: '84" x 84" x 36"',
    electrical: "240V / 50A",
    highlights: ["Full LED lighting", "Waterfall feature", "Insulated cabinet"],
    condition: "Pumps tested, filters replaced, cabinet cleaned and sealed. Holds temperature as new.",
    photos: [
      { image: "seasonally-living/brand/calspas/escape-patio", alt: "Cal Spas Escape on a patio" },
      { image: "seasonally-living/brand/calspas/hot-tub-mountain-patio", alt: "Hot tub with mountain view" },
    ],
    featured: true,
  },
  {
    title: "2020 Cal Spas Platinum Patio",
    slug: "2020-cal-spas-platinum-patio",
    status: "pending",
    brand: "Cal Spas",
    model: "Platinum",
    year: 2020,
    seats: 7,
    size: '90" x 90" x 38"',
    electrical: "240V / 50A",
    highlights: ["Premium jet package", "Bluetooth audio"],
    condition: "Full inspection, new cover, heater and control pack tested.",
    photos: [{ image: "seasonally-living/brand/calspas/platinum-patio", alt: "Platinum spa on a patio" }],
  },
  {
    title: "2018 Cal Spas Platinum Courtyard",
    slug: "2018-cal-spas-platinum-courtyard",
    status: "available",
    brand: "Cal Spas",
    model: "Platinum",
    year: 2018,
    seats: 5,
    size: '84" x 72" x 36"',
    electrical: "240V / 50A",
    highlights: ["Underglow lighting", "Lounger seat"],
    condition: "Plumbing pressure tested, jets and pillows refreshed.",
    photos: [
      { image: "seasonally-living/brand/calspas/platinum-courtyard", alt: "Platinum spa in a courtyard" },
      { image: "seasonally-living/brand/calspas/hot-tub-underglow-night", alt: "Spa glowing at night" },
    ],
  },
];
