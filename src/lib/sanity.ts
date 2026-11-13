import { cache } from "react";
import { createClient } from "@sanity/client";
import { ALL_PAGES } from "@/content/pages";
import { SETTINGS } from "@/content/settings";
import type { PageContent, SiteSettings } from "@/content/types";
import { mergeContent } from "./merge";

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
