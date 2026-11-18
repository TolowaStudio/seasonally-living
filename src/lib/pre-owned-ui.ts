import type { PreOwnedSpa, PreOwnedStatus } from "@/content/types";

// Pure helpers shared by server and client components (no Sanity client in here).

export function statusLabel(s: PreOwnedStatus) {
  return s === "reserved" ? "Reserved" : s === "sold" ? "Found a home" : "Available";
}

export function specLine(s: PreOwnedSpa) {
  return [s.seats ? `${s.seats} seats` : "", s.year ? String(s.year) : "", s.size ?? ""].filter(Boolean).join(" · ");
}

/** Seat bands used by the gallery filter and the arrival-alert form. */
export const SEAT_BANDS = [
  { id: "2-4", label: "2 to 4 seats", min: 1, max: 4 },
  { id: "5-6", label: "5 to 6 seats", min: 5, max: 6 },
  { id: "7+", label: "7 or more", min: 7, max: 99 },
] as const;

export function seatBandOf(seats?: number) {
  if (!seats) return undefined;
  return SEAT_BANDS.find((b) => seats >= b.min && seats <= b.max)?.id;
}

/** "March 2026" from an ISO date; empty when missing or invalid. */
export function monthYear(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00Z");
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export type SpaSort = "arrival" | "seats-desc" | "seats-asc" | "year-desc" | "price-asc" | "price-desc";

/** Spas with no usable price sort last for both price sorts, so a missing price never reads as "cheapest". */
const priceKey = (s: PreOwnedSpa, dir: 1 | -1) => (s.price === undefined ? Infinity : s.price * dir);

const BY: Record<SpaSort, (a: PreOwnedSpa, b: PreOwnedSpa) => number> = {
  arrival: (a, b) => (b.listedDate ?? "").localeCompare(a.listedDate ?? ""),
  "seats-desc": (a, b) => (b.seats ?? 0) - (a.seats ?? 0),
  "seats-asc": (a, b) => (a.seats ?? 99) - (b.seats ?? 99),
  "year-desc": (a, b) => (b.year ?? 0) - (a.year ?? 0),
  "price-asc": (a, b) => priceKey(a, 1) - priceKey(b, 1) || 0,
  "price-desc": (a, b) => priceKey(a, -1) - priceKey(b, -1) || 0,
};

/** Available first, then reserved; featured spas lead within each group, then the chosen sort. Does not mutate. */
export function sortSpas(spas: PreOwnedSpa[], sort: SpaSort): PreOwnedSpa[] {
  return [...spas].sort(
    (a, b) => Number(a.status === "reserved") - Number(b.status === "reserved") || Number(!!b.featured) - Number(!!a.featured) || BY[sort](a, b),
  );
}
