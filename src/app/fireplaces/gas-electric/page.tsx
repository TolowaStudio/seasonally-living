import LinePage, { lineMetadata } from "@/components/LinePage";

// Content: Sanity document "page-fireplaces-gas-electric" (fallback: src/content/pages.ts).
export const revalidate = 60;
export const generateMetadata = () => lineMetadata("/fireplaces/gas-electric");

export default function Page() {
  return <LinePage pageId="/fireplaces/gas-electric" />;
}
