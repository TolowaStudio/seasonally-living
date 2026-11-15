import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandPage from "@/components/BrandPage";
import Crumbs from "@/components/Crumbs";
import { getBrand, getBrands } from "@/lib/sanity";
import { SITE_TITLE_SUFFIX, socialMeta } from "@/lib/seo";

// One page per hearth brand. Content: Sanity "hearthBrand" documents (fallback: src/content/brands.ts).
// The static /fireplaces/gas-electric route takes precedence over this dynamic segment.
export const revalidate = 60;
// A brand added in the Studio after the build renders on first visit; unknown slugs 404 via notFound().
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getBrands()).map((b) => ({ brand: b.slug }));
}

/** Meta descriptions read best under ~160 characters; cut at a word boundary. */
const fit = (t: string, max = 158) => (t.length <= max ? t : `${t.slice(0, max - 1).replace(/\s+\S*$/, "")}…`);

type Props = { params: Promise<{ brand: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await getBrand((await params).brand);
  if (!b) return {};
  const title = `${b.name} ${b.categories.join(", ").toLowerCase()} in Wenatchee`;
  const description = fit(`${b.name} ${b.categories.join(", ").toLowerCase()} at the Seasonally Living showroom in Wenatchee. ${b.summary}`);
  return { title, description, ...socialMeta({ fullTitle: `${title} | ${SITE_TITLE_SUFFIX}`, description, path: `/fireplaces/${b.slug}`, ogKey: `brand-${b.slug}`, ogAlt: b.heroAlt }) };
}

export default async function Page({ params }: Props) {
  const { brand } = await params;
  const [b, all] = await Promise.all([getBrand(brand), getBrands()]);
  if (!b) notFound();
  return (
    <>
      <Crumbs path={`/fireplaces/${b.slug}`} leaf={b.name} />
      <BrandPage b={b} others={all.filter((x) => x.slug !== b.slug)} />
    </>
  );
}
