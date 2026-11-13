import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";
import PageHero from "./PageHero";
import SectionHead from "./SectionHead";
import CtaBand from "./CtaBand";
import NoteForm from "./NoteForm";
import RelatedLines from "./RelatedLines";
import { photoUrl } from "@/lib/images";

export type LinePageProps = {
  interest: string;
  path: string;
  hero: { kicker: string; title: React.ReactNode; lead: string; image: string; alt: string; cta: string; position?: string };
  points: { kicker: string; title: string; lead: string; items: { title: string; body: string }[] };
  models?: { kicker: string; title: string; lead?: string; items: { name: string; tag?: string; body: string; bullets?: string[] }[] };
  feature: { kicker: string; title: string; body: string; bullets: string[]; image: string; alt: string };
  magnet?: { title: string; body: string };
  closing: { title: string; body: string; cta: string };
  children?: React.ReactNode;
};

export default function LinePage({ interest, path, hero, points, models, feature, magnet, closing, children }: LinePageProps) {
  const book = `/visit?interest=${interest}#book`;
  return (
    <main>
      <PageHero kicker={hero.kicker} title={hero.title} lead={hero.lead} image={hero.image} alt={hero.alt} position={hero.position}>
        <Link href={book} className="btn btn-primary btn-lg">{hero.cta} <Icon name="arrow" size={18} /></Link>
        <a href={`#more`} className="btn btn-lg" style={{ background: "rgba(247,242,234,0.12)", color: "#fff", border: "1px solid rgba(247,242,234,0.32)" }}>
          Learn more
        </a>
      </PageHero>

      <section className="section" id="more" style={{ scrollMarginTop: "var(--nav-h)" }}>
        <div className="wrap">
          <SectionHead kicker={points.kicker} title={points.title} lead={points.lead} />
          <div className="grid-3" style={{ marginTop: 52 }}>
            {points.items.map((p, i) => (
              <div key={p.title} className="season-card">
                <span className="index" style={{ fontSize: 40 }}>0{i + 1}</span>
                <p className="h-md" style={{ marginTop: 14, fontSize: 22 }}>{p.title}</p>
                <p className="body-muted" style={{ marginTop: 8 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {models && (
        <section className="section-sm" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <SectionHead kicker={models.kicker} title={models.title} lead={models.lead} />
            <div className={models.items.length === 2 ? "grid-2" : "grid-3"} style={{ marginTop: 40 }}>
              {models.items.map((m) => (
                <div key={m.name} className="card" style={{ padding: 30 }}>
                  {m.tag && <span className="eyebrow">{m.tag}</span>}
                  <h3 className="h-md" style={{ marginTop: m.tag ? 10 : 0 }}>{m.name}</h3>
                  <p className="body-muted" style={{ marginTop: 10 }}>{m.body}</p>
                  {m.bullets && (
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
            <Image src={photoUrl(feature.image, 1200)} alt={feature.alt} fill sizes="(max-width: 940px) 100vw, 50vw" />
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

      {children}

      {magnet && (
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

      <RelatedLines current={path} />

      <CtaBand title={closing.title} body={closing.body} cta={closing.cta} href={book} />
    </main>
  );
}
