import JsonLd from "./JsonLd";
import { allPagesOf } from "@/lib/site";
import { getSettings } from "@/lib/sanity";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";

/**
 * BreadcrumbList JSON-LD for a page path: Home > (parent) > page. Names come from the nav labels in siteSettings,
 * so they match what visitors see. Pass `leaf` to name a page that isn't in the nav (a brand, a pre-owned spa).
 * Pages under /fireplaces nest beneath the Fireplaces hub.
 */
export default async function Crumbs({ path, leaf }: { path: string; leaf?: string }) {
  const pages = allPagesOf(await getSettings());
  const nameOf = (href: string) => pages.find((p) => p.href === href)?.label;
  const trail: Crumb[] = [];
  const parent = path.startsWith("/fireplaces/") ? "/fireplaces" : path.startsWith("/pre-owned/") ? "/pre-owned" : null;
  if (parent) trail.push({ name: nameOf(parent) ?? "Fireplaces & stoves", path: parent });
  trail.push({ name: leaf ?? nameOf(path) ?? path.split("/").pop()!.replace(/-/g, " "), path });
  return <JsonLd data={breadcrumbJsonLd(trail)} />;
}
