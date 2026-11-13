import type { MetadataRoute } from "next";
import { allPagesOf, getSiteUrl } from "@/lib/site";
import { getPreOwnedSpas, getSettings } from "@/lib/sanity";
import { getPosts } from "@/lib/journal";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [settings, spas, posts] = await Promise.all([getSettings(), getPreOwnedSpas(), getPosts()]);
  // Pre-owned: the sell/trade-in page plus every spa on the floor (sold and in-shop spas are never listed).
  // /journal is listed even when the Sanity nav has no Journal link yet.
  const paths = ["", ...new Set([...allPagesOf(settings).map((p) => p.href), "/pre-owned/sell", "/journal", ...spas.map((s) => `/pre-owned/${s.slug}`)])];
  const pages: MetadataRoute.Sitemap = paths.map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p === "/hot-tubs" || p === "/fireplaces" ? 0.9 : 0.7,
  }));
  const journal: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/journal/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishAt,
    changeFrequency: "yearly",
    priority: 0.6,
  }));
  return [...pages, ...journal];
}
