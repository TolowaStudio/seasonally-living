import LinePage, { lineMetadata } from "@/components/LinePage";

// Content: Sanity document "page-pre-owned" (fallback: src/content/pages.ts).
export const revalidate = 60;
export const generateMetadata = () => lineMetadata("/pre-owned");

export default function Page() {
  return <LinePage pageId="/pre-owned" />;
}
