import LinePage, { lineMetadata } from "@/components/LinePage";

// Content: Sanity document "page-outdoor-living" (fallback: src/content/pages.ts).
export const revalidate = 60;
export const generateMetadata = () => lineMetadata("/outdoor-living");

export default function Page() {
  return <LinePage pageId="/outdoor-living" />;
}
