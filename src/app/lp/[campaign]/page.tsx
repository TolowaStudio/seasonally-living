import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import LeadForm from "@/components/LeadForm";
import { Logo } from "@/components/Nav";
import RichTitle from "@/components/RichTitle";
import { LANDING_SLUGS } from "@/content/landing";
import { addressOf, mapsUrlOf } from "@/lib/site";
import { getLanding, getSettings } from "@/lib/sanity";

// Content: code defaults in src/content/landing.ts, overridden by Sanity "landingPage-<slug>". ISR like the rest of the site.
export const revalidate = 60;
export const dynamicParams = false;
export const generateStaticParams = () => LANDING_SLUGS.map((campaign) => ({ campaign }));

type Params = { params: Promise<{ campaign: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = await getLanding((await params).campaign);
  if (!c) return {};
  return { title: c.seo.title, description: c.seo.description, robots: { index: false, follow: false } };
}

export default async function LandingPage({ params }: Params) {
  const { campaign } = await params;
  const [c, s] = await Promise.all([getLanding(campaign), getSettings()]);
  if (!c) notFound();
  const tel = `tel:${s.phoneTel}`;

  return (
    <main>
      {/* Minimal header: logo and phone only. No site nav, so the page has one job. */}
      <header style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 5 }} data-theme="showroom-dark">
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, paddingTop: 14, paddingBottom: 14 }}>
          <Logo id={s.logo} height={44} />
          <a href={tel} data-track-area="lp-header" className="btn btn-outline" style={{ padding: "10px 18px", color: "#fff", borderColor: "rgba(247,242,234,0.45)", background: "rgba(8,7,5,0.35)" }}>
            <Icon name="phone" size={16} /> {s.phoneDisplay}
          </a>
        </div>
      </header>

      <section data-theme="showroom-dark" style={{ position: "relative", minHeight: "min(82svh, 760px)", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <Image src={c.hero.image} alt={c.hero.alt} fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: c.hero.position ?? "center" }} />
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(100deg, rgba(8,7,5,0.88) 0%, rgba(8,7,5,0.55) 40%, rgba(8,7,5,0.12) 75%), linear-gradient(to bottom, rgba(8,7,5,0.5) 0%, rgba(8,7,5,0) 24%, rgba(8,7,5,0.75) 100%)",
          }}
        />
        <div className="wrap" style={{ position: "relative", width: "100%", paddingTop: 120, paddingBottom: "clamp(40px, 8vh, 80px)" }}>
          <span className="kicker" style={{ color: "var(--clay-soft)" }}>{c.hero.kicker}</span>
          <h1 className="display" style={{ color: "#fff", marginTop: 18, maxWidth: "17ch", textShadow: "0 2px 26px rgba(0,0,0,0.5)" }}>
            <RichTitle t={c.hero.title} />
          </h1>
          <p className="lead" style={{ marginTop: 20, color: "rgba(247,242,234,0.92)", maxWidth: "50ch" }}>{c.hero.lead}</p>
          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <a href="#book" data-track-area="lp-hero" className="btn btn-primary btn-lg">
              {c.hero.cta} <Icon name="arrow" size={18} />
            </a>
            <a href={tel} data-track-area="lp-hero" className="btn btn-lg" style={{ background: "rgba(247,242,234,0.12)", color: "#fff", border: "1px solid rgba(247,242,234,0.32)" }}>
              <Icon name="phone" size={18} /> Call {s.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="wrap">
          <h2 className="h-lg" style={{ maxWidth: "24ch" }}>{c.points.title}</h2>
          <div className="grid-3" style={{ marginTop: 36 }}>
            {c.points.items.map((p, i) => (
              <div key={p.title} className="season-card">
                <span className="index" style={{ fontSize: 36 }}>{String(i + 1).padStart(2, "0")}</span>
                <p className="h-md" style={{ marginTop: 12, fontSize: 21 }}>{p.title}</p>
                <p className="body-muted" style={{ marginTop: 8 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm bg-paper2">
        <div className="wrap split">
          <div className="photo" style={{ aspectRatio: "4 / 3" }}>
            <Image src={c.feature.image} alt={c.feature.alt} fill sizes="(max-width: 940px) 100vw, 50vw" />
          </div>
          <div>
            <span className="kicker">{c.feature.kicker}</span>
            <h2 className="h-lg" style={{ marginTop: 16 }}>{c.feature.title}</h2>
            <p className="body-muted" style={{ marginTop: 14 }}>{c.feature.body}</p>
            <ul className="list-check" style={{ marginTop: 22 }}>
              {c.feature.bullets.map((b) => (
                <li key={b}><Icon name="check" size={16} /> {b}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="book" className="section-sm" style={{ scrollMarginTop: 16 }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <span className="kicker">Seasonally Living · Wenatchee</span>
          <h2 className="h-lg" style={{ marginTop: 14 }}>{c.form.title}</h2>
          <p className="body-muted" style={{ marginTop: 10 }}>{c.form.lead}</p>
          <div className="card" style={{ padding: "clamp(20px, 4vw, 40px)", marginTop: 28 }}>
            <LeadForm defaultInterest={c.interest} />
          </div>
          <p className="small body-muted" style={{ marginTop: 18 }}>
            Prefer to talk? <a className="ul-link" data-track-area="lp-form" href={tel}>{s.phoneDisplay}</a>
          </p>
        </div>
      </section>

      <footer style={{ background: "var(--band)", padding: "28px 0 36px" }} data-theme="showroom-dark">
        <div className="wrap small" style={{ color: "var(--ink-soft)", display: "grid", gap: 6 }}>
          <p>
            Seasonally Living by Chim Chimney ·{" "}
            <a className="ul-link" data-track-area="lp-footer" href={mapsUrlOf(s)} target="_blank" rel="noopener noreferrer">{addressOf(s)}</a> ({s.address.note})
          </p>
          <p>{s.hours.map((h) => `${h.days}: ${h.time}`).join(" · ")}</p>
        </div>
      </footer>
    </main>
  );
}
