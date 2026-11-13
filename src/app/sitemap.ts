import type { MetadataRoute } from "next";
import { allPagesOf, getSiteUrl } from "@/lib/site";
import { getPreOwnedSpas, getSettings } from "@/lib/sanity";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [settings, spas] = await Promise.all([getSettings(), getPreOwnedSpas()]);
  // Pre-owned: the sell/trade-in page plus every spa on the floor (sold and in-shop spas are never listed).
  const paths = ["", ...new Set([...allPagesOf(settings).map((p) => p.href), "/pre-owned/sell", ...spas.map((s) => `/pre-owned/${s.slug}`)])];
  return paths.map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p === "/hot-tubs" || p === "/fireplaces" ? 0.9 : 0.7,
  }));
}
