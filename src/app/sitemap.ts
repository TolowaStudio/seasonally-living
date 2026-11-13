import type { MetadataRoute } from "next";
import { allPagesOf, getSiteUrl } from "@/lib/site";
import { getSettings } from "@/lib/sanity";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const paths = ["", ...new Set(allPagesOf(await getSettings()).map((p) => p.href))];
  return paths.map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p === "/hot-tubs" || p === "/fireplaces" ? 0.9 : 0.7,
  }));
}
