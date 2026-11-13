export const INTERESTS = [
  { id: "hearth", label: "Fireplaces & stoves", magnet: "Burn-ban-ready fireplace guide" },
  { id: "venting", label: "Venting & chimney", magnet: "Pre-season venting checklist" },
  { id: "hot-tub", label: "Hot tubs", magnet: "Winter hot tub care guide" },
  { id: "pre-owned", label: "Pre-owned spas", magnet: "First look at pre-owned arrivals" },
  { id: "swim-spa", label: "Swim spas", magnet: "Swim spa vs. pool: the honest comparison" },
  { id: "sauna", label: "Saunas", magnet: "Traditional vs. infrared sauna guide" },
  { id: "pool", label: "Pool planning", magnet: "Spring 2027 pool planning guide" },
  { id: "outdoor", label: "Outdoor living", magnet: "Backyard project planner" },
  { id: "builder", label: "Builder / trade", magnet: "Quarterly builder update" },
] as const;

export type InterestId = (typeof INTERESTS)[number]["id"];
export const INTEREST_IDS = INTERESTS.map((i) => i.id) as readonly string[];
