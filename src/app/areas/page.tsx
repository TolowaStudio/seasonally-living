import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import CtaBand from "@/components/CtaBand";
import { AREAS } from "@/content/areas";
import { SITE_TITLE_SUFFIX, breadcrumbJsonLd, socialMeta } from "@/lib/seo";

export const revalidate = 3600;

const title = "Areas We Serve: Wenatchee, Leavenworth, Chelan & More";
const description =
  "Seasonally Living serves Wenatchee, East Wenatchee, Leavenworth, Cashmere, Chelan and Manson with hot tubs, pools, Stûv stoves and venting.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMeta({ fullTitle: `${title} | ${SITE_TITLE_SUFFIX}`, description, path: "/areas", ogKey: "home", ogAlt: "Seasonally Living, Wenatchee" }),
};

export default function AreasPage() {
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <JsonLd data={breadcrumbJsonLd([{ name: "Areas we serve", path: "/areas" }])} />
      <section className="section-sm">
        <div className="wrap">
          <span className="kicker">Areas we serve</span>
          <h1 className="h-xl" style={{ marginTop: 18 }}>One showroom. The whole valley.</h1>
          <p className="lead" style={{ marginTop: 16, maxWidth: "52ch" }}>
            Our showroom is at 1407 Maiden Ln in Wenatchee, next to Home Depot. From there we deliver, install and service across the valley.
            Pick your town to see what matters where you live.
          </p>
          <div className="grid-2" style={{ marginTop: 44 }}>
            {AREAS.map((a) => (
              <Link key={a.slug} href={`/areas/${a.slug}`} className="card hoverable" style={{ padding: 28, display: "block", color: "inherit" }}>
                <h2 className="h-md" style={{ fontSize: 24 }}>{a.label}</h2>
                <p className="body-muted" style={{ marginTop: 8 }}>{a.distance}</p>
                <span className="po-cta">Serving {a.name} <Icon name="arrow" size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
