import LinePage, { lineMetadata } from "@/components/LinePage";

// Content: Sanity document "page-saunas" (fallback: src/content/pages.ts).
export const revalidate = 60;
export const generateMetadata = () => lineMetadata("/saunas");

export default function Page() {
  return <LinePage pageId="/saunas" />;
}
