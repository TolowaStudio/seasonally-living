import localFont from "next/font/local";

// Called only from src/app/page.tsx: Next.js preloads a font only on the
// routes that invoke its loader, so keeping this out of layout.tsx keeps the
// preload off every page except home (TOL-3376).
export const archivoItalic = localFont({
  src: "./archivo-italic-latin.woff2",
  weight: "300 700",
  style: "italic",
  variable: "--font-archivo-italic",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});
