import { createClient } from "@sanity/client";
import { ALL_PAGES } from "@/content/pages";
import { SETTINGS } from "@/content/settings";
import type { PageContent, SiteSettings } from "@/content/types";

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

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

/** Sanity wins wherever it has a real value; empty strings, nulls and empty arrays fall back to the default. */
export function mergeContent<T>(fallback: T, incoming: unknown): T {
  if (incoming === null || incoming === undefined || incoming === "") return fallback;
  if (Array.isArray(fallback)) return (Array.isArray(incoming) && incoming.length ? stripMeta(incoming) : fallback) as T;
  if (fallback && typeof fallback === "object") {
    if (typeof incoming !== "object" || Array.isArray(incoming)) return fallback;
    const out: Record<string, unknown> = { ...(fallback as Record<string, unknown>) };
    for (const [k, v] of Object.entries(incoming as Record<string, unknown>)) {
      if (k.startsWith("_") && k !== "_type") continue;
      out[k] = k in out ? mergeContent(out[k], v) : stripMeta(v);
    }
    return out as T;
  }
  return (typeof incoming === typeof fallback ? incoming : fallback) as T;
}

function stripMeta<T>(v: T): T {
  if (Array.isArray(v)) return v.map(stripMeta) as T;
  if (v && typeof v === "object") {
    return Object.fromEntries(Object.entries(v as Record<string, Json>).filter(([k]) => !k.startsWith("_") || k === "_type").map(([k, x]) => [k, stripMeta(x)])) as T;
  }
  return v;
}

async function fetchDoc(id: string): Promise<unknown> {
  try {
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000));
    const query = client.fetch(`*[_id == $id][0]`, { id }, { next: { revalidate: REVALIDATE_SECONDS, tags: [id] } });
    return await Promise.race([query, timeout]);
  } catch (err) {
    console.error("sanity: fetch failed for", id, err instanceof Error ? err.message : err);
    return null;
  }
}

export async function getPage<T extends PageContent>(pageId: string): Promise<T> {
  const fallback = ALL_PAGES.find((p) => p.pageId === pageId) as T | undefined;
  if (!fallback) throw new Error(`No default content for ${pageId}`);
  return mergeContent(fallback, await fetchDoc(pageDocId(pageId)));
}

export async function getSettings(): Promise<SiteSettings> {
  return mergeContent(SETTINGS, await fetchDoc("siteSettings"));
}
