import LinePage, { lineMetadata } from "@/components/LinePage";

// Content: Sanity document "page-spa-care" (fallback: src/content/pages.ts).
export const revalidate = 60;
export const generateMetadata = () => lineMetadata("/spa-care");

export default function Page() {
  return <LinePage pageId="/spa-care" />;
}
