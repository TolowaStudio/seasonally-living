import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ThemeDock from "@/components/ThemeDock";
import SiteChrome from "@/components/SiteChrome";
import Tracking from "@/components/Tracking";
import { getSiteUrl, site } from "@/lib/site";
import { getSettings } from "@/lib/sanity";

// Self-hosted (SIL OFL, licences in ./fonts) so builds never depend on fonts.googleapis.com.
// Latin-subset variable files from Google Fonts, fetched 2026-11-12.
const archivo = localFont({
  src: [
    { path: "./fonts/archivo-latin.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/archivo-italic-latin.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-archivo",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});
const hanken = localFont({
  src: [{ path: "./fonts/hanken-grotesk-latin.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-hanken",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Seasonally Living | Cal Spas Hot Tubs, Swim Spas & Stûv Fireplaces in Wenatchee",
    template: "%s | Seasonally Living, Wenatchee",
  },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
  robots: process.env.NEXT_PUBLIC_NOINDEX === "1" ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#0e1316" };

// Applies a saved comp theme before paint so the page doesn't flash.
const themeBoot = `try{var p=new URLSearchParams(location.search).get('theme')||localStorage.getItem('sl-theme');if(p==='ember'||p==='alpine'||p==='linen')document.documentElement.dataset.theme=p}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Nav, footer and contact details come from the Sanity siteSettings document.
  const settings = await getSettings();
  return (
    <html lang="en" data-theme="alpine" className={`${archivo.variable} ${hanken.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <a href="#main" className="btn btn-primary skip-link">Skip to content</a>
        <SiteChrome><Nav settings={settings} /></SiteChrome>
        <div id="main">{children}</div>
        <SiteChrome><Footer settings={settings} /></SiteChrome>
        <Tracking />
        <ThemeDock enabled={process.env.NEXT_PUBLIC_SHOW_COMPS === "1"} />
      </body>
    </html>
  );
}
