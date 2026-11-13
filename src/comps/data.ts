// Shared, true-or-placeholder content for the design comps (TOL-3347).
// Facts come from src/content (settings, pages, about). Anything not yet confirmed is labelled Placeholder.
import { IMG } from "@/content/pages";

export type V = "a" | "b" | "c";

export const COMPS: Record<V, { letter: string; name: string; line: string; rationale: string }> = {
  a: {
    letter: "A",
    name: "Four seasons resort",
    line: "Cinematic and dark. The valley through the year; soak, swim and fire as rituals.",
    rationale: "Most emotional. Sells the life, not the product. Best if the photography carries the brand.",
  },
  b: {
    letter: "B",
    name: "The family shop",
    line: "Warm and editorial. Cam & Susan, 40 years, craft and service first.",
    rationale: "Most human. Turns \"family-owned since 1979\" into the reason to buy. Best against big-box and online.",
  },
  c: {
    letter: "C",
    name: "Modern showroom",
    line: "Crisp, pale and product-forward. A strong grid, Scandinavian restraint.",
    rationale: "Most shoppable. Fits Stûv and Morsø packshots best. Best if the goal is browsing to a visit.",
  },
};

const B = "seasonally-living/brand/";
export const PHOTO = {
  ...IMG,
  hotTubSnow: IMG.hotTubSnow,
  underglow: IMG.csUnderglow,
  swimProX: B + "calspas/swim-pro-x-garden",
  swimX: B + "calspas/swim-x-2026",
  localBalsamrootHill: B + "local/balsamroot-hillside",
  localBalsamrootBloom: B + "local/balsamroot-bloom",
  localColumbia: B + "local/columbia-river",
  localFallRiver: B + "local/fall-river",
  localValleySnow: B + "local/valley-snow-peaks",
};

/** The five lines. Pools are projects, so they get a process instead of a product grid. */
export const LINES = {
  tubs: { title: "Hot tubs & swim spas", note: "Official Cal Spas dealer. Try one running in the showroom.", href: "/hot-tubs" },
  pools: { title: "Swimming pools", note: "Installed by our own crew, from first consult to first swim.", href: "/pools" },
  preowned: { title: "Pre-owned spas", note: "Trade-ins inspected and repaired in our own shop.", href: "/pre-owned" },
  hearth: { title: "Hearth & venting", note: "Stûv, Kuma, Morsø and Napoleon, vented and installed by our crew.", href: "/fireplaces" },
};

/** Pool install sequence, taken from the live /pools copy. No durations beyond what that page says. */
export const POOL_STEPS = [
  { when: "This winter", title: "Design consult", body: "Budget, site, timeline and how you'll use it, with the crew who'll install it." },
  { when: "Over the winter", title: "Plan and permit", body: "Layout, equipment and permits handled before the ground thaws." },
  { when: "Spring into summer", title: "Install", body: "Our crew installs the pool and its surround, with a clear schedule from day one." },
  { when: "The first warm day", title: "First swim", body: "Start-up and orientation, and we're still here to service it." },
];

export const STORY = [
  { year: "1979", title: "Chim Chimney begins", body: "Cam and Susan McNeill start Chim Chimney Fireplace and Masonry in Wenatchee." },
  { year: "1995", title: "The showroom opens", body: "So neighbors can see a fire burning and sit in a hot tub before they decide." },
  { year: "2024", title: "Fire and water", body: "The business is simplified to what it does best: stoves, venting, spas and pools." },
  { year: "Today", title: "Seasonally Living", body: "Seasonally Living by Chim Chimney, next door to Home Depot. Still a family business." },
];

export const CREDENTIALS = ["Family-owned since 1979", "Showroom since 1995", "Official Cal Spas dealer", "Pools installed by our own crew"];

export const TUB_TYPES = [
  { tag: "Couples", name: "Compact tubs", seats: "2 to 4 seats", body: "Easy to place on a deck or patio, quick to heat.", image: IMG.csEscape, pos: "62% 50%" },
  { tag: "Family", name: "Full-size tubs", seats: "5 to 7 seats", body: "A lounger and room for the whole family on a cold night.", image: IMG.csPlatinum, pos: "58% 50%" },
  { tag: "Therapy", name: "Hydrotherapy tubs", seats: "Targeted jet seats", body: "For backs, shoulders and feet after a day on the mountain.", image: IMG.csMountain, pos: "50% 50%" },
];

export const WHY_HERE = [
  { title: "Try before you buy", body: "Models filled and running in the showroom. Bring a swimsuit if you like." },
  { title: "Delivered and set up", body: "Site prep, pads and electrical planning, delivery, placement and start-up." },
  { title: "Orientation for every buyer", body: "We walk you through water care, filters and settings so it stays easy." },
];

export const SWIM_MODELS = [
  { name: "Swim Pro", body: "A steady current for families and light swimmers, with seats for a soak." },
  { name: "Swim Pro X", body: "More power and a deeper channel for serious swimmers." },
];

export const PRE_OWNED_STEPS = ["Inspected by our techs", "Repaired and cleaned", "Delivered like a new tub"];
