"use client";

import { usePathname } from "next/navigation";

/** Hides the site nav and footer on campaign landing pages (/lp/*), which bring their own minimal header. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return pathname?.startsWith("/lp/") ? null : <>{children}</>;
}
