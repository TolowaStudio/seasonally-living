export const INTERESTS = [
  { id: "hearth", label: "Fireplaces & stoves", magnet: "Burn-ban-ready fireplace guide" },
  { id: "venting", label: "Venting", magnet: "Pre-season venting checklist" },
  { id: "hot-tub", label: "Hot tubs", magnet: "Winter hot tub care guide" },
  { id: "pre-owned", label: "Pre-owned spas", magnet: "First look at pre-owned arrivals" },
  { id: "swim-spa", label: "Swim spas", magnet: "Swim spa vs. pool: the honest comparison" },
  { id: "pool", label: "Swimming pools", magnet: "Spring 2027 pool planning guide" },
  { id: "builder", label: "Builder / trade", magnet: "Quarterly builder update" },
] as const;

export type InterestId = (typeof INTERESTS)[number]["id"];
export const INTEREST_IDS = INTERESTS.map((i) => i.id) as readonly string[];
