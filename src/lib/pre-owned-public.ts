// What the public site may read and show about a pre-owned spa. Pure (type-only imports), so it can be
// checked under plain node (scripts/check-pre-owned-prices.ts).
import type { PreOwnedStatus } from "@/content/types";

/** The GROQ projection for public reads. Internal intake fields (source, acquisitionCost, reconCost,
 *  intakeNotes, receivedDate) must never appear here; the check script fails if one does.
 *  `price` is the public asking price (whole US dollars). */
export const SPA_FIELDS = `_id, title, "slug": slug.current, "rawStatus": status, brand, model, year, seats, size, electrical, features, highlights,
  condition, warranty, price, listedDate, soldDate, "recon": reconChecklist, photos[]{image, alt}, featured, sortOrder`;

/** Highest price the public page will print. Anything above is treated as a typo and not shown. */
export const MAX_PUBLIC_PRICE = 250_000;

/** A usable public price: a positive whole-dollar number. Strings, zero, negatives, NaN and absurd values are dropped. */
export function cleanPrice(raw: unknown): number | undefined {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return undefined;
  const dollars = Math.round(raw);
  return dollars >= 1 && dollars <= MAX_PUBLIC_PRICE ? dollars : undefined;
}

/** The price to publish for a spa at this public status. Sold spas never carry a price. */
export function publicPrice(status: PreOwnedStatus, raw: unknown): number | undefined {
  return status === "sold" ? undefined : cleanPrice(raw);
}

/** "$4,995" */
export function formatPrice(dollars: number): string {
  return "$" + dollars.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
