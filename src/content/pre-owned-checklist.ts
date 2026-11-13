// The shop checklist. Keys match the `reconChecklist` booleans in studio/schemas.ts (keep both in sync).
// Staff tick what was actually done on each unit; only ticked items are shown on the public page.
export const RECON_CHECKLIST = [
  { key: "inspected", label: "Full inspection by our shop techs" },
  { key: "plumbing", label: "Plumbing checked for leaks" },
  { key: "equipment", label: "Pumps, heater and controls tested" },
  { key: "filters", label: "Filters cleaned or replaced" },
  { key: "cabinet", label: "Shell and cabinet cleaned" },
  { key: "sanitized", label: "Sanitized and filled for a test run" },
  { key: "cover", label: "Cover checked" },
] as const;

/** Fixed feature tags used by the gallery filter. Keep in sync with the `features` list in studio/schemas.ts. */
export const SPA_FEATURES = ["Lounger seat", "LED lighting", "Waterfall", "Bluetooth audio", "Cover included", "Swim / exercise"] as const;

/** A spa counts as "just arrived" for this many days after its listed date. TODO-confirm with Kimberly. */
export const JUST_ARRIVED_DAYS = 21;
/** The "Recently found homes" strip shows spas sold within this many days. TODO-confirm. */
export const RECENTLY_SOLD_DAYS = 180;
