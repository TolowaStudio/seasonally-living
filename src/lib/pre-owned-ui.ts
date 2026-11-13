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
