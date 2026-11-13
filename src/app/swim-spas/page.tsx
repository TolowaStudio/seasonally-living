import LinePage, { lineMetadata } from "@/components/LinePage";

// Content: Sanity document "page-swim-spas" (fallback: src/content/pages.ts).
export const revalidate = 60;
export const generateMetadata = () => lineMetadata("/swim-spas");

export default function Page() {
  return <LinePage pageId="/swim-spas" />;
}
