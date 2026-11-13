import type { Metadata } from "next";
import "./comps.css";

// Design comps for review (TOL-3347). Never indexed, never in the sitemap.
export const metadata: Metadata = {
  title: { absolute: "Design comps | Seasonally Living" },
  robots: { index: false, follow: false, nocache: true },
};

export default function CompsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
