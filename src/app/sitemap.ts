import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return ["", "/fireplaces", "/service", "/hot-tubs", "/swim-spas", "/pools", "/visit", "/note"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p === "/fireplaces" ? 0.9 : 0.7,
  }));
}
