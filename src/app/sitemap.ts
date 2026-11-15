import type { MetadataRoute } from "next";
import { AREAS } from "@/content/areas";
import { allPagesOf, getSiteUrl } from "@/lib/site";
import { getBrands, getGuides, getPreOwnedSpas, getSettings } from "@/lib/sanity";
import { getPosts } from "@/lib/journal";

export const revalidate = 3600;

// Everything public and indexable: the home page, every nav page, every hearth brand, each pre-owned spa on
// the floor and the service-area pages. /review, /review/card and /api are deliberately absent (noindex).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [settings, brands, spas, guides, posts] = await Promise.all([getSettings(), getBrands(), getPreOwnedSpas(), getGuides(), getPosts()]);
  // Pre-owned: the sell/trade-in page plus every spa on the floor (sold and in-shop spas are never listed). Guides: the index and each landing page (never /read).
  // /journal is listed even when the Sanity nav has no Journal link yet.
  const paths = [
    ...new Set([
      "",
      ...allPagesOf(settings).map((p) => p.href),
      ...brands.map((b) => `/fireplaces/${b.slug}`),
      "/pre-owned/sell",
      ...spas.map((s) => `/pre-owned/${s.slug}`),
      "/guides",
      ...guides.map((g) => `/guides/${g.slug}`),
      "/areas",
      ...AREAS.map((a) => `/areas/${a.slug}`),
      "/journal",
    ]),
  ];
  const pages: MetadataRoute.Sitemap = paths.map((p) => ({
    url: `${base}${p}`,
    changeFrequency: p.startsWith("/pre-owned/") ? "weekly" : "monthly",
    priority: p === "" ? 1 : p === "/hot-tubs" || p === "/fireplaces" ? 0.9 : p.startsWith("/areas") ? 0.6 : 0.7,
  }));
  const journal: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/journal/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishAt,
    changeFrequency: "yearly",
    priority: 0.6,
  }));
  return [...pages, ...journal];
}
