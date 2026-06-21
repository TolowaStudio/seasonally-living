import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const staticPaths = [
  "",
  "/book",
  "/showroom",
  "/hot-tubs",
  "/fireplaces",
  "/outdoor-kitchens",
  "/contact",
] as const;

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  return staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : ("monthly" as const),
    priority: path === "" ? 1 : 0.85,
  }));
}
