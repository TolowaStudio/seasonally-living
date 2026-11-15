import LinePage, { lineMetadata } from "@/components/LinePage";

// Content: Sanity document "page-pools" (fallback: src/content/pages.ts).
export const revalidate = 60;
export const generateMetadata = () => lineMetadata("/pools");

export default function Page() {
  return <LinePage pageId="/pools" />;
}
