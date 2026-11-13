import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import RelatedLines from "@/components/RelatedLines";
import CtaBand from "@/components/CtaBand";
import RichTitle from "@/components/RichTitle";
import Crumbs from "@/components/Crumbs";
import { getPage, getSettings } from "@/lib/sanity";
import { SITE_TITLE_SUFFIX, socialMeta } from "@/lib/seo";
import type { AboutContent } from "@/content/types";

// Content: Sanity documents "page-about" + "siteSettings" (fallback: src/content).
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPage<AboutContent>("/about");
  return { title: c.seo.title, description: c.seo.description, ...socialMeta({ fullTitle: `${c.seo.title} | ${SITE_TITLE_SUFFIX}`, description: c.seo.description, path: "/about", ogKey: "about", ogAlt: c.hero.alt }) };
}

export default async function AboutPage() {
  const [c, s] = await Promise.all([getPage<AboutContent>("/about"), getSettings()]);
  return (
    <main>
      <Crumbs path="/about" />
      <PageHero kicker={c.hero.kicker} title={<RichTitle t={c.hero.title} />} lead={c.hero.lead} image={c.hero.image} alt={c.hero.alt} position={c.hero.position}>
        <Link href="/visit#book" className="btn btn-primary btn-lg">{c.hero.cta} <Icon name="arrow" size={18} /></Link>
      </PageHero>

      {c.owners && (
        <section className="section">
          <div className="wrap">
            <SectionHead kicker={c.owners.kicker} title={c.owners.title} />
            <figure style={{ marginTop: 40 }}>
              <div className="photo" style={{ aspectRatio: "2 / 1" }}>
                <Image src={c.owners.image} alt={c.owners.alt} fill sizes="(max-width: 1200px) 100vw, 1200px" style={{ objectFit: "cover", objectPosition: "center 48%" }} />
              </div>
              {c.owners.caption && <figcaption className="small body-muted" style={{ marginTop: 12 }}>{c.owners.caption}</figcaption>}
            </figure>
            <div className="grid-3" style={{ marginTop: 40 }}>
              {c.owners.paragraphs.map((para, i) => (
                <p key={i} className="lead" style={{ fontSize: 19 }}>{para}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section bg-paper2">
        <div className="wrap">
          <SectionHead kicker={c.timeline.kicker} title={c.timeline.title} />
          <div className="grid-4" style={{ marginTop: 48 }}>
            {c.timeline.items.map((t) => (
              <div key={t.year} className="season-card">
                <span className="index" style={{ fontSize: 48 }}>{t.year}</span>
                <p className="h-md" style={{ marginTop: 16, fontSize: 21 }}>{t.title}</p>
                <p className="small body-muted" style={{ marginTop: 8 }}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div>
            <span className="kicker">{c.values.kicker}</span>
            <h2 className="h-xl" style={{ marginTop: 18 }}>{c.values.title}</h2>
            <p className="lead" style={{ marginTop: 18 }}>{c.values.body}</p>
            <ul className="list-check" style={{ marginTop: 24 }}>
              {c.values.bullets.map((b) => (
                <li key={b}><Icon name="check" size={16} /> {b}</li>
              ))}
            </ul>
            <p style={{ marginTop: 28, fontWeight: 600 }}>{s.owners}</p>
            <p className="small body-muted">Owners since {s.founded}</p>
          </div>
          <div className="photo" style={{ aspectRatio: "4 / 5" }}>
            <Image src={c.values.image} alt={c.values.alt} fill sizes="(max-width: 940px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <RelatedLines current="/about" />
      <CtaBand title={c.closing.title} body={c.closing.body} />
    </main>
  );
}
