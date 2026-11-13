import LinePage, { lineMetadata } from "@/components/LinePage";

// Content: Sanity document "page-builders" (fallback: src/content/pages.ts).
export const revalidate = 60;
export const generateMetadata = () => lineMetadata("/builders");

export default function Page() {
  return <LinePage pageId="/builders" />;
}
