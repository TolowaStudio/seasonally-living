import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import Reveal from "@/components/RevealWrapper";
import SectionHead from "@/components/SectionHead";
import CtaBand from "@/components/CtaBand";
import RichTitle from "@/components/RichTitle";
import { getPage, getSettings } from "@/lib/sanity";
import { addressOf, getSiteUrl } from "@/lib/site";
import type { HomeContent } from "@/content/types";

// Content: Sanity documents "page-home" + "siteSettings" (fallback: src/content).
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPage<HomeContent>("/");
  return { title: { absolute: c.seo.title }, description: c.seo.description };
}

export default async function Home() {
  const [c, s] = await Promise.all([getPage<HomeContent>("/"), getSettings()]);
  const url = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "Store"],
    "@id": `${url}/#business`,
    name: s.legalName,
    url,
    telephone: s.phoneTel,
    email: s.email,
    address: { "@type": "PostalAddress", streetAddress: s.address.line1, addressLocality: s.address.city, addressRegion: s.address.state, postalCode: s.address.zip, addressCountry: "US" },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "16:00" }],
    areaServed: s.serviceArea.map((city) => ({ "@type": "City", name: city })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO: Cal Spas leads */}
      <section style={{ position: "relative", height: "100vh", minHeight: 660, overflow: "hidden" }}>
        <Image src={c.hero.image} alt={c.hero.alt} fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: c.hero.position || "center" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(8,7,5,0.9) 0%, rgba(8,7,5,0.6) 28%, rgba(8,7,5,0.12) 56%, rgba(8,7,5,0) 72%), linear-gradient(to bottom, rgba(10,8,5,0.55) 0%, rgba(10,8,5,0.04) 24%, rgba(10,8,5,0.2) 55%, rgba(10,8,5,0.9) 100%)" }} />
        <span className="figure-cap caption hero-credit" style={{ right: "max(32px, calc((100vw - var(--maxw)) / 2 + 32px))", bottom: 40, fontSize: 10.5 }}>
          <span className="dot" /> {c.hero.caption}
        </span>
        <div className="wrap" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "clamp(52px, 9vh, 100px)" }}>
          <p className="credential" style={{ marginBottom: 26, color: "rgba(247,242,234,0.75)" }}>
            <span className="dot" style={{ background: "var(--clay-soft)" }} /> {c.hero.credential}
          </p>
          <h1 className="display" style={{ color: "#fff", maxWidth: "14ch", textShadow: "0 2px 26px rgba(0,0,0,0.55)" }}>
            <RichTitle t={c.hero.title} />
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "48ch", color: "rgba(247,242,234,0.9)", textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}>
            {c.hero.lead}
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 34, flexWrap: "wrap" }}>
            <Link href="/visit#book" className="btn btn-primary btn-lg">{c.hero.cta} <Icon name="arrow" size={18} /></Link>
            <Link href={c.hero.secondaryHref} className="btn btn-lg" style={{ background: "rgba(247,242,234,0.12)", color: "#fff", border: "1px solid rgba(247,242,234,0.32)", backdropFilter: "blur(10px)" }}>
              {c.hero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      {/* THE LINES (water first) */}
      <section className="section">
        <div className="wrap">
          <SectionHead kicker={c.lines.kicker} title={c.lines.title} lead={c.lines.lead} />
          <div className="line-grid" style={{ marginTop: 56 }}>
            {c.lines.items.map((l, i) => (
              <Reveal key={l.href} delay={(i % 3) * 80}>
                <Link href={l.href} className="card hoverable" style={{ display: "block", height: "100%" }}>
                  <div className="photo" style={{ aspectRatio: "16 / 10", borderRadius: 0 }}>
                    <Image src={l.image} alt={l.title} fill sizes="(max-width: 620px) 100vw, (max-width: 940px) 50vw, 33vw" />
                  </div>
                  <div style={{ padding: 24 }}>
                    <span className="eyebrow">{l.kicker}</span>
                    <h3 className="h-md" style={{ marginTop: 10 }}>{l.title}</h3>
                    <p className="body-muted" style={{ marginTop: 10 }}>{l.body}</p>
                    <span className="btn-ghost" style={{ display: "inline-flex", gap: 8, alignItems: "center", marginTop: 16, fontWeight: 600, color: "var(--clay)" }}>
                      Explore <Icon name="arrow" size={16} className="arrow" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STÛV: fire leads with Stûv */}
      <section className="section bg-paper2">
        <div className="wrap split">
          <Reveal>
            <span className="kicker">{c.stuv.kicker}</span>
            <h2 className="h-xl" style={{ marginTop: 18 }}>{c.stuv.title}</h2>
            <p className="lead" style={{ marginTop: 18 }}>{c.stuv.body}</p>
            <div className="grid-3" style={{ marginTop: 36, gap: 18 }}>
              {c.stuv.models.map((m) => (
                <div key={m.name} style={{ borderTop: "1px solid var(--line-strong)", paddingTop: 14 }}>
                  <p className="model-tag h-md">{m.name}</p>
                  <p className="small body-muted" style={{ marginTop: 6 }}>{m.body}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 36, flexWrap: "wrap" }}>
              <Link href="/fireplaces/stuv" className="btn btn-primary">{c.stuv.cta} <Icon name="arrow" size={16} /></Link>
              <Link href="/service" className="btn btn-outline">{c.stuv.secondaryCta}</Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="photo" style={{ aspectRatio: "4 / 5" }}>
              <Image src={c.stuv.image} alt={c.stuv.alt} fill sizes="(max-width: 940px) 100vw, 50vw" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* VENTING */}
      <section className="section-sm">
        <div className="wrap grid-4" style={{ alignItems: "start" }}>
          <div style={{ gridColumn: "span 2" }}>
            <span className="kicker">{c.venting.kicker}</span>
            <h2 className="h-lg" style={{ marginTop: 16, maxWidth: "20ch" }}>{c.venting.title}</h2>
            <p className="body-muted" style={{ marginTop: 14, maxWidth: "48ch" }}>{c.venting.body}</p>
            <Link href="/service" className="btn btn-ghost" style={{ marginTop: 18, color: "var(--clay)" }}>
              {c.venting.cta} <Icon name="arrow" size={16} className="arrow" />
            </Link>
          </div>
          {c.venting.cards.map((card) => (
            <div key={card.title} className="season-card">
              <Icon name={card.icon} size={22} style={{ color: "var(--clay)" }} />
              <p className="h-md" style={{ fontSize: 20, marginTop: 14 }}>{card.title}</p>
              <p className="small body-muted" style={{ marginTop: 8 }}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOUR SEASONS */}
      <section className="section bg-ink">
        <div className="wrap">
          <SectionHead kicker={c.seasons.kicker} title={c.seasons.title} />
          <div className="grid-4" style={{ marginTop: 48 }}>
            {c.seasons.items.map((season, i) => (
              <Reveal key={season.name} delay={i * 80} className="season-card">
                {season.image && (
                  <div className="photo" style={{ aspectRatio: "4 / 5", marginBottom: 22 }}>
                    <Image src={season.image} alt={season.alt ?? ""} fill sizes="(max-width: 940px) 50vw, 25vw" />
                  </div>
                )}
                <span className="index">{String(i + 1).padStart(2, "0")}</span>
                <p className="h-md" style={{ marginTop: 18 }}>{season.name}</p>
                <p style={{ marginTop: 8, fontWeight: 600 }}>{season.lead}</p>
                <p className="small body-muted" style={{ marginTop: 8 }}>{season.note}</p>
              </Reveal>
            ))}
          </div>
          {c.seasons.credit && <p className="tiny body-muted" style={{ marginTop: 20 }}>{c.seasons.credit}</p>}
        </div>
      </section>

      {/* SHOWROOM */}
      <section className="section">
        <div className="wrap split">
          <div className="photo" style={{ aspectRatio: "5 / 4" }}>
            <Image src={c.showroom.image} alt={c.showroom.alt} fill sizes="(max-width: 940px) 100vw, 50vw" />
          </div>
          <div>
            <span className="kicker">{c.showroom.kicker}</span>
            <h2 className="h-xl" style={{ marginTop: 18 }}>{c.showroom.title}</h2>
            <p className="lead" style={{ marginTop: 18 }}>{c.showroom.body}</p>
            <ul className="list-check" style={{ marginTop: 26 }}>
              <li><Icon name="pin" size={16} /> {addressOf(s)} ({s.address.note})</li>
              {s.hours.map((h) => (
                <li key={h.days}><Icon name="clock" size={16} /> {h.days}: {h.time}</li>
              ))}
              <li><Icon name="phone" size={16} /> {s.phoneDisplay}</li>
            </ul>
            <Link href="/visit#book" className="btn btn-primary btn-lg" style={{ marginTop: 30 }}>{c.showroom.cta} <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>

      <CtaBand title="Come sit in the water. Or by the fire." />
    </main>
  );
}
