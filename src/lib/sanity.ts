import { cache } from "react";
import { createClient } from "@sanity/client";
import { ALL_PAGES } from "@/content/pages";
import { SETTINGS } from "@/content/settings";
import { DEMO_PRE_OWNED } from "@/content/pre-owned";
import { BRANDS } from "@/content/brands";
import { GUIDES, type Guide } from "@/content/guides";
import type { BrandContent, PageContent, PreOwnedSpa, SiteSettings } from "@/content/types";
import { mergeContent, stripMeta } from "./merge";
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
const SPA_FIELDS = `_id, title, "slug": slug.current, status, brand, model, year, seats, size, electrical, highlights, condition, photos[]{image, alt}, featured, sortOrder`;

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

export async function getPreOwnedSpas(): Promise<PreOwnedSpa[]> {
  const rows = await fetchQuery<PreOwnedSpa[]>(
    "preOwnedSpa",
    `*[_type == "preOwnedSpa" && defined(slug.current) && status != "sold"] | order(featured desc, sortOrder asc, _createdAt desc){${SPA_FIELDS}}`,
    {},
  );
  if (rows && rows.length) return rows;
  return demo() ? DEMO_PRE_OWNED.filter((s) => s.status !== "sold") : [];
}

export async function getPreOwnedSpa(slug: string): Promise<PreOwnedSpa | null> {
  const row = await fetchQuery<PreOwnedSpa | null>("preOwnedSpa", `*[_type == "preOwnedSpa" && slug.current == $slug][0]{${SPA_FIELDS}}`, { slug });
  if (row) return row;
  return demo() ? (DEMO_PRE_OWNED.find((s) => s.slug === slug) ?? null) : null;
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

// ---- Lead-magnet guides (/guides/[slug]) ----
// Code defaults in src/content/guides.ts. A Sanity "guide" document with the same slug overrides the
// matching default field by field; a guide with a new slug is added if it has a title and sections.
const GUIDE_FIELDS = `"slug": slug.current, title, interest, kicker, summary, gives, readMinutes, intro,
  sections[]{heading, body, bullets}, closing{title, body, cta}, seo{title, description}`;

export const getGuides = cache(async (): Promise<Guide[]> => {
  const rows = await fetchQuery<unknown[]>("guide", `*[_type == "guide" && defined(slug.current)]{${GUIDE_FIELDS}}`, {});
  const out = new Map<string, Guide>(GUIDES.map((g) => [g.slug, g]));
  for (const r of rows ?? []) {
    const slug = r && typeof r === "object" ? (r as { slug?: unknown }).slug : undefined;
    if (typeof slug !== "string" || !/^[a-z0-9-]{1,96}$/.test(slug)) continue;
    const base = out.get(slug);
    if (base) {
      out.set(slug, { ...mergeContent(base, r), slug });
    } else {
      const g = r as Partial<Guide>;
      if (g.title && g.sections?.length) {
        out.set(slug, {
          slug,
          interest: g.interest || "hot-tub",
          kicker: g.kicker || "Guide",
          title: g.title,
          summary: g.summary || "",
          gives: g.gives ?? [],
          readMinutes: g.readMinutes || 5,
          intro: g.intro || "",
          sections: stripMeta(g.sections),
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
