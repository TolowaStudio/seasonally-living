import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandPage from "@/components/BrandPage";
import { getBrand, getBrands } from "@/lib/sanity";

// One page per hearth brand. Content: Sanity "hearthBrand" documents (fallback: src/content/brands.ts).
// The static /fireplaces/gas-electric route takes precedence over this dynamic segment.
export const revalidate = 60;
// A brand added in the Studio after the build renders on first visit; unknown slugs 404 via notFound().
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getBrands()).map((b) => ({ brand: b.slug }));
}

type Props = { params: Promise<{ brand: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await getBrand((await params).brand);
  if (!b) return {};
  return {
    title: `${b.name} ${b.categories.join(", ").toLowerCase()} in Wenatchee`,
    description: `${b.name} ${b.categories.join(", ").toLowerCase()} at the Seasonally Living showroom in Wenatchee. ${b.summary}`.slice(0, 300),
  };
}

export default async function Page({ params }: Props) {
  const { brand } = await params;
  const [b, all] = await Promise.all([getBrand(brand), getBrands()]);
  if (!b) notFound();
  return <BrandPage b={b} others={all.filter((x) => x.slug !== b.slug)} />;
}
