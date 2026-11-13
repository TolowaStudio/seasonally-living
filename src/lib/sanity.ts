import { cache } from "react";
import { createClient } from "@sanity/client";
import { ALL_PAGES } from "@/content/pages";
import { SETTINGS } from "@/content/settings";
import { DEMO_PRE_OWNED } from "@/content/pre-owned";
import { JUST_ARRIVED_DAYS, RECENTLY_SOLD_DAYS, RECON_CHECKLIST } from "@/content/pre-owned-checklist";
import { BRANDS } from "@/content/brands";
import { LANDING_PAGES, type LandingContent } from "@/content/landing";
import { GUIDES, type Guide } from "@/content/guides";
import type { BrandContent, PageContent, PreOwnedSpa, PreOwnedStatus, SiteSettings } from "@/content/types";
import { mergeContent } from "./merge";
import { brandFromSanity } from "./brand-content";

export { mergeContent };

// Content lives in Sanity (project 83r23z7t, public dataset "production").
// Every read falls back to the code defaults in src/content, so the site never
// renders empty if Sanity is slow or unreachable. Pages revalidate every 60s (ISR).
export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "83r23z7t";
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const REVALIDATE_SECONDS = 60;

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: true,
  perspective: "published",
});

/** Stable document id for a page path, e.g. "/fireplaces/gas-electric" -> "page-fireplaces-gas-electric".
 *  (No dots: Sanity treats dotted IDs as private paths that the public API cannot read.) */
export function pageDocId(pageId: string) {
  return "page-" + (pageId === "/" ? "home" : pageId.replace(/^\//, "").replace(/\//g, "-"));
}

// One fetch per document per render (generateMetadata, layout and page share it), aborted after 4s.
const fetchDoc = cache(async (id: string): Promise<unknown> => {
  try {
    return await client.fetch(
      `*[_id == $id][0]`,
      { id },
      { signal: AbortSignal.timeout(4000), next: { revalidate: REVALIDATE_SECONDS, tags: [id] } },
    );
  } catch (err) {
    console.error("sanity: fetch failed for", id, err instanceof Error ? err.message : err);
    return null;
  }
});

export async function getPage<T extends PageContent>(pageId: string): Promise<T> {
  const fallback = ALL_PAGES.find((p) => p.pageId === pageId) as T | undefined;
  if (!fallback) throw new Error(`No default content for ${pageId}`);
  return mergeContent(fallback, await fetchDoc(pageDocId(pageId)));
}

export async function getSettings(): Promise<SiteSettings> {
  return mergeContent(SETTINGS, await fetchDoc("siteSettings"));
}

// ---- Pre-owned spas ("on the floor") ----
// Public projection only. Internal intake fields (source, acquisitionCost, reconCost, intakeNotes, receivedDate)
// are never selected, and `reconChecklist` is read only to turn ticked items into public labels.
// NOTE: the "production" dataset is public, so those fields are still readable straight from the Sanity API.
// Do not enter real costs until the dataset is private or intake lives in a private dataset (see PR notes).
const SPA_FIELDS = `_id, title, "slug": slug.current, "rawStatus": status, brand, model, year, seats, size, electrical, features, highlights,
  condition, warranty, listedDate, soldDate, "recon": reconChecklist, photos[]{image, alt}, featured, sortOrder`;

type RawSpa = Omit<PreOwnedSpa, "status" | "checklist" | "justArrived"> & {
  rawStatus?: string;
  recon?: Record<string, boolean | null> | null;
};

/** Sanity stage -> public status. Intake and reconditioning (and anything unknown) are not public. */
export function publicStatus(raw?: string): PreOwnedStatus | null {
  if (raw === "listed" || raw === "available") return "listed";
  if (raw === "reserved" || raw === "pending") return "reserved";
  if (raw === "sold") return "sold";
  return null;
}

const daysSince = (iso?: string) => {
  if (!iso) return Infinity;
  const t = Date.parse(iso + "T12:00:00Z");
  return Number.isNaN(t) ? Infinity : (Date.now() - t) / 86_400_000;
};

export function toPublicSpa(r: RawSpa): PreOwnedSpa | null {
  const status = publicStatus(r.rawStatus);
  if (!status || !r.slug) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rawStatus, recon, ...rest } = r;
  const checklist = RECON_CHECKLIST.filter((c) => recon?.[c.key] === true).map((c) => c.label);
  return {
    ...rest,
    status,
    checklist,
    justArrived: status === "listed" && daysSince(r.listedDate) <= JUST_ARRIVED_DAYS,
  };
}

// Aborted after 4s; null on any failure so callers fall back. (cache() keys params by reference, so
// per-render dedupe only happens in callers that are cached themselves, like getBrands.)
const fetchQuery = cache(async <T>(tag: string, query: string, params: Record<string, unknown>): Promise<T | null> => {
  try {
    return await client.fetch<T>(query, params, {
      signal: AbortSignal.timeout(4000),
      next: { revalidate: REVALIDATE_SECONDS, tags: [tag] },
    });
  } catch (err) {
    console.error(`sanity: ${tag} fetch failed`, err instanceof Error ? err.message : err);
    return null;
  }
});

// Demo listings are for local previews only and never render in production.
const demo = () => process.env.PREOWNED_DEMO === "1" && process.env.NODE_ENV !== "production";

const PUBLIC_RAW_STATUSES = ["listed", "available", "reserved", "pending"];

/** On the floor: listed and reserved spas, available first. Sold, intake and reconditioning never appear. */
export async function getPreOwnedSpas(): Promise<PreOwnedSpa[]> {
  const rows = await fetchQuery<RawSpa[]>(
    "preOwnedSpa",
    `*[_type == "preOwnedSpa" && defined(slug.current) && status in $statuses] | order(featured desc, sortOrder asc, listedDate desc, _createdAt desc){${SPA_FIELDS}}`,
    { statuses: PUBLIC_RAW_STATUSES },
  );
  const spas = (rows ?? []).map(toPublicSpa).filter((s): s is PreOwnedSpa => !!s);
  if (spas.length) return spas.sort((a, b) => Number(a.status === "reserved") - Number(b.status === "reserved"));
  return demo() ? DEMO_PRE_OWNED.filter((s) => s.status !== "sold") : [];
}

/** Social proof strip: spas sold within RECENTLY_SOLD_DAYS that have a photo and a sold date. */
export async function getRecentlySold(limit = 8): Promise<PreOwnedSpa[]> {
  const rows = await fetchQuery<RawSpa[]>(
    "preOwnedSpa",
    `*[_type == "preOwnedSpa" && defined(slug.current) && status == "sold" && defined(soldDate) && defined(photos[0].image)] | order(soldDate desc)[0...20]{${SPA_FIELDS}}`,
    {},
  );
  const sold = (rows ?? []).map(toPublicSpa).filter((s): s is PreOwnedSpa => !!s && daysSince(s.soldDate) <= RECENTLY_SOLD_DAYS);
  if (sold.length) return sold.slice(0, limit);
  return demo() ? DEMO_PRE_OWNED.filter((s) => s.status === "sold") : [];
}

/** One listed or reserved spa by slug; null for sold, intake, reconditioning or unknown. */
export async function getPreOwnedSpa(slug: string): Promise<PreOwnedSpa | null> {
  const row = await fetchQuery<RawSpa | null>("preOwnedSpa", `*[_type == "preOwnedSpa" && slug.current == $slug][0]{${SPA_FIELDS}}`, { slug });
  const spa = row ? toPublicSpa(row) : null;
  if (spa && spa.status !== "sold") return spa;
  if (row) return null;
  const d = demo() ? (DEMO_PRE_OWNED.find((s) => s.slug === slug) ?? null) : null;
  return d && d.status !== "sold" ? d : null;
}

// ---- Hearth brands (/fireplaces/[brand]) ----
// Documents of type "hearthBrand" (ids "hearthBrand-<slug>"). Once Sanity has any brand, its list is
// the list: a brand deleted in the Studio leaves the site. With none (unseeded dataset, Sanity down),
// the code list in src/content/brands.ts renders instead.
const BRAND_FIELDS = `"slug": slug.current, name, origin, categories, tagline, summary, heroImage, heroAlt, heroPosition,
  points[]{title, body}, sections[]{name, summary, image, alt, models[]{name, type, description, facts, image, alt, url, inShowroom}},
  makerUrl, sourceNote`;

export const getBrands = cache(async (): Promise<BrandContent[]> => {
  const rows = await fetchQuery<unknown[]>(
    "hearthBrand",
    `*[_type == "hearthBrand" && defined(slug.current)] | order(coalesce(sortOrder, 999) asc, name asc){${BRAND_FIELDS}}`,
    {},
  );
  const brands = (rows ?? [])
    .map((r) => {
      const slug = r && typeof r === "object" ? (r as { slug?: unknown }).slug : undefined;
      return brandFromSanity(r, BRANDS.find((b) => b.slug === slug));
    })
    .filter((b): b is BrandContent => !!b)
    .filter((b, i, all) => all.findIndex((x) => x.slug === b.slug) === i);
  return brands.length ? brands : BRANDS;
});

export async function getBrand(slug: string): Promise<BrandContent | undefined> {
  return (await getBrands()).find((b) => b.slug === slug);
}

// ---- Campaign landing pages (/lp/[campaign]) ----
// Document type "landingPage", id "landingPage-<slug>". Code defaults in src/content/landing.ts.
export async function getLanding(slug: string): Promise<LandingContent | null> {
  const fallback = LANDING_PAGES.find((p) => p.slug === slug);
  if (!fallback) return null;
  return mergeContent(fallback, await fetchDoc(`landingPage-${slug}`));
}

// ---- Lead-magnet guides (/guides/[slug]) ----
// Code defaults in src/content/guides.ts. A Sanity "guide" document with the same slug overrides the
// matching default field by field; a guide with a new slug is added if it has a title and sections.
const GUIDE_FIELDS = `"slug": slug.current, title, interest, kicker, summary, gives, readMinutes, intro,
  sections[]{heading, body, bullets}, closing{title, body, cta}, seo{title, description}`;

// Studio-authored sections can have blank fields; never let one reach the page as null.
function cleanSections(raw: unknown): Guide["sections"] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map((x) => ({
      heading: typeof x.heading === "string" ? x.heading : "",
      body: typeof x.body === "string" ? x.body : "",
      bullets: Array.isArray(x.bullets) ? x.bullets.filter((b): b is string => typeof b === "string" && b.trim() !== "") : undefined,
    }))
    .filter((x) => x.heading.trim() && (x.body.trim() || x.bullets?.length));
}

export const getGuides = cache(async (): Promise<Guide[]> => {
  const rows = await fetchQuery<unknown[]>("guide", `*[_type == "guide" && defined(slug.current)]{${GUIDE_FIELDS}}`, {});
  const out = new Map<string, Guide>(GUIDES.map((g) => [g.slug, g]));
  for (const r of rows ?? []) {
    const slug = r && typeof r === "object" ? (r as { slug?: unknown }).slug : undefined;
    if (typeof slug !== "string" || !/^[a-z0-9-]{1,96}$/.test(slug)) continue;
    const base = out.get(slug);
    if (base) {
      const sections = cleanSections((r as { sections?: unknown }).sections);
      // Sections replace the default list as a whole (merging by index would show another section's text under a new heading).
      out.set(slug, { ...mergeContent(base, r), slug, sections: sections.length ? sections : base.sections });
    } else {
      const g = r as Partial<Guide>;
      const sections = cleanSections(g.sections);
      if (g.title && sections.length) {
        out.set(slug, {
          slug,
          interest: g.interest || "hot-tub",
          kicker: g.kicker || "Guide",
          title: g.title,
          summary: g.summary || "",
          gives: g.gives ?? [],
          readMinutes: g.readMinutes || 5,
          intro: g.intro || "",
          sections,
          closing: { title: g.closing?.title || "Book a visit.", body: g.closing?.body || "", cta: g.closing?.cta || "Book a visit" },
          seo: g.seo,
        });
      }
    }
  }
  return [...out.values()];
});

export async function getGuide(slug: string): Promise<Guide | undefined> {
  return (await getGuides()).find((g) => g.slug === slug);
}
