import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import Reveal from "@/components/RevealWrapper";
import SectionHead from "@/components/SectionHead";
import CtaBand from "@/components/CtaBand";
import { PHOTOS, photoUrl } from "@/lib/images";
import { site, addressBlock, getSiteUrl } from "@/lib/site";

const LINES = [
  { href: "/fireplaces", kicker: "Fire", title: "Stûv stoves & fireplaces", body: "Belgian-designed wood stoves, inserts and fireplaces, installed and vented by our own crew.", img: PHOTOS.stoveCabin },
  { href: "/hot-tubs", kicker: "Soak", title: "Cal Spas hot tubs", body: "Wet-test before you buy. Delivery, setup and an orientation with every tub.", img: PHOTOS.hotTubDeck },
  { href: "/swim-spas", kicker: "Swim", title: "Swim spas", body: "Year-round swimming and therapy at a fraction of a pool. Dry consults now, wet tests in spring.", img: PHOTOS.swimmer },
  { href: "/pools", kicker: "Build", title: "Pools", body: "Projects, not products. Spring 2027 build slots are planned over the winter.", img: PHOTOS.pool },
];

const SEASONS = [
  { name: "Winter", lead: "Hearth, stoves and the winter soak", note: "Burn-ban-ready heat, venting checks, hot tubs under snow." },
  { name: "Spring", lead: "Swim spas, openings and pool starts", note: "Wet tests open. Pool builds break ground." },
  { name: "Summer", lead: "Backyard builds and clearance", note: "Installs, deliveries and pre-owned value." },
  { name: "Fall", lead: "Burn prep and sweeps", note: "Inspections and venting before the first cold night." },
];

export default function Home() {
  const url = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "Store"],
    "@id": `${url}/#business`,
    name: site.legalName,
    url,
    telephone: site.phoneTel,
    email: site.email,
    address: { "@type": "PostalAddress", streetAddress: site.address.line1, addressLocality: site.address.city, addressRegion: site.address.state, postalCode: site.address.zip, addressCountry: "US" },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "16:00" }],
    areaServed: site.serviceArea.map((c) => ({ "@type": "City", name: c })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO: the fire leads */}
      <section style={{ position: "relative", height: "100vh", minHeight: 660, overflow: "hidden" }}>
        <Image src={photoUrl(PHOTOS.flames, 2400)} alt="A wood fire burning in a modern living room on a winter evening" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 45%" }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(8,7,5,0.9) 0%, rgba(8,7,5,0.6) 28%, rgba(8,7,5,0.12) 56%, rgba(8,7,5,0) 72%), linear-gradient(to bottom, rgba(10,8,5,0.55) 0%, rgba(10,8,5,0.04) 24%, rgba(10,8,5,0.2) 55%, rgba(10,8,5,0.9) 100%)" }} />
        <span className="figure-cap caption hero-credit" style={{ right: "max(32px, calc((100vw - var(--maxw)) / 2 + 32px))", bottom: 40, fontSize: 10.5 }}>
          <span className="dot" /> Featuring Stûv <span className="sep">/</span> Wood stoves & fireplaces
        </span>
        <div className="wrap" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "clamp(52px, 9vh, 100px)" }}>
          <p className="credential" style={{ marginBottom: 26, color: "rgba(247,242,234,0.75)" }}>
            <span className="dot" style={{ background: "var(--clay-soft)" }} /> Wenatchee showroom · {site.address.note}
          </p>
          <h1 className="display" style={{ color: "#fff", maxWidth: "14ch", textShadow: "0 2px 26px rgba(0,0,0,0.55)" }}>
            Your home resort, <em style={{ fontStyle: "italic", color: "var(--clay-soft)" }}>all four</em> seasons.
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "48ch", color: "rgba(247,242,234,0.9)", textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}>
            Fire, soak, swim. Stûv stoves and fireplaces with venting done right, Cal Spas hot tubs, swim spas and pools,
            all from one North Central Washington showroom.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 34, flexWrap: "wrap" }}>
            <Link href="/visit#book" className="btn btn-primary btn-lg">Book a showroom visit <Icon name="arrow" size={18} /></Link>
            <Link href="/fireplaces" className="btn btn-lg" style={{ background: "rgba(247,242,234,0.12)", color: "#fff", border: "1px solid rgba(247,242,234,0.32)", backdropFilter: "blur(10px)" }}>
              See the Stûv collection
            </Link>
          </div>
        </div>
      </section>

      {/* STÛV FEATURE */}
      <section className="section">
        <div className="wrap split">
          <Reveal>
            <span className="kicker">This winter&apos;s feature</span>
            <h2 className="h-xl" style={{ marginTop: 18 }}>Stûv: the fire, designed.</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              Stûv builds wood stoves, inserts and fireplaces in Belgium and adapts them for North America. Clean lines,
              a fire you can actually watch, and serious heat. We help you pick the model, then design and install the venting
              so it burns the way it should.
            </p>
            <div className="grid-3" style={{ marginTop: 36, gap: 18 }}>
              {[
                ["s[16]", "Compact stoves, cube to tall"],
                ["s[30C]", "The rotating three-door classic"],
                ["s[21]", "Single and double-sided fireplaces"],
              ].map(([m, d]) => (
                <div key={m} style={{ borderTop: "1px solid var(--line-strong)", paddingTop: 14 }}>
                  <p className="model-tag h-md">{m}</p>
                  <p className="small body-muted" style={{ marginTop: 6 }}>{d}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 36, flexWrap: "wrap" }}>
              <Link href="/fireplaces" className="btn btn-primary">Explore Stûv <Icon name="arrow" size={16} /></Link>
              <Link href="/service" className="btn btn-outline">How we vent it</Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="photo" style={{ aspectRatio: "4 / 5" }}>
              <Image src={photoUrl(PHOTOS.stoveMinimal, 1200)} alt="A modern wood stove burning in a bright living room" fill sizes="(max-width: 940px) 100vw, 50vw" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* VENTING */}
      <section className="section-sm bg-paper2">
        <div className="wrap grid-4" style={{ alignItems: "start" }}>
          <div style={{ gridColumn: "span 2" }}>
            <span className="kicker">Venting & chimney</span>
            <h2 className="h-lg" style={{ marginTop: 16, maxWidth: "20ch" }}>A stove is only as good as its venting.</h2>
            <p className="body-muted" style={{ marginTop: 14, maxWidth: "48ch" }}>
              We started as Chim Chimney. Venting, liners, inspections and sweeps are still the heart of what we do, for the
              stove you buy here and the one you already own.
            </p>
            <Link href="/service" className="btn btn-ghost" style={{ marginTop: 18, color: "var(--clay)" }}>
              Book venting or a sweep <Icon name="arrow" size={16} className="arrow" />
            </Link>
          </div>
          {[
            ["shield", "Sized and installed to code", "Flue, liner and clearances matched to the appliance."],
            ["clock", "Before the first cold night", "Fall inspections and sweeps so you're ready for burn season."],
          ].map(([icon, t, b]) => (
            <div key={t} className="season-card">
              <Icon name={icon} size={22} style={{ color: "var(--clay)" }} />
              <p className="h-md" style={{ fontSize: 20, marginTop: 14 }}>{t}</p>
              <p className="small body-muted" style={{ marginTop: 8 }}>{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE LINES */}
      <section className="section">
        <div className="wrap">
          <SectionHead kicker="The home resort" title="Fire, soak and swim." lead="Everything we sell, we deliver, install and service ourselves. Come see it running in the showroom." />
          <div className="grid-2" style={{ marginTop: 56 }}>
            {LINES.map((l, i) => (
              <Reveal key={l.href} delay={i * 80}>
                <Link href={l.href} className="card hoverable" style={{ display: "block" }}>
                  <div className="photo" style={{ aspectRatio: "16 / 10", borderRadius: 0 }}>
                    <Image src={photoUrl(l.img, 1200)} alt={l.title} fill sizes="(max-width: 940px) 100vw, 50vw" />
                  </div>
                  <div style={{ padding: 28 }}>
                    <span className="eyebrow">{l.kicker}</span>
                    <h3 className="h-md" style={{ marginTop: 10 }}>{l.title}</h3>
                    <p className="body-muted" style={{ marginTop: 10 }}>{l.body}</p>
                    <span className="btn-ghost" style={{ display: "inline-flex", gap: 8, alignItems: "center", marginTop: 16, fontWeight: 600, color: "var(--clay)" }}>
                      Explore <Icon name="arrow" size={16} className="arrow" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOUR SEASONS */}
      <section className="section bg-ink">
        <div className="wrap">
          <SectionHead kicker="Live for the season" title="Something worth doing every month of the year." />
          <div className="grid-4" style={{ marginTop: 48 }}>
            {SEASONS.map((s, i) => (
              <Reveal key={s.name} delay={i * 80} className="season-card">
                <span className="index">0{i + 1}</span>
                <p className="h-md" style={{ marginTop: 18 }}>{s.name}</p>
                <p style={{ marginTop: 8, fontWeight: 600 }}>{s.lead}</p>
                <p className="small body-muted" style={{ marginTop: 8 }}>{s.note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWROOM */}
      <section className="section">
        <div className="wrap split">
          <div className="photo" style={{ aspectRatio: "5 / 4" }}>
            <Image src={photoUrl(PHOTOS.hotTubSnow, 1400)} alt="A hot tub steaming in a snowy forest" fill sizes="(max-width: 940px) 100vw, 50vw" />
          </div>
          <div>
            <span className="kicker">Visit the showroom</span>
            <h2 className="h-xl" style={{ marginTop: 18 }}>Feel the heat. Try the water.</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              Stoves burning, tubs filled, no pressure. Bring a photo of the room or the backyard and we&apos;ll give you a
              straight answer on what fits.
            </p>
            <ul className="list-check" style={{ marginTop: 26 }}>
              <li><Icon name="pin" size={16} /> {addressBlock} ({site.address.note})</li>
              <li><Icon name="clock" size={16} /> Tuesday – Saturday, 10am – 4pm. Sunday & Monday by appointment.</li>
              <li><Icon name="phone" size={16} /> {site.phoneDisplay}</li>
            </ul>
            <Link href="/visit#book" className="btn btn-primary btn-lg" style={{ marginTop: 30 }}>Book a visit <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
