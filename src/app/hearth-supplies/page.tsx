import LinePage, { lineMetadata } from "@/components/LinePage";

// Content: Sanity document "page-hearth-supplies" (fallback: src/content/pages.ts).
export const revalidate = 60;
export const generateMetadata = () => lineMetadata("/hearth-supplies");

export default function Page() {
  return <LinePage pageId="/hearth-supplies" />;
}
