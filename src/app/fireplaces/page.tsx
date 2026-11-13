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
import { PHOTOS, photoUrl } from "@/lib/images";

export const metadata: Metadata = {
  title: "Stûv Wood Stoves & Fireplaces",
  description:
    "See Stûv wood stoves, inserts and fireplaces in Wenatchee. Model selection, venting design and installation by Seasonally Living (Chim Chimney).",
};

const FAMILIES = [
  {
    kicker: "Freestanding",
    title: "Wood stoves",
    body: "Freestanding stoves that need no surround or finishing. Place it, vent it, light it.",
    models: ["s[6]H", "s[16]cube", "s[16]H", "s[16]V", "s[30C]one", "s[30C]", "s[30C]H"],
  },
  {
    kicker: "For an existing hearth",
    title: "Wood inserts",
    body: "Turn an open, drafty masonry fireplace into real heat. We fit the insert and reline the chimney.",
    models: ["s[6]in", "s[16]in"],
  },
  {
    kicker: "Built in",
    title: "Wood fireplaces",
    body: "Zero-clearance fireplaces for a new wall or remodel, including double-sided models that heat two rooms.",
    models: ["s[16]Z", "s[21]sf", "s[21]df", "s[21CLAD]"],
  },
];

const STEPS = [
  ["01", "Visit and pick", "See a Stûv burning in the showroom. We look at your room, how you'll use it and how much heat you need."],
  ["02", "Site check", "We look at the chimney or the route for a new flue: clearances, liner condition and roof."],
  ["03", "Venting design", "We size the flue and liner to the appliance and your home, and handle the permit."],
  ["04", "Install and first fire", "Our crew installs the stove and venting, then lights the first fire with you."],
  ["05", "Every fall", "Inspection and sweep before burn season, so it keeps burning clean."],
];

export default function FireplacesPage() {
  return (
    <main>
      <PageHero
        kicker="Fireplaces & stoves · Featuring Stûv"
        title={<>The essential fire, <em style={{ fontStyle: "italic", color: "var(--clay-soft)" }}>done right.</em></>}
        lead="Stûv wood stoves, inserts and fireplaces, designed in Belgium and adapted for North America. We fit the model to your room, then design and install the venting ourselves."
        image={PHOTOS.stoveCabin}
        alt="A wood stove in a timber A-frame living room"
        position="center 55%"
      >
        <Link href="/visit?interest=hearth#book" className="btn btn-primary btn-lg">Book a fireplace consult <Icon name="arrow" size={18} /></Link>
        <Link href="#collection" className="btn btn-lg" style={{ background: "rgba(247,242,234,0.12)", color: "#fff", border: "1px solid rgba(247,242,234,0.32)" }}>See the collection</Link>
      </PageHero>

      <section className="section" id="collection">
        <div className="wrap">
          <SectionHead kicker="The Stûv collection" title="Three ways to bring fire home." lead="Every Stûv is built for a fire you can watch and heat you can feel. Here's how the range breaks down." />
          <div className="grid-3" style={{ marginTop: 56 }}>
            {FAMILIES.map((f, i) => (
              <Reveal key={f.title} delay={i * 90} className="card" style={{ padding: 30, display: "flex", flexDirection: "column" }}>
                <span className="eyebrow">{f.kicker}</span>
                <h3 className="h-md" style={{ marginTop: 12 }}>{f.title}</h3>
                <p className="body-muted" style={{ marginTop: 12, flex: 1 }}>{f.body}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
                  {f.models.map((m) => (
                    <span key={m} className="chip" style={{ cursor: "default" }}>{m}</span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
          <p className="small body-muted" style={{ marginTop: 22 }}>
            Model availability varies. Ask us which Stûv models are on the showroom floor.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
            <Link href="/fireplaces/gas-electric" className="btn btn-outline">Prefer gas or electric?</Link>
            <Link href="/hearth-supplies" className="btn btn-outline">Mantels & venting supplies</Link>
            <Link href="/service" className="btn btn-outline">Venting & chimney service</Link>
          </div>
        </div>
      </section>

      <section className="section bg-paper2">
        <div className="wrap split">
          <div className="photo" style={{ aspectRatio: "4 / 5" }}>
            <Image src={photoUrl(PHOTOS.stoveLiving, 1200)} alt="A wood stove heating a living room" fill sizes="(max-width: 940px) 100vw, 50vw" />
          </div>
          <div>
            <span className="kicker">Burn-ban ready</span>
            <h2 className="h-xl" style={{ marginTop: 18 }}>Heat you can use on the days that matter.</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              The Wenatchee valley calls burn bans when the air stalls. Stage 1 bans stop uncertified stoves; Stage 2 stops
              nearly all burning. We&apos;ll walk you through which appliances are certified and what that means for your winter.
            </p>
            <ul className="list-check" style={{ marginTop: 24 }}>
              <li><Icon name="check" size={16} /> Clean-burning modern combustion</li>
              <li><Icon name="check" size={16} /> Venting sized to the appliance, not guessed</li>
              <li><Icon name="check" size={16} /> Honest advice on wood, gas and electric</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead kicker="From showroom to first fire" title="One crew, start to finish." />
          <div style={{ marginTop: 48, display: "grid", gap: 0 }}>
            {STEPS.map(([n, t, b]) => (
              <div key={n} className="how-step" style={{ display: "grid", gridTemplateColumns: "120px 1fr 1.4fr", gap: 32, padding: "28px 0", borderTop: "1px solid var(--line)" }}>
                <span className="index" style={{ fontSize: 44 }}>{n}</span>
                <p className="h-md">{t}</p>
                <p className="body-muted">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm bg-bone">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <span className="kicker">Not ready yet?</span>
            <h2 className="h-lg" style={{ marginTop: 16 }}>Get the burn-ban-ready fireplace guide.</h2>
            <p className="body-muted" style={{ marginTop: 12, maxWidth: "44ch" }}>
              What to look for in a wood stove, how venting works, and how to stay warm on burn-ban days. Plus the monthly note.
            </p>
          </div>
          <NoteForm defaultInterest="hearth" />
        </div>
      </section>

      <RelatedLines current="/fireplaces" />

      <CtaBand title="Come see a Stûv burning." body="Book a fireplace consult and we'll have one lit when you arrive. Bring a photo of the room." cta="Book a fireplace consult" href="/visit?interest=hearth#book" />
    </main>
  );
}
