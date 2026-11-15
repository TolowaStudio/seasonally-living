import type { Metadata } from "next";
import QrCode from "@/components/QrCode";
import PrintButton from "@/components/PrintButton";
import { getSettings } from "@/lib/sanity";
import { getSiteUrl } from "@/lib/site";

// Print-ready QR cards for checkout and delivery. Staff page: noindex, not in the sitemap or nav.
export const revalidate = 60;
export const metadata: Metadata = {
  title: "Review cards (print)",
  description: "Print-ready QR review cards for Seasonally Living checkout and delivery.",
  robots: { index: false, follow: false },
};

const LOGO = "https://res.cloudinary.com/tolowa-studio/image/upload/e_trim/f_auto,q_auto,h_260";

function Card({ url, shown, logo, name, phone }: { url: string; shown: string; logo: string; name: string; phone: string }) {
  return (
    <div className="rc-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="rc-logo" src={`${LOGO}/${logo}`} alt={name} />
      <p className="rc-title">Thank you.</p>
      <p className="rc-sub">If you have a minute, a Google review really helps our family shop.</p>
      <QrCode className="rc-qr" value={url} label={`QR code that opens ${shown}`} />
      <p className="rc-scan">Scan with your phone&rsquo;s camera</p>
      <p className="rc-url">{shown}</p>
      <p className="rc-foot">Cam &amp; Susan McNeill · {phone}</p>
    </div>
  );
}

export default async function ReviewCardPage() {
  const s = await getSettings();
  // The card encodes our own /review page, not the Google link, so the Google link can change without reprinting.
  const base = getSiteUrl();
  const url = `${base}/review`;
  const shown = url.replace(/^https?:\/\//, "");
  return (
    <main className="rc-page" style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section-sm rc-screen">
        <div className="wrap">
          <span className="kicker">Staff</span>
          <h1 className="h-lg" style={{ marginTop: 16 }}>Review cards</h1>
          <p className="body-muted" style={{ marginTop: 12, maxWidth: "62ch" }}>
            Four cards per letter sheet. Print at 100% (no &ldquo;fit to page&rdquo;), cut on the guide lines, and hand one to every buyer at checkout and
            delivery, the same way for everyone. Each QR opens <strong>{shown}</strong>.
          </p>
          <ul className="small body-muted" style={{ marginTop: 12, maxWidth: "62ch", paddingLeft: 18 }}>
            <li>Don&rsquo;t print until that address is live: seasonallyliving.com still serves the old site, so the QR would land on a missing page.</li>
            <li>On a preview or staging host, the QR points at the preview address. Open this page from the live domain to print.</li>
          </ul>
          <div style={{ marginTop: 20 }}><PrintButton /></div>
        </div>
      </section>
      <section className="rc-sheet" aria-label="Four review cards, ready to print">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} url={url} shown={shown} logo={s.logo} name={s.legalName} phone={s.phoneDisplay} />
        ))}
      </section>
    </main>
  );
}
