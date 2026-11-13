import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import RelatedLines from "@/components/RelatedLines";
import CtaBand from "@/components/CtaBand";
import { PHOTOS, photoUrl } from "@/lib/images";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Family-owned by Cam and Susan McNeill since 1979. Chim Chimney Fireplace and Masonry, now Seasonally Living by Chim Chimney, next to Home Depot in Wenatchee.",
};

const TIMELINE = [
  { year: "1979", title: "Chim Chimney begins", body: "Cam and Susan McNeill start Chim Chimney Fireplace and Masonry." },
  { year: "1995", title: "The showroom opens", body: "The retail store opens so customers can see fireplaces and spas in person." },
  { year: "2024", title: "Focused on what we do best", body: "We simplified the business to focus on fire, water and the backyard." },
  { year: "Today", title: "Seasonally Living", body: "Doing business as Seasonally Living by Chim Chimney, next door to Home Depot." },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        kicker="Our story"
        title={<>Family-owned <em style={{ fontStyle: "italic", color: "var(--clay-soft)" }}>since 1979.</em></>}
        lead="We specialize in transforming your home with the fireplace, chimney and masonry of your choice, and your backyard with hot tubs, swim spas and outdoor living. Turn-key, start to finish."
        image={PHOTOS.masonryFire}
        alt="A fire burning in a traditional masonry fireplace"
      >
        <Link href="/visit#book" className="btn btn-primary btn-lg">Come meet us <Icon name="arrow" size={18} /></Link>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionHead kicker="Our short story" title="From chimneys to the whole home resort." />
          <div className="grid-4" style={{ marginTop: 48 }}>
            {TIMELINE.map((t) => (
              <div key={t.year} className="season-card">
                <span className="index" style={{ fontSize: 48 }}>{t.year}</span>
                <p className="h-md" style={{ marginTop: 16, fontSize: 21 }}>{t.title}</p>
                <p className="small body-muted" style={{ marginTop: 8 }}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-paper2">
        <div className="wrap split">
          <div>
            <span className="kicker">What we believe</span>
            <h2 className="h-xl" style={{ marginTop: 18 }}>Comfort, safety and leisure.</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              We&apos;re a turn-key business. We help you choose, we install it, and we&apos;re still here to service it. That&apos;s
              how a family business lasts more than forty years in one valley.
            </p>
            <ul className="list-check" style={{ marginTop: 24 }}>
              <li><Icon name="check" size={16} /> Fireplaces, chimneys and masonry</li>
              <li><Icon name="check" size={16} /> Hot tubs, swim spas and saunas, installed</li>
              <li><Icon name="check" size={16} /> Patios, pads, gazebos and outdoor kitchens</li>
            </ul>
            <p style={{ marginTop: 28, fontWeight: 600 }}>{site.owners}</p>
            <p className="small body-muted">Owners since {site.founded}</p>
          </div>
          <div className="photo" style={{ aspectRatio: "4 / 5" }}>
            <Image src={photoUrl(PHOTOS.stoveLiving, 1200)} alt="A wood stove warming a living room" fill sizes="(max-width: 940px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <RelatedLines current="/about" />
      <CtaBand title="Come meet us next door to Home Depot." body="The showroom is open Tuesday to Saturday, 10 to 4. Sundays and Mondays by appointment." />
    </main>
  );
}
