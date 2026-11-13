import LinePage, { lineMetadata } from "@/components/LinePage";
import PreOwnedGallery from "@/components/PreOwnedGallery";

// Content: Sanity document "page-pre-owned" (fallback: src/content/pages.ts) + preOwnedSpa documents.
export const revalidate = 60;
export const generateMetadata = () => lineMetadata("/pre-owned");

export default function Page() {
  return <LinePage pageId="/pre-owned" afterHero={<PreOwnedGallery />} />;
}
