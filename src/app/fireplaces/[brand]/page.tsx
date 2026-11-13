import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandPage from "@/components/BrandPage";
import { BRANDS, getBrand } from "@/content/brands";

// One page per hearth brand. Content: src/content/brands.ts (code, not yet in Sanity).
// The static /fireplaces/gas-electric route takes precedence over this dynamic segment.
export const dynamicParams = false;

export function generateStaticParams() {
  return BRANDS.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }): Promise<Metadata> {
  const b = getBrand((await params).brand);
  if (!b) return {};
  return {
    title: `${b.name} ${b.categories.join(", ").toLowerCase()} in Wenatchee`,
    description: `${b.name} ${b.categories.join(", ").toLowerCase()} at the Seasonally Living showroom in Wenatchee. ${b.summary}`.slice(0, 300),
  };
}

export default async function Page({ params }: { params: Promise<{ brand: string }> }) {
  const b = getBrand((await params).brand);
  if (!b) notFound();
  return <BrandPage b={b} />;
}
