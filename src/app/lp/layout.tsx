import type { Metadata } from "next";

// Campaign landing pages are for paid traffic only: never indexed, never in the sitemap.
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
