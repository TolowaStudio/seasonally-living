export const INTERESTS = [
  { id: "hearth", label: "Fireplaces & stoves", magnet: "Burn-ban-ready fireplace guide" },
  { id: "venting", label: "Venting", magnet: "Pre-season venting checklist" },
  { id: "hot-tub", label: "Hot tubs", magnet: "Winter hot tub care guide" },
  { id: "pre-owned", label: "Pre-owned spas", magnet: "First look at pre-owned arrivals" },
  { id: "swim-spa", label: "Swim spas", magnet: "Swim spa vs. pool: the honest comparison" },
  { id: "pool", label: "Swimming pools", magnet: "Spring 2027 pool planning guide" },
  { id: "builder", label: "Builder / trade", magnet: "Quarterly builder update" },
  // Capture-only ids from the pre-owned pages (TOL-2901). `internal` keeps them out of the pick-a-topic UIs.
  { id: "pre-owned-supply", label: "Pre-owned: sell or trade in a tub", magnet: "", internal: true },
  { id: "pre-owned-alert", label: "Pre-owned: arrival alert", magnet: "", internal: true },
] as const;

/** Interests a visitor can pick in the visit form and note signup. */
export const PICKABLE_INTERESTS = INTERESTS.filter((i) => !("internal" in i));

export type InterestId = (typeof INTERESTS)[number]["id"];
export const INTEREST_IDS = INTERESTS.map((i) => i.id) as readonly string[];
