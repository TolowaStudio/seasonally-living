import type { MetadataRoute } from "next";
import { ALL_PAGES, getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const paths = ["", ...new Set(ALL_PAGES.map((p) => p.href))];
  return paths.map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p === "/fireplaces" ? 0.9 : 0.7,
  }));
}
