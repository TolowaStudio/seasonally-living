export const INTERESTS = [
  { id: "hearth", label: "Fireplaces & stoves", magnet: "Burn-ban-ready fireplace guide" },
  { id: "venting", label: "Venting & chimney service", magnet: "Pre-season venting checklist" },
  { id: "hot-tub", label: "Hot tubs", magnet: "Winter hot tub care guide" },
  { id: "pre-owned", label: "Certified pre-owned spas", magnet: "48-hour first look at pre-owned arrivals" },
  { id: "swim-spa", label: "Swim spas", magnet: "Swim spa vs. pool: the honest comparison" },
  { id: "pool", label: "Pool planning", magnet: "Spring 2027 pool planning guide" },
] as const;

export type InterestId = (typeof INTERESTS)[number]["id"];
export const INTEREST_IDS = INTERESTS.map((i) => i.id) as readonly string[];
