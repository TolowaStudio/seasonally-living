import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import CtaBand from "@/components/CtaBand";
import RichTitle from "@/components/RichTitle";
import ShowroomArrivals from "@/components/ShowroomArrivals";
import { getBrands, getPage, getSettings } from "@/lib/sanity";
import { socialMeta } from "@/lib/seo";
import { addressOf } from "@/lib/site";
import type { HomeContent, LineContent } from "@/content/types";

// Content: Sanity documents "page-home" + "siteSettings" (fallback: src/content).
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPage<HomeContent>("/");
  return { title: { absolute: c.seo.title }, description: c.seo.description, ...socialMeta({ fullTitle: c.seo.title, description: c.seo.description, path: "/", ogKey: "home", ogAlt: c.hero.alt }) };
}

export default async function Home() {
  const [c, s, brands, pools] = await Promise.all([getPage<HomeContent>("/"), getSettings(), getBrands(), getPage<LineContent>("/pools")]);
  // Real catalogue data: the first two photographed models of each hearth line.
  const products = brands.flatMap((b) => b.sections.flatMap((sec) => sec.models).filter((m) => m.image).slice(0, 2).map((m) => ({ brand: b.name, slug: b.slug, cat: b.categories[0], ...m })));
  return (
    <main>
      {/* HERO: type left, product tiles right */}
      <section className="sh-hero" aria-labelledby="home-h1">
        <div className="sh-hero-t">
          <span className="kicker">{c.hero.credential}</span>
          <h1 id="home-h1"><RichTitle t={c.hero.title} /></h1>
          <p className="lead">{c.hero.lead}</p>
          <div className="sh-hero-actions">
            <Link href="/visit#book" className="btn btn-primary btn-lg">{c.hero.cta}</Link>
            <Link href={c.hero.secondaryHref} className="btn btn-outline btn-lg">{c.hero.secondaryCta}</Link>
          </div>
          <div className="sh-hero-facts">
            <div><b>{s.hours[0]?.days.replace("Tuesday – Saturday", "Tue to Sat")}</b>{s.hours[0]?.time}</div>
            <div><b>{s.phoneDisplay}</b>Call or visit</div>
            <div><b>Since {s.founded}</b>Family-owned</div>
            <div><b>Official</b>Cal Spas dealer</div>
          </div>
        </div>
        <div className="sh-hero-grid">
          <Link href={c.hero.secondaryHref} className="sh-tile wide">
            <Image src={c.hero.image} alt={c.hero.alt} fill loading="eager" fetchPriority="high" sizes="(max-width: 1000px) 100vw, 58vw" style={{ objectPosition: c.hero.position || "center" }} />
            <span className="sh-cap"><i>01</i>{c.hero.caption}</span>
          </Link>
          <Link href="/fireplaces/stuv" className="sh-tile pack">
            <Image src="seasonally-living/brands/stuv/stuv-6" alt="A black Stûv wood stove on legs with a flue pipe" fill sizes="(max-width: 1000px) 50vw, 29vw" />
            <span className="sh-cap"><i>02</i>Stûv</span>
          </Link>
          <Link href="/fireplaces/morso" className="sh-tile pack">
            <Image src="seasonally-living/brands/morso/6140-b" alt="A round black Morsø wood stove" fill sizes="(max-width: 1000px) 50vw, 29vw" />
            <span className="sh-cap"><i>03</i>Morsø</span>
          </Link>
        </div>
      </section>

      {/* THE LINES */}
      <section className="section-sm" aria-labelledby="lines-h" style={{ paddingBottom: 0 }}>
        <div className="wrap sh-head">
          <div>
            <span className="kicker">{c.lines.kicker}</span>
            <h2 id="lines-h" className="h-xl" style={{ marginTop: 18 }}>{c.lines.title}</h2>
            <p className="lead" style={{ marginTop: 16 }}>{c.lines.lead}</p>
          </div>
        </div>
      </section>
      <nav aria-label="Shop by line">
        <div className="sh-lines">
          {c.lines.items.map((l, i) => (
            <Link key={l.href} href={l.href} className="sh-line">
              <div className="ph"><Image src={l.image} alt="" fill sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw" /></div>
              <i>{String(i + 1).padStart(2, "0")} · {l.kicker}</i>
              <h3>{l.title}</h3>
              <p>{l.body}</p>
            </Link>
          ))}
        </div>
      </nav>

      {/* HEARTH: product grid from the catalogue */}
      <section className="section" aria-labelledby="hearth-h">
        <div className="wrap">
          <div className="sh-head">
            <div>
              <span className="kicker">{c.stuv.kicker}</span>
              <h2 id="hearth-h" className="h-xl" style={{ marginTop: 18 }}>{c.stuv.title}</h2>
              <p className="lead" style={{ marginTop: 16 }}>{c.stuv.body}</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/fireplaces/stuv" className="btn btn-primary">{c.stuv.cta}</Link>
              <Link href="/service" className="btn btn-outline">{c.stuv.secondaryCta}</Link>
            </div>
          </div>
          <ul className="sh-grid">
            {products.slice(0, 8).map((p) => (
              <li key={p.brand + p.name} className="sh-prod">
                <Link href={`/fireplaces/${p.slug}`}>
                  <div className="ph"><Image src={p.image!} alt={p.alt ?? `${p.brand} ${p.name}`} fill sizes="(max-width: 620px) 50vw, 25vw" /></div>
                  <div className="b"><small>{p.brand}</small><h3>{p.name}</h3><p>{p.type ?? p.cat ?? "Hearth"}</p></div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* POOLS: a project, so a process instead of a product grid */}
      <section className="sh-split" aria-labelledby="pools-h">
        <div>
          <span className="kicker">Swimming pools · A project, not a product</span>
          <h2 id="pools-h" className="h-xl" style={{ marginTop: 18, maxWidth: "14ch" }}>{pools.points.title}</h2>
          <p className="lead" style={{ marginTop: 16 }}>{pools.points.lead}</p>
          <table className="sh-table">
            <thead><tr><th scope="col">Step</th><th scope="col">What happens</th></tr></thead>
            <tbody>
              {pools.points.items.map((p, i) => (
                <tr key={p.title}><td>{String(i + 1).padStart(2, "0")}</td><td><h3>{p.title}</h3><p>{p.body}</p></td></tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 28 }}><Link href="/pools" className="btn btn-primary">{pools.hero.cta}</Link></div>
        </div>
        <div className="ph-cell">
          <Image src={pools.feature.image} alt={pools.feature.alt} fill sizes="(max-width: 1000px) 100vw, 50vw" style={{ objectFit: "cover" }} />
        </div>
      </section>

      {/* VENTING */}
      <section className="section-sm">
        <div className="wrap grid-4" style={{ alignItems: "start" }}>
          <div style={{ gridColumn: "span 2" }}>
            <span className="kicker">{c.venting.kicker}</span>
            <h2 className="h-lg" style={{ marginTop: 16, maxWidth: "20ch" }}>{c.venting.title}</h2>
            <p className="body-muted" style={{ marginTop: 14, maxWidth: "48ch" }}>{c.venting.body}</p>
            <Link href="/service" className="btn btn-ghost" style={{ marginTop: 18, color: "var(--clay)" }}>
              {c.venting.cta} <Icon name="arrow" size={16} className="arrow" />
            </Link>
          </div>
          {c.venting.cards.map((card) => (
            <div key={card.title} className="season-card">
              <Icon name={card.icon} size={22} style={{ color: "var(--clay)" }} />
              <p className="h-md" style={{ fontSize: 20, marginTop: 14 }}>{card.title}</p>
              <p className="small body-muted" style={{ marginTop: 8 }}>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <ShowroomArrivals />

      {/* FOUR SEASONS */}
      <section className="section-sm" aria-labelledby="seasons-h" style={{ paddingTop: 0 }}>
        <div className="wrap sh-head">
          <div>
            <span className="kicker">{c.seasons.kicker}</span>
            <h2 id="seasons-h" className="h-xl" style={{ marginTop: 18 }}>{c.seasons.title}</h2>
          </div>
          {c.seasons.credit && <p className="tiny body-muted">{c.seasons.credit}</p>}
        </div>
      </section>
      <div className="sh-lines four">
        {c.seasons.items.map((season, i) => (
          <div key={season.name} className="sh-line">
            {season.image && <div className="ph"><Image src={season.image} alt={season.alt ?? ""} fill sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 25vw" /></div>}
            <i>{String(i + 1).padStart(2, "0")} · {season.name}</i>
            <h3 style={{ fontSize: 22 }}>{season.lead}</h3>
            <p>{season.note}</p>
          </div>
        ))}
      </div>

      {/* SHOWROOM */}
      <section className="section" data-theme="showroom-dark" style={{ background: "var(--base)", color: "var(--ink)" }} aria-labelledby="showroom-h">
        <div className="wrap split">
          <div>
            <span className="kicker">{c.showroom.kicker}</span>
            <h2 id="showroom-h" className="h-xl" style={{ marginTop: 18 }}>{c.showroom.title}</h2>
            <p className="lead" style={{ marginTop: 18 }}>{c.showroom.body}</p>
            <ul className="list-check" style={{ marginTop: 26 }}>
              <li><Icon name="pin" size={16} /> {addressOf(s)} ({s.address.note})</li>
              {s.hours.map((h) => (
                <li key={h.days}><Icon name="clock" size={16} /> {h.days}: {h.time}</li>
              ))}
              <li><Icon name="phone" size={16} /> {s.phoneDisplay}</li>
            </ul>
            <Link href="/visit#book" className="btn btn-primary btn-lg" style={{ marginTop: 30 }}>{c.showroom.cta}</Link>
          </div>
          <div className="photo" style={{ aspectRatio: "5 / 4" }}>
            <Image src={c.showroom.image} alt={c.showroom.alt} fill sizes="(max-width: 940px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <CtaBand title="Come sit in the water. Or by the fire." />
    </main>
  );
}
