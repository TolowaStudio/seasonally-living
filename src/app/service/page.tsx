import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import CtaBand from "@/components/CtaBand";
import RelatedLines from "@/components/RelatedLines";
import RichTitle from "@/components/RichTitle";
import { getPage } from "@/lib/sanity";
import type { ServiceContent } from "@/content/types";

// Content: Sanity document "page-service" (fallback: src/content/pages.ts).
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPage<ServiceContent>("/service");
  return { title: c.seo.title, description: c.seo.description };
}

export default async function ServicePage() {
  const c = await getPage<ServiceContent>("/service");
  const book = "/visit?interest=venting#book";
  return (
    <main>
      <PageHero kicker={c.hero.kicker} title={<RichTitle t={c.hero.title} />} lead={c.hero.lead} image={c.hero.image} alt={c.hero.alt} position={c.hero.position}>
        <Link href={book} className="btn btn-primary btn-lg">{c.hero.cta} <Icon name="arrow" size={18} /></Link>
        <Link href="/hearth-supplies" className="btn btn-lg" style={{ background: "rgba(247,242,234,0.12)", color: "#fff", border: "1px solid rgba(247,242,234,0.32)" }}>{c.hero.secondaryCta}</Link>
      </PageHero>
      <section className="section">
        <div className="wrap">
          <SectionHead kicker={c.services.kicker} title={c.services.title} />
          <div className="grid-3" style={{ marginTop: 52 }}>
            {c.services.items.map((s) => (
              <div key={s.title} className="card" style={{ padding: 30 }}>
                <Icon name={s.icon} size={24} style={{ color: "var(--clay)" }} />
                <h3 className="h-md" style={{ marginTop: 16, fontSize: 22 }}>{s.title}</h3>
                <p className="body-muted" style={{ marginTop: 10 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <RelatedLines current="/service" />
      <CtaBand title={c.closing.title} body={c.closing.body} cta={c.closing.cta} href={book} />
    </main>
  );
}
