import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import CtaBand from "@/components/CtaBand";
import RichTitle from "@/components/RichTitle";
import { AREAS, getArea } from "@/content/areas";
import { getSettings } from "@/lib/sanity";
import { addressOf, mapsUrlOf } from "@/lib/site";
import { SITE_TITLE_SUFFIX, breadcrumbJsonLd, faqJsonLd, socialMeta } from "@/lib/seo";

// Service-area pages. Content: src/content/areas.ts (code for now; Studio-editable is a follow-up).
export const revalidate = 3600;
export const dynamicParams = false;

export const generateStaticParams = () => AREAS.map((a) => ({ town: a.slug }));

type Props = { params: Promise<{ town: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArea((await params).town);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    ...socialMeta({ fullTitle: `${a.title} | ${SITE_TITLE_SUFFIX}`, description: a.description, path: `/areas/${a.slug}`, ogKey: `area-${a.slug}`, ogAlt: a.hero.alt }),
  };
}

export default async function AreaPage({ params }: Props) {
  const a = getArea((await params).town);
  if (!a) notFound();
  const s = await getSettings();
  const others = AREAS.filter((x) => x.slug !== a.slug);
  const book = `/visit?interest=${a.interest}#book`;

  return (
    <main>
      <JsonLd data={[breadcrumbJsonLd([{ name: "Areas we serve", path: "/areas" }, { name: a.label, path: `/areas/${a.slug}` }]), faqJsonLd(a.faqs)]} />

      <PageHero kicker={a.hero.kicker} title={<RichTitle t={a.hero.title} />} lead={a.hero.lead} image={a.hero.image} alt={a.hero.alt} position={a.hero.position}>
        <Link href={book} className="btn btn-primary btn-lg">Book a visit <Icon name="arrow" size={18} /></Link>
      </PageHero>

      <section className="section">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <span className="kicker">{a.label} and Seasonally Living</span>
            <div style={{ display: "grid", gap: 18, marginTop: 20, maxWidth: "62ch" }}>
              {a.paragraphs.map((p) => (
                <p key={p} className="body-muted" style={{ fontSize: 17, lineHeight: 1.65 }}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="card" style={{ padding: 30 }}>
            <p className="eyebrow">Our showroom</p>
            <p className="h-md" style={{ marginTop: 10, fontSize: 22 }}>{a.distance}</p>
            <ul className="list-check" style={{ marginTop: 20 }}>
              <li><Icon name="pin" size={16} /> <a className="ul-link" href={mapsUrlOf(s)} target="_blank" rel="noopener noreferrer">{addressOf(s)}</a> ({s.address.note})</li>
              {s.hours.map((h) => (
                <li key={h.days}><Icon name="clock" size={16} /> {h.days}: {h.time}</li>
              ))}
              <li><Icon name="phone" size={16} /> <a className="ul-link" href={`tel:${s.phoneTel}`}>{s.phoneDisplay}</a></li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="section-sm bg-paper2">
        <div className="wrap">
          <SectionHead kicker="What people in this area ask us about" title={`Where to start in ${a.name}.`} />
          <div className="grid-2" style={{ marginTop: 40 }}>
            {a.lines.map((l) => (
              <Link key={l.href} href={l.href} className="card hoverable" style={{ padding: 28, display: "block", color: "inherit" }}>
                <h3 className="h-md" style={{ fontSize: 22 }}>{l.title}</h3>
                <p className="body-muted" style={{ marginTop: 8 }}>{l.body}</p>
                <span className="po-cta">See {l.title.toLowerCase()} <Icon name="arrow" size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="wrap-narrow">
          <SectionHead kicker="Good to know" title={`Questions from ${a.label}.`} />
          <div style={{ marginTop: 32, display: "grid" }}>
            {a.faqs.map((f) => (
              <details key={f.q} style={{ borderTop: "1px solid var(--line)", padding: "18px 0" }}>
                <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 18 }}>{f.q}</summary>
                <p className="body-muted" style={{ marginTop: 10 }}>{f.a}</p>
              </details>
            ))}
            <div style={{ borderTop: "1px solid var(--line)" }} />
          </div>
          <p className="small body-muted" style={{ marginTop: 24 }}>
            We also serve{" "}
            {others.map((o, i) => (
              <span key={o.slug}>
                <Link className="ul-link" href={`/areas/${o.slug}`}>{o.label}</Link>
                {i < others.length - 2 ? ", " : i === others.length - 2 ? " and " : "."}
              </span>
            ))}
          </p>
        </div>
      </section>

      <CtaBand
        title={`Come see us from ${a.name}.`}
        body={`The showroom is the fastest way to decide. Book a visit and we'll have the right models running when you arrive.`}
        cta="Book a visit"
        href={book}
      />
    </main>
  );
}
