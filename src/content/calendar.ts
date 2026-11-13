// Content calendar: the weekly rhythm, seasonal lead lines, local hooks and the vetted hero photo pool.
// Read by scripts/content/draft-week.ts only; the website itself never imports this file.
// Plain types and data, no enums, so Node can run it directly (--experimental-strip-types).

import type { JournalSeason } from "./journal";

export type Line = "hot-tub" | "swim-spa" | "pool" | "pre-owned" | "spa-care" | "hearth" | "venting" | "local";
export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

/** What a slot needs from a person before the copy can be true. */
export type SlotInput = "none" | "arrival" | "video";

export type Slot = {
  day: Day;
  kind: string;
  /** Plain-words brief handed to the writer. */
  brief: string;
  /** Does the slot become a /journal article (true) or social-only (false)? */
  article: boolean;
  /** "arrival" = a real pre-owned spa or product the shop must describe; "video" = a transcript. Missing input => placeholders, never invented facts. */
  input: SlotInput;
  /** Preferred lines, picked from the season's lead lines when blank. */
  lines?: Line[];
};

/** The weekly rhythm. Edit freely; the generator drafts one post per slot. */
export const WEEKLY_RHYTHM: Slot[] = [
  {
    day: "Mon",
    kind: "tip",
    article: true,
    input: "none",
    brief: "A practical tip a customer can use this week. One problem, one clear answer, a short checklist. General, well-known advice only; no claims about what the shop does unless the brief says so.",
  },
  {
    day: "Wed",
    kind: "arrival",
    article: false,
    input: "arrival",
    lines: ["pre-owned"],
    brief: "A new arrival on the floor (a pre-owned spa or a product). Describe ONLY the facts supplied in the input. Ask people to call for price; never print a price.",
  },
  {
    day: "Fri",
    kind: "local-seasonal",
    article: true,
    input: "none",
    lines: ["local"],
    brief: "Something local and seasonal for the Wenatchee valley, tied to a hook from the list: weather, the season, a community moment. Connect it, gently, to a line the shop carries.",
  },
  {
    day: "Sat",
    kind: "video",
    article: false,
    input: "video",
    brief: "A short video post: caption plus a one-line hook for the first three seconds. Describe ONLY what the supplied transcript or description shows.",
  },
];

export type SeasonPlan = {
  months: number[]; // 1-12
  /** The lines to lead with, in order. */
  lead: Line[];
  /** Supporting lines for variety. */
  also: Line[];
  /** Seasonal angles the writer can draw on (all general; none are shop claims). */
  angles: string[];
};

export const SEASONS: Record<Exclude<JournalSeason, "year-round">, SeasonPlan> = {
  winter: {
    months: [12, 1, 2],
    lead: ["hearth", "hot-tub", "pre-owned"],
    also: ["venting", "spa-care", "local"],
    angles: [
      "Burn-ban days and what still works (gas, electric, certified stoves)",
      "Hot tubs in a hard freeze: keep it running, cover latched",
      "Soaking on a cold clear night",
      "Pre-owned spas as an honest way into a hot tub",
      "Winter heat: stoves and inserts on a cold snap",
    ],
  },
  spring: {
    months: [3, 4, 5],
    lead: ["swim-spa", "pool", "spa-care"],
    also: ["hot-tub", "pre-owned", "local"],
    angles: [
      "Planning a pool now so it is ready for summer",
      "Swim spa or pool: how to choose",
      "Spa openings and spring water care",
      "Getting the yard and pad ready",
      "Allergy-season and wind: covers and care",
    ],
  },
  summer: {
    months: [6, 7, 8],
    lead: ["pool", "swim-spa", "spa-care"],
    also: ["hot-tub", "local"],
    angles: [
      "Behind the scenes of a pool build (crew, progress, steps)",
      "Keeping water clear in a hot, dry valley summer",
      "Swim spas for laps and cooling off",
      "Evening soaks after a hot day",
    ],
  },
  fall: {
    months: [9, 10, 11],
    lead: ["hearth", "venting", "hot-tub"],
    also: ["pre-owned", "spa-care", "local"],
    angles: [
      "Burn prep: venting inspections before the first fire",
      "Choosing a stove before the rush",
      "Getting the hot tub ready for cold weather",
      "Burn-ban stages explained",
      "Pre-season venting checklist",
    ],
  },
};

export function seasonOf(date: Date): Exclude<JournalSeason, "year-round"> {
  const m = date.getMonth() + 1;
  return (Object.entries(SEASONS).find(([, s]) => s.months.includes(m))?.[0] ?? "winter") as Exclude<JournalSeason, "year-round">;
}

/**
 * Local hooks the writer MAY mention. These are suggestions, not facts to quote: dates and details
 * change every year, so the writer is told not to state a specific date or time. A person checks
 * anything event-specific before approving.
 */
export const LOCAL_HOOKS: { months: number[]; hook: string }[] = [
  { months: [11, 12, 1, 2], hook: "Cold snaps and freezing nights in the valley" },
  { months: [10, 11, 12, 1, 2], hook: "Burn-ban days when the air stalls" },
  { months: [12], hook: "Holiday lights season in Leavenworth and around the valley" },
  { months: [3, 4], hook: "The first warm days after winter" },
  { months: [4, 5], hook: "Apple blossom season in the valley" },
  { months: [6, 7, 8], hook: "Hot, dry valley summers" },
  { months: [9, 10], hook: "Fall colour along the Columbia and the Wenatchee River" },
  { months: [1, 2, 3, 11, 12], hook: "Ski season in the Cascades, and coming home cold" },
];

/**
 * Vetted hero photos (Cloudinary cloud tolowa-studio). The generator picks from here by line and
 * season, so a model can never invent an image ID. Add more as photos arrive.
 */
export const HERO_POOL: { id: string; alt: string; lines: Line[]; seasons: JournalSeason[] }[] = [
  { id: "seasonally-living/brand/calspas/hot-tub-underglow-night", alt: "A Cal Spas hot tub glowing at night", lines: ["hot-tub", "spa-care"], seasons: ["winter", "fall", "year-round"] },
  { id: "seasonally-living/brand/calspas/hot-tub-mountain-patio", alt: "A Cal Spas hot tub on a patio with mountains behind", lines: ["hot-tub", "local"], seasons: ["summer", "spring", "year-round"] },
  { id: "seasonally-living/brand/calspas/escape-patio", alt: "A hot tub on a patio", lines: ["pre-owned", "hot-tub"], seasons: ["year-round"] },
  { id: "seasonally-living/brand/calspas/swim-pro-garden", alt: "A Cal Spas swim spa in a garden", lines: ["swim-spa", "pool"], seasons: ["spring", "summer", "year-round"] },
  { id: "seasonally-living/brands/stuv/hero", alt: "A Stûv wood stove", lines: ["hearth"], seasons: ["winter", "fall", "year-round"] },
  { id: "seasonally-living/brands/kuma/hero", alt: "A Kuma wood stove", lines: ["hearth", "venting"], seasons: ["winter", "fall", "year-round"] },
  { id: "seasonally-living/brands/napoleon/hero", alt: "A Napoleon fireplace", lines: ["hearth"], seasons: ["winter", "fall", "year-round"] },
  { id: "seasonally-living/brand/local/valley-snow-peaks", alt: "The valley below snowy peaks", lines: ["local"], seasons: ["winter"] },
  { id: "seasonally-living/brand/local/snowy-peaks-valley", alt: "Snowy peaks above the valley", lines: ["local"], seasons: ["winter"] },
  { id: "seasonally-living/brand/local/balsamroot-bloom", alt: "Balsamroot in bloom on a hillside", lines: ["local"], seasons: ["spring"] },
  { id: "seasonally-living/brand/local/lupine-mountains", alt: "Lupine in bloom with mountains behind", lines: ["local"], seasons: ["spring", "summer"] },
  { id: "seasonally-living/brand/local/green-valley", alt: "A green valley", lines: ["local"], seasons: ["summer", "spring"] },
  { id: "seasonally-living/brand/local/columbia-river", alt: "The Columbia River", lines: ["local"], seasons: ["summer", "year-round"] },
  { id: "seasonally-living/brand/local/fall-reflection", alt: "Fall colour reflected in the water", lines: ["local"], seasons: ["fall"] },
  { id: "seasonally-living/brand/local/fall-river", alt: "A river in fall", lines: ["local"], seasons: ["fall"] },
  { id: "seasonally-living/brand/local/valley-overview", alt: "An overview of the valley", lines: ["local"], seasons: ["year-round"] },
];

/** Best vetted photo for a line and season; falls back to a valley overview. */
export function heroFor(lines: Line[], season: JournalSeason, pick = 0): { id: string; alt: string } {
  const score = (h: (typeof HERO_POOL)[number]) =>
    (lines.length ? Math.max(...lines.map((l) => (h.lines.includes(l) ? 2 : 0))) : 0) + (h.seasons.includes(season) ? 1 : 0);
  const ranked = [...HERO_POOL].sort((a, b) => score(b) - score(a));
  const best = ranked.filter((h) => score(h) === score(ranked[0]));
  const h = best[pick % best.length];
  return { id: h.id, alt: h.alt };
}

export const THEMES = ["freeze-prep", "burn-ban", "stove-shopping", "pre-owned-buying", "pool-planning", "swim-spa-vs-pool", "spa-water-care", "venting-inspection"] as const;
