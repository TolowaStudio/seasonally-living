import type { Metadata } from "next";
import Image from "next/image";
import Icon from "@/components/Icon";
import LeadForm from "@/components/LeadForm";
import { INTEREST_IDS } from "@/lib/interests";
import { addressOf, mapsUrlOf } from "@/lib/site";
import Crumbs from "@/components/Crumbs";
import { getPage, getSettings } from "@/lib/sanity";
import { SITE_TITLE_SUFFIX, socialMeta } from "@/lib/seo";
import type { SimpleContent } from "@/content/types";

// Content: Sanity documents "page-visit" + "siteSettings" (fallback: src/content). Dynamic (reads ?interest=).
export async function generateMetadata(): Promise<Metadata> {
  const c = await getPage<SimpleContent>("/visit");
  return { title: c.seo.title, description: c.seo.description, ...socialMeta({ fullTitle: `${c.seo.title} | ${SITE_TITLE_SUFFIX}`, description: c.seo.description, path: "/visit", ogKey: "visit", ogAlt: c.alt || "The Seasonally Living showroom" }) };
}

export default async function VisitPage({ searchParams }: { searchParams: Promise<{ interest?: string }> }) {
  const [{ interest }, c, s] = await Promise.all([searchParams, getPage<SimpleContent>("/visit"), getSettings()]);
  const initial = interest && INTEREST_IDS.includes(interest) ? interest : "hot-tub";
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <Crumbs path="/visit" />
      <section className="section-sm">
        <div className="wrap contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: 64, alignItems: "start" }}>
          <aside className="contact-rail" style={{ position: "sticky", top: "calc(var(--nav-h) + 24px)" }}>
            <span className="kicker">{c.kicker}</span>
            <h1 className="h-xl" style={{ marginTop: 18 }}>{c.title}</h1>
            <p className="lead" style={{ marginTop: 16 }}>{c.lead}</p>
            {c.image && (
              <div className="photo" style={{ aspectRatio: "16 / 10", marginTop: 28 }}>
                <Image src={c.image} alt={c.alt || ""} fill sizes="(max-width: 940px) 100vw, 40vw" />
              </div>
            )}
            <ul className="list-check" style={{ marginTop: 26 }}>
              <li><Icon name="pin" size={16} /> <a className="ul-link" href={mapsUrlOf(s)} target="_blank" rel="noopener noreferrer">{addressOf(s)}</a> ({s.address.note})</li>
              {s.hours.map((h) => (
                <li key={h.days}><Icon name="clock" size={16} /> {h.days}: {h.time}</li>
              ))}
              <li><Icon name="phone" size={16} /> <a className="ul-link" href={`tel:${s.phoneTel}`}>{s.phoneDisplay}</a></li>
              <li><Icon name="mail" size={16} /> <a className="ul-link" href={`mailto:${s.email}`}>{s.email}</a></li>
            </ul>
          </aside>
          <div id="book" className="card" style={{ padding: "clamp(24px, 4vw, 44px)", scrollMarginTop: "calc(var(--nav-h) + 20px)" }}>
            <LeadForm defaultInterest={initial} />
          </div>
        </div>
      </section>
    </main>
  );
}
