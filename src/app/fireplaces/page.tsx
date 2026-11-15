import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import Reveal from "@/components/RevealWrapper";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import CtaBand from "@/components/CtaBand";
import NoteForm from "@/components/NoteForm";
import RelatedLines from "@/components/RelatedLines";
import RichTitle from "@/components/RichTitle";
import Crumbs from "@/components/Crumbs";
import { getBrands, getPage } from "@/lib/sanity";
import { SITE_TITLE_SUFFIX, socialMeta } from "@/lib/seo";
import type { BrandContent, FireplacesContent } from "@/content/types";

const brandHref = (brands: BrandContent[], name: string) => {
  const b = brands.find((x) => x.name === name);
  return b ? `/fireplaces/${b.slug}` : undefined;
};

const COUNT = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];

// Content: Sanity document "page-fireplaces" (fallback: src/content/pages.ts).
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPage<FireplacesContent>("/fireplaces");
  return { title: c.seo.title, description: c.seo.description, ...socialMeta({ fullTitle: `${c.seo.title} | ${SITE_TITLE_SUFFIX}`, description: c.seo.description, path: "/fireplaces", ogKey: "fireplaces", ogAlt: c.hero.alt }) };
}

export default async function FireplacesPage() {
  const [c, brands] = await Promise.all([getPage<FireplacesContent>("/fireplaces"), getBrands()]);
  const book = "/visit?interest=hearth#book";
  return (
    <main>
      <Crumbs path="/fireplaces" />
      <PageHero kicker={c.hero.kicker} title={<RichTitle t={c.hero.title} />} lead={c.hero.lead} image={c.hero.image} alt={c.hero.alt} position={c.hero.position}>
        <Link href={book} className="btn btn-primary btn-lg">{c.hero.cta} <Icon name="arrow" size={18} /></Link>
        <Link href="#collection" className="btn btn-lg" style={{ background: "rgba(247,242,234,0.12)", color: "#fff", border: "1px solid rgba(247,242,234,0.32)" }}>{c.hero.secondaryCta}</Link>
      </PageHero>

      <section className="section-sm">
        <div className="wrap">
          <SectionHead kicker="Lines we carry" title={`${COUNT[brands.length] ?? brands.length} maker${brands.length === 1 ? "" : "s"} we stand behind.`} lead="Each one earned its place on our floor. Pick a maker to see the range, or scroll on to shop by kind of fire." />
          <div className="grid-4" style={{ marginTop: 44 }}>
            {brands.map((b, i) => (
              <Reveal key={b.slug} delay={i * 80}>
                <Link href={`/fireplaces/${b.slug}`} className="card brand-card">
                  <div className="brand-card-photo">
                    <Image src={b.heroImage} alt={b.heroAlt} fill sizes="(max-width: 940px) 50vw, 25vw" />
                  </div>
                  <div style={{ padding: 22 }}>
                    <span className="eyebrow">{b.origin}</span>
                    <p className="h-md" style={{ marginTop: 8, fontSize: 24 }}>{b.name}</p>
                    <p className="small body-muted" style={{ marginTop: 6 }}>{b.categories.join(" · ")}</p>
                    <span className="small" style={{ display: "inline-flex", gap: 6, alignItems: "center", marginTop: 14, color: "var(--clay)", fontWeight: 600 }}>See the range <Icon name="arrow" size={14} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="collection">
        <div className="wrap">
          <SectionHead kicker={c.collection.kicker} title={c.collection.title} lead={c.collection.lead} />
          <div className="grid-4" style={{ marginTop: 56 }}>
            {c.collection.families.map((f, i) => (
              <Reveal key={f.title} delay={i * 90} className="card" style={{ padding: 30, display: "flex", flexDirection: "column" }}>
                <span className="eyebrow">{f.kicker}</span>
                <h3 className="h-md" style={{ marginTop: 12 }}>{f.title}</h3>
                <p className="body-muted" style={{ marginTop: 12, flex: 1 }}>{f.body}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
                  {f.models.map((m) => {
                    const href = brandHref(brands, m);
                    return href ? (
                      <Link key={m} href={href} className="chip">{m}</Link>
                    ) : (
                      <span key={m} className="chip" style={{ cursor: "default" }}>{m}</span>
                    );
                  })}
                </div>
              </Reveal>
            ))}
          </div>
          <p className="small body-muted" style={{ marginTop: 22 }}>{c.collection.note}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
            <Link href="/fireplaces/gas-electric" className="btn btn-outline">Prefer gas or electric?</Link>
            <Link href="/hearth-supplies" className="btn btn-outline">Mantels & venting supplies</Link>
            <Link href="/service" className="btn btn-outline">Venting service</Link>
          </div>
        </div>
      </section>

      <section className="section bg-paper2">
        <div className="wrap split">
          <div className="photo" style={{ aspectRatio: "4 / 5" }}>
            <Image src={c.burnBan.image} alt={c.burnBan.alt} fill sizes="(max-width: 940px) 100vw, 50vw" />
          </div>
          <div>
            <span className="kicker">{c.burnBan.kicker}</span>
            <h2 className="h-xl" style={{ marginTop: 18 }}>{c.burnBan.title}</h2>
            <p className="lead" style={{ marginTop: 18 }}>{c.burnBan.body}</p>
            <ul className="list-check" style={{ marginTop: 24 }}>
              {c.burnBan.bullets.map((b) => (
                <li key={b}><Icon name="check" size={16} /> {b}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead kicker={c.steps.kicker} title={c.steps.title} />
          <div style={{ marginTop: 48, display: "grid", gap: 0 }}>
            {c.steps.items.map((s, i) => (
              <div key={s.title} className="how-step" style={{ display: "grid", gridTemplateColumns: "120px 1fr 1.4fr", gap: 32, padding: "28px 0", borderTop: "1px solid var(--line)" }}>
                <span className="index" style={{ fontSize: 44 }}>{String(i + 1).padStart(2, "0")}</span>
                <p className="h-md">{s.title}</p>
                <p className="body-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm bg-bone">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <span className="kicker">Not ready yet?</span>
            <h2 className="h-lg" style={{ marginTop: 16 }}>{c.magnet.title}</h2>
            <p className="body-muted" style={{ marginTop: 12, maxWidth: "44ch" }}>{c.magnet.body}</p>
          </div>
          <NoteForm defaultInterest="hearth" />
        </div>
      </section>

      <RelatedLines current="/fireplaces" />

      <CtaBand title={c.closing.title} body={c.closing.body} cta={c.closing.cta} href={book} />
    </main>
  );
}
