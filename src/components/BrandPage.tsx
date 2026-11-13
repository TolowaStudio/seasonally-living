import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";
import PageHero from "./PageHero";
import RichTitle from "./RichTitle";
import SectionHead from "./SectionHead";
import CtaBand from "./CtaBand";
import Reveal from "./RevealWrapper";
import { BRANDS } from "@/content/brands";
import type { BrandContent, BrandModel } from "@/content/types";

const book = "/visit?interest=hearth#book";

function ModelCard({ m, brand }: { m: BrandModel; brand: string }) {
  return (
    <article className="card brand-model">
      {m.image && (
        <div className="brand-model-photo">
          <Image src={m.image} alt={m.alt ?? `${brand} ${m.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 940px) 50vw, 33vw" />
          {m.inShowroom && <span className="po-badge">In our showroom</span>}
        </div>
      )}
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {m.type && <span className="eyebrow">{m.type}</span>}
        <h3 className="h-md" style={{ fontSize: 22 }}>{m.name}</h3>
        <p className="body-muted small">{m.description}</p>
        {m.facts.length > 0 && (
          <ul className="list-check small" style={{ marginTop: 4 }}>
            {m.facts.map((f) => (
              <li key={f}><Icon name="check" size={14} /> {f}</li>
            ))}
          </ul>
        )}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: "auto", paddingTop: 10 }}>
          <Link href={book} className="small ul-link" style={{ color: "var(--clay)", fontWeight: 600 }}>
            Ask about the {m.name} <Icon name="arrow" size={14} />
          </Link>
          {m.url && (
            <a href={m.url} target="_blank" rel="noopener noreferrer" className="small ul-link body-muted">
              Specs on the maker&apos;s site ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function BrandPage({ b }: { b: BrandContent }) {
  const others = BRANDS.filter((x) => x.slug !== b.slug);
  return (
    <main>
      <PageHero kicker={`Fireplaces & stoves · ${b.name} · ${b.origin}`} title={<RichTitle t={b.tagline} />} lead={b.summary} image={b.heroImage} alt={b.heroAlt} position={b.heroPosition}>
        <Link href={book} className="btn btn-primary btn-lg">See {b.name} in the showroom <Icon name="arrow" size={18} /></Link>
        <Link href="#range" className="btn btn-lg" style={{ background: "rgba(247,242,234,0.12)", color: "#fff", border: "1px solid rgba(247,242,234,0.32)" }}>The {b.name} range</Link>
      </PageHero>

      <section className="section-sm">
        <div className="wrap">
          <div className="grid-3">
            {b.points.map((p, i) => (
              <Reveal key={p.title} delay={i * 80} className="season-card">
                <p className="h-md" style={{ fontSize: 21 }}>{p.title}</p>
                <p className="small body-muted" style={{ marginTop: 8 }}>{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div id="range" />
      {b.sections.map((s, si) => (
        <section key={s.name} className={`section${si % 2 === 0 ? " bg-paper2" : ""}`}>
          <div className="wrap">
            <SectionHead kicker={b.name} title={s.name} lead={s.summary} />
            <div className="brand-grid" style={{ marginTop: 44 }}>
              {s.models.map((m) => (
                <ModelCard key={m.name} m={m} brand={b.name} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section-sm">
        <div className="wrap">
          <p className="tiny body-muted">{b.sourceNote} Availability varies; ask us what&apos;s on the floor and what can be ordered.</p>
          <span className="kicker" style={{ display: "block", marginTop: 40 }}>More lines we carry</span>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
            <Link href="/fireplaces" className="btn btn-outline">All fireplaces & stoves</Link>
            {others.map((o) => (
              <Link key={o.slug} href={`/fireplaces/${o.slug}`} className="btn btn-outline">{o.name}</Link>
            ))}
            <Link href="/service" className="btn btn-outline">Venting service</Link>
          </div>
        </div>
      </section>

      <CtaBand title={`Come see ${b.name} in person.`} body="Book a fireplace consult and we'll have the right models ready. Bring a photo of the room and we'll talk heat, venting and fit." cta="Book a fireplace consult" href={book} />
    </main>
  );
}
