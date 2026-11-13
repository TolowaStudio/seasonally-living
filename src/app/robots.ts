import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_NOINDEX === "1") return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${getSiteUrl()}/sitemap.xml` };
}
