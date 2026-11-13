import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ThemeDock from "@/components/ThemeDock";
import SiteChrome from "@/components/SiteChrome";
import Tracking from "@/components/Tracking";
import JsonLd from "@/components/JsonLd";
import { getSiteUrl, site } from "@/lib/site";
import { getPage, getSettings } from "@/lib/sanity";
import { cloudinaryUrl, localBusinessJsonLd, ogImageMeta } from "@/lib/seo";
import type { HomeContent } from "@/content/types";

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
  // "./" resolves to each page's own path, so every route gets a self-canonical without query strings.
  alternates: { canonical: "./" },
  openGraph: { type: "website", siteName: site.name, locale: "en_US", images: [ogImageMeta("home", "Seasonally Living: hot tubs, swim spas, pools and Stûv fireplaces in Wenatchee")] },
  twitter: { card: "summary_large_image" },
  robots: process.env.NEXT_PUBLIC_NOINDEX === "1" ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#0e1316" };

// Applies a saved comp theme before paint so the page doesn't flash.
const themeBoot = `try{var p=new URLSearchParams(location.search).get('theme')||localStorage.getItem('sl-theme');if(p==='ember'||p==='alpine'||p==='linen')document.documentElement.dataset.theme=p}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Nav, footer and contact details come from the Sanity siteSettings document.
  const [settings, home] = await Promise.all([getSettings(), getPage<HomeContent>("/")]);
  return (
    <html lang="en" data-theme="alpine" className={`${archivo.variable} ${hanken.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        {/* Site-wide business entity: NAP, hours, geo, service area. Pages add breadcrumbs / FAQs. */}
        <JsonLd data={localBusinessJsonLd(settings, cloudinaryUrl(home.hero.image, "f_auto,q_auto,c_fill,w_1200,h_630"))} />
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
