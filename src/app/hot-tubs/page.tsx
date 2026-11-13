import LinePage, { lineMetadata } from "@/components/LinePage";

// Content: Sanity document "page-hot-tubs" (fallback: src/content/pages.ts).
export const revalidate = 60;
export const generateMetadata = () => lineMetadata("/hot-tubs");

export default function Page() {
  return <LinePage pageId="/hot-tubs" />;
}
