import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import PreOwnedSellForm from "@/components/PreOwnedSellForm";
import RichTitle from "@/components/RichTitle";
import { IMG } from "@/content/pages";
import { SELL_FAQ, SELL_STEPS } from "@/content/pre-owned-sell";
import { getSettings } from "@/lib/sanity";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 60;

const TITLE = "Sell or Trade In Your Old Hot Tub in Wenatchee";
const DESC =
  "Have an old hot tub you want gone? Seasonally Living in Wenatchee looks at used hot tubs of any age, gives you a straight number, and hauls the old tub away. Sell it or trade toward a new or pre-owned spa.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/pre-owned/sell" },
};

export default async function SellPage() {
  const settings = await getSettings();
  const base = getSiteUrl();
  const area = settings.serviceArea.join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: SELL_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Pre-owned spas", item: `${base}/pre-owned` },
          { "@type": "ListItem", position: 2, name: "Sell or trade in your hot tub", item: `${base}/pre-owned/sell` },
        ],
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero
        kicker="Sell or trade in"
        title={<RichTitle t={{ before: "Old hot tub? ", emphasis: "We'll take it.", after: "" }} />}
        lead="Upgrading, moving, or just done with it? We look at used hot tubs of every age, give you a straight number, and haul the old one away."
        image={IMG.hotTubSnow}
        alt="A hot tub in a snowy forest"
      >
        <a href="#form" className="btn btn-primary btn-lg">Tell us about your tub <Icon name="arrow" size={18} /></a>
        <a href={`tel:${settings.phoneTel}`} className="btn btn-lg" style={{ background: "rgba(247,242,234,0.12)", color: "#fff", border: "1px solid rgba(247,242,234,0.32)" }}>
          <Icon name="phone" size={18} /> {settings.phoneDisplay}
        </a>
      </PageHero>

      <section className="section" id="how" style={{ scrollMarginTop: "var(--nav-h)" }}>
        <div className="wrap">
          <span className="kicker">How it works</span>
          <h2 className="h-xl" style={{ marginTop: 18 }}>From your backyard to our shop.</h2>
          <p className="lead" style={{ marginTop: 16, maxWidth: "56ch" }}>
            Every tub we take in goes through our own shop. It&apos;s checked, repaired and cleaned, and the good ones go up in the <Link href="/pre-owned" style={{ color: "var(--clay)" }}>pre-owned gallery</Link>, so we pay close attention to what you tell us.
          </p>
          <div className="steps4">
            {SELL_STEPS.map((s, i) => (
              <div key={s.title} className="season-card">
                <span className="index" style={{ fontSize: 40 }}>{String(i + 1).padStart(2, "0")}</span>
                <p className="h-md" style={{ marginTop: 14, fontSize: 22 }}>{s.title}</p>
                <p className="body-muted" style={{ marginTop: 8 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm bg-bone" id="form" style={{ scrollMarginTop: "var(--nav-h)" }}>
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <span className="kicker">Two minutes</span>
            <h2 className="h-xl" style={{ marginTop: 18 }}>Tell us about your tub.</h2>
            <p className="lead" style={{ marginTop: 16 }}>The more you tell us, the faster we can give you a real answer. Not sure of something? Say so, that&apos;s fine.</p>
            <ul className="list-check" style={{ marginTop: 26 }}>
              <li><Icon name="check" size={16} /> Sell it, or put it toward a new Cal Spas tub or a pre-owned spa</li>
              <li><Icon name="check" size={16} /> We haul the old one away</li>
              <li><Icon name="check" size={16} /> Straight answers on fix it vs. replace it</li>
              <li><Icon name="check" size={16} /> We serve {area} and the surrounding valley</li>
            </ul>
          </div>
          <div className="card" style={{ padding: "clamp(24px, 4vw, 40px)" }}>
            <PreOwnedSellForm />
          </div>
        </div>
      </section>

      <section className="section" id="faq" style={{ scrollMarginTop: "var(--nav-h)" }}>
        <div className="wrap" style={{ maxWidth: 860 }}>
          <span className="kicker">Questions</span>
          <h2 className="h-xl" style={{ marginTop: 18 }}>Selling or trading in a used hot tub.</h2>
          <div className="faq" style={{ marginTop: 36 }}>
            {SELL_FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Looking for a tub instead?"
        body="Browse what's on the floor right now, inspected and reconditioned by our own shop."
        cta="See pre-owned spas"
        href="/pre-owned#floor"
      />
    </main>
  );
}
