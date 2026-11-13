import type { Metadata } from "next";
import Image from "next/image";
import Icon from "@/components/Icon";
import LeadForm from "@/components/LeadForm";
import { PHOTOS, photoUrl } from "@/lib/images";
import { INTEREST_IDS } from "@/lib/interests";
import { site, addressBlock, mapsUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit the Showroom",
  description: "Visit Seasonally Living at 1407 Maiden Ln, Wenatchee (next to Home Depot). Book a fireplace consult, hot tub try-out or service visit.",
};

export default async function VisitPage({ searchParams }: { searchParams: Promise<{ interest?: string }> }) {
  const { interest } = await searchParams;
  const initial = interest && INTEREST_IDS.includes(interest) ? interest : "hearth";
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section-sm">
        <div className="wrap contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: 64, alignItems: "start" }}>
          <aside className="contact-rail" style={{ position: "sticky", top: "calc(var(--nav-h) + 24px)" }}>
            <span className="kicker">Visit the showroom</span>
            <h1 className="h-xl" style={{ marginTop: 18 }}>Book a visit or consult.</h1>
            <p className="lead" style={{ marginTop: 16 }}>
              Tell us what you&apos;re thinking about and when works. We&apos;ll confirm within one business day and have the
              right models running when you arrive.
            </p>
            <div className="photo" style={{ aspectRatio: "16 / 10", marginTop: 28 }}>
              <Image src={photoUrl(PHOTOS.stoveLiving, 1000)} alt="A wood stove warming a living room" fill sizes="(max-width: 940px) 100vw, 40vw" />
            </div>
            <ul className="list-check" style={{ marginTop: 26 }}>
              <li><Icon name="pin" size={16} /> <a className="ul-link" href={mapsUrl} target="_blank" rel="noopener noreferrer">{addressBlock}</a> ({site.address.note})</li>
              {site.hours.map((h) => (
                <li key={h.days}><Icon name="clock" size={16} /> {h.days}: {h.time}</li>
              ))}
              <li><Icon name="phone" size={16} /> <a className="ul-link" href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a></li>
              <li><Icon name="mail" size={16} /> <a className="ul-link" href={`mailto:${site.email}`}>{site.email}</a></li>
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
