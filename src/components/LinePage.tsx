import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";
import PageHero from "./PageHero";
import SectionHead from "./SectionHead";
import CtaBand from "./CtaBand";
import NoteForm from "./NoteForm";
import RelatedLines from "./RelatedLines";
import RichTitle from "./RichTitle";
import { getPage } from "@/lib/sanity";
import type { LineContent } from "@/content/types";

export async function lineMetadata(pageId: string): Promise<Metadata> {
  const c = await getPage<LineContent>(pageId);
  return { title: c.seo.title, description: c.seo.description };
}

/** Renders a product-line page from its Sanity document (falls back to src/content/pages.ts). */
export default async function LinePage({ pageId, afterHero }: { pageId: string; afterHero?: React.ReactNode }) {
  const { interest, hero, points, models, feature, magnet, closing, quickLinks } = await getPage<LineContent>(pageId);
  const book = `/visit?interest=${interest}#book`;
  return (
    <main>
      <PageHero kicker={hero.kicker} title={<RichTitle t={hero.title} />} lead={hero.lead} image={hero.image} alt={hero.alt} position={hero.position}>
        <Link href={book} className="btn btn-primary btn-lg">{hero.cta} <Icon name="arrow" size={18} /></Link>
        <a href="#more" className="btn btn-lg" style={{ background: "rgba(247,242,234,0.12)", color: "#fff", border: "1px solid rgba(247,242,234,0.32)" }}>
          Learn more
        </a>
      </PageHero>

      {afterHero}

      <section className="section" id="more" style={{ scrollMarginTop: "var(--nav-h)" }}>
        <div className="wrap">
          <SectionHead kicker={points.kicker} title={points.title} lead={points.lead} />
          <div className="grid-3" style={{ marginTop: 52 }}>
            {points.items.map((p, i) => (
              <div key={p.title} className="season-card">
                <span className="index" style={{ fontSize: 40 }}>{String(i + 1).padStart(2, "0")}</span>
                <p className="h-md" style={{ marginTop: 14, fontSize: 22 }}>{p.title}</p>
                <p className="body-muted" style={{ marginTop: 8 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {models && models.items?.some((m) => m.name) && (
        <section className="section-sm" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <SectionHead kicker={models.kicker} title={models.title} lead={models.lead} />
            <div className={models.items.length === 2 ? "grid-2" : "grid-3"} style={{ marginTop: 40 }}>
              {models.items.filter((m) => m.name).map((m) => (
                <div key={m.name} className="card" style={{ padding: 30 }}>
                  {m.tag && <span className="eyebrow">{m.tag}</span>}
                  <h3 className="h-md" style={{ marginTop: m.tag ? 10 : 0 }}>{m.name}</h3>
                  <p className="body-muted" style={{ marginTop: 10 }}>{m.body}</p>
                  {m.bullets && m.bullets.length > 0 && (
                    <ul className="list-check" style={{ marginTop: 18 }}>
                      {m.bullets.map((b) => (
                        <li key={b}><Icon name="check" size={16} /> {b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section bg-paper2">
        <div className="wrap split">
          <div className="photo" style={{ aspectRatio: "4 / 5" }}>
            <Image src={feature.image} alt={feature.alt} fill sizes="(max-width: 940px) 100vw, 50vw" />
          </div>
          <div>
            <span className="kicker">{feature.kicker}</span>
            <h2 className="h-xl" style={{ marginTop: 18 }}>{feature.title}</h2>
            <p className="lead" style={{ marginTop: 18 }}>{feature.body}</p>
            <ul className="list-check" style={{ marginTop: 24 }}>
              {feature.bullets.map((b) => (
                <li key={b}><Icon name="check" size={16} /> {b}</li>
              ))}
            </ul>
            <Link href={book} className="btn btn-primary" style={{ marginTop: 30 }}>{hero.cta} <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
      </section>

      {quickLinks && quickLinks.some((q) => q.href && q.label) && (
        <section className="section-sm">
          <div className="wrap" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {quickLinks.filter((q) => q.href && q.label).map((q) => (
              <Link key={q.href} href={q.href} className="btn btn-outline">{q.label}</Link>
            ))}
          </div>
        </section>
      )}

      {magnet?.title && (
        <section className="section-sm bg-bone">
          <div className="wrap split" style={{ alignItems: "start" }}>
            <div>
              <span className="kicker">Not ready yet?</span>
              <h2 className="h-lg" style={{ marginTop: 16 }}>{magnet.title}</h2>
              <p className="body-muted" style={{ marginTop: 12, maxWidth: "44ch" }}>{magnet.body}</p>
            </div>
            <NoteForm defaultInterest={interest} />
          </div>
        </section>
      )}

      <RelatedLines current={pageId} />

      <CtaBand title={closing.title} body={closing.body} cta={closing.cta} href={book} />
    </main>
  );
}
