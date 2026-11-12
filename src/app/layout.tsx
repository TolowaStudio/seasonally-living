import type { Metadata, Viewport } from "next";
import { Archivo, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ThemeDock from "@/components/ThemeDock";
import { getSiteUrl, site } from "@/lib/site";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", weight: ["300", "400", "500", "600", "700"], style: ["normal", "italic"] });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Seasonally Living | Stûv Fireplaces, Hot Tubs & Swim Spas in Wenatchee",
    template: "%s | Seasonally Living, Wenatchee",
  },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
  robots: process.env.NEXT_PUBLIC_NOINDEX === "1" ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#121110" };

// Applies a saved comp theme before paint so the page doesn't flash.
const themeBoot = `try{var p=new URLSearchParams(location.search).get('theme')||localStorage.getItem('sl-theme');if(p==='ember'||p==='alpine'||p==='linen')document.documentElement.dataset.theme=p}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="ember" className={`${archivo.variable} ${hanken.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <a href="#main" className="btn btn-primary" style={{ position: "absolute", left: -9999 }}>Skip to content</a>
        <Nav />
        <div id="main">{children}</div>
        <Footer />
        <ThemeDock enabled={process.env.NEXT_PUBLIC_SHOW_COMPS === "1"} />
      </body>
    </html>
  );
}
