import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import CtaBand from "@/components/CtaBand";
import { PHOTOS } from "@/lib/images";

export const metadata: Metadata = {
  title: "Venting, Chimney & Spa Service",
  description: "Stove and fireplace venting, chimney liners, inspections and sweeps, plus hot tub service, from the Chim Chimney crew in Wenatchee.",
};

const SERVICES = [
  { icon: "ruler", title: "Venting design & install", body: "New flues and chimney liners for stoves, inserts and fireplaces, sized to the appliance." },
  { icon: "shield", title: "Inspections", body: "A clear look at your chimney and venting before you buy, sell or light the first fire of the season." },
  { icon: "sparkle", title: "Sweeps", body: "Creosote removal and a cleaner, safer burn. Book in fall before the rush." },
  { icon: "layers", title: "Insert retrofits", body: "Turn an open masonry fireplace into an efficient heater with an insert and a new liner." },
  { icon: "hands", title: "Hot tub service", body: "Start-ups, repairs, water care help and winterizing for the tubs we sell and many we don't." },
  { icon: "compass", title: "Seasonal open & close", body: "For second homes around Chelan and Leavenworth: we open in spring and close down in fall." },
];

export default function ServicePage() {
  return (
    <main>
      <PageHero
        kicker="Venting & service"
        title={<>We started as <em style={{ fontStyle: "italic", color: "var(--clay-soft)" }}>Chim Chimney.</em></>}
        lead="Venting, liners, inspections and sweeps are still the heart of the business. If it burns or it bubbles, we'll keep it running."
        image={PHOTOS.chimneySmoke}
        alt="Smoke rising from a chimney"
      >
        <Link href="/visit?interest=venting#book" className="btn btn-primary btn-lg">Request service <Icon name="arrow" size={18} /></Link>
      </PageHero>
      <section className="section">
        <div className="wrap">
          <SectionHead kicker="What we do" title="Service for every season." />
          <div className="grid-3" style={{ marginTop: 52 }}>
            {SERVICES.map((s) => (
              <div key={s.title} className="card" style={{ padding: 30 }}>
                <Icon name={s.icon} size={24} style={{ color: "var(--clay)" }} />
                <h3 className="h-md" style={{ marginTop: 16, fontSize: 22 }}>{s.title}</h3>
                <p className="body-muted" style={{ marginTop: 10 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title="Get on the fall schedule." body="Inspections and sweeps fill up fast once the first cold snap hits. Tell us what you've got and we'll find a time." cta="Request service" href="/visit?interest=venting#book" />
    </main>
  );
}
