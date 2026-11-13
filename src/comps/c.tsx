import Link from "next/link";
import { Arrivals, CompShell, CtaPair, Photo, Proof } from "./shared";
import { LINES, PHOTO, POOL_STEPS, SWIM_MODELS, TUB_TYPES, WHY_HERE } from "./data";
import { getBrands, getSettings } from "@/lib/sanity";

/** Direction C: Modern showroom. Crisp, pale, product-forward, shoppable. */

const BR = "seasonally-living/brands/";

export async function CHome() {
  const [brands, s] = await Promise.all([getBrands(), getSettings()]);
  // Real catalogue data: first two photographed models per hearth brand.
  const products = brands.flatMap((b) =>
    b.sections.flatMap((sec) => sec.models).filter((m) => m.image).slice(0, 2).map((m) => ({ brand: b.name, slug: b.slug, cat: b.categories[0], ...m })),
  );
  const lines = [
    { i: "01", t: LINES.tubs.title, n: LINES.tubs.note, href: "/comps/c/hot-tubs", img: PHOTO.csPlatinum, pos: "58% 50%", alt: "A Cal Spas Platinum hot tub on a garden patio" },
    { i: "02", t: LINES.pools.title, n: LINES.pools.note, href: "/pools", img: PHOTO.poolBlueHour, pos: "50% 50%", alt: "A modern home with a swimming pool at blue hour" },
    { i: "03", t: LINES.preowned.title, n: LINES.preowned.note, href: "/pre-owned", img: PHOTO.csEscape, pos: "62% 50%", alt: "A Cal Spas Escape hot tub on a patio" },
    { i: "04", t: LINES.hearth.title, n: LINES.hearth.note, href: "/fireplaces", img: PHOTO.stoveMinimal, pos: "50% 50%", alt: "A modern wood stove burning in a bright living room" },
  ];
  return (
    <CompShell v="c">
      <section className="cmp-c-hero" aria-labelledby="c-h1">
        <div className="cmp-c-hero-t">
          <div>
            <p className="cmp-eyebrow">Showroom · Wenatchee, WA</p>
            <h1 id="c-h1" className="cmp-c-h1">Water and fire, <em>for the long season.</em></h1>
            <p className="cmp-c-sub">Cal Spas hot tubs and swim spas, pools installed by our own crew, pre-owned spas, and Stûv, Kuma, Morsø and Napoleon stoves with the venting done right. See them running before you decide.</p>
            <CtaPair />
          </div>
          <div className="cmp-c-facts">
            <div><b>Tue to Sat</b>10 to 4</div>
            <div><b>{s.phoneDisplay}</b>Call or visit</div>
            <div><b>Since 1979</b>Family-owned</div>
            <div><b>Official</b>Cal Spas dealer</div>
          </div>
        </div>
        <div className="cmp-c-hero-g">
          <Link href="/comps/c/hot-tubs" className="cmp-c-tile wide">
            <Photo src={PHOTO.csPlatinum} alt="A Cal Spas Platinum hot tub on a garden patio" pos="58% 50%" eager sizes="(max-width: 1000px) 100vw, 58vw" />
            <span className="lab"><i>01</i>Hot tubs &amp; swim spas</span>
          </Link>
          <Link href="/fireplaces/stuv" className="cmp-c-tile cmp-c-pack">
            <Photo src={BR + "stuv/stuv-6"} alt="A black Stûv wood stove on legs with a flue pipe" sizes="(max-width: 1000px) 50vw, 29vw" style={{ objectFit: "contain" }} />
            <span className="lab"><i>02</i>Stûv</span>
          </Link>
          <Link href="/fireplaces/morso" className="cmp-c-tile cmp-c-pack">
            <Photo src={BR + "morso/6140-b"} alt="A round black Morsø wood stove" sizes="(max-width: 1000px) 50vw, 29vw" style={{ objectFit: "contain" }} />
            <span className="lab"><i>03</i>Morsø</span>
          </Link>
        </div>
      </section>

      <nav aria-label="Shop by line">
        <h2 className="cmp-sr">Shop by line</h2>
        <div className="cmp-c-lines">
          {lines.map((l) => (
            <Link key={l.t} href={l.href}>
              <div className="ph"><Photo src={l.img} alt={l.alt} pos={l.pos} sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 25vw" /></div>
              <i>{l.i}</i><h3>{l.t}</h3><p>{l.n}</p>
            </Link>
          ))}
        </div>
      </nav>

      <section className="cmp-sec" aria-labelledby="c-hearth">
        <div className="cmp-wrap">
          <div className="cmp-sechead">
            <div><p className="cmp-eyebrow">Hearth &amp; venting</p><h2 id="c-hearth" className="cmp-h2">From the showroom floor.</h2><p className="cmp-lead">Four lines, each installed and vented by our crew. Venting has been our trade since 1979.</p></div>
            <Link href="/fireplaces" className="cmp-more">All hearth lines <span aria-hidden>→</span></Link>
          </div>
          <ul className="cmp-c-grid" style={{ listStyle: "none" }}>
            {products.slice(0, 8).map((p) => (
              <li key={p.brand + p.name} className="cmp-c-prod">
                <Link href={`/fireplaces/${p.slug}`} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <div className="ph"><Photo src={p.image!} alt={p.alt ?? `${p.brand} ${p.name}`} sizes="(max-width: 560px) 50vw, 25vw" style={{ objectFit: "contain" }} /></div>
                  <div className="b"><small>{p.brand}</small><h3>{p.name}</h3><p>{p.type ?? p.cat ?? "Hearth"}</p></div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cmp-c-split" aria-label="Pools and swim spas">
        <div>
          <p className="cmp-eyebrow">Swimming pools · A project, not a product</p>
          <h2 className="cmp-h2" style={{ maxWidth: "14ch" }}>Plan in winter. Swim by summer.</h2>
          <p className="cmp-lead">Installed by our own crew, from first consult to first swim. Spring 2027 install slots are limited.</p>
          <div className="cmp-c-bar" aria-hidden><i /><i /><i /><i /></div>
          <div className="cmp-c-bar-l" aria-hidden><span>Consult</span><span>Permit</span><span>Install</span><span>Swim</span></div>
          <div style={{ marginTop: 28 }}><Link href="/pools" className="btn btn-primary">Join the spring install list</Link></div>
        </div>
        <div style={{ padding: 0, position: "relative", minHeight: 360 }}>
          <Photo src={PHOTO.poolNight} alt="A pool lit at night beside a modern house" sizes="(max-width: 1000px) 100vw, 50vw" />
        </div>
      </section>

      <section className="cmp-sec" aria-labelledby="c-process">
        <div className="cmp-wrap">
          <p className="cmp-eyebrow">Pool install timeline</p>
          <h2 id="c-process" className="cmp-h2">Four phases, one crew.</h2>
          <table className="cmp-c-table">
            <thead><tr><th scope="col">Step</th><th scope="col">When</th><th scope="col">What happens</th></tr></thead>
            <tbody>
              {POOL_STEPS.map((p, i) => (
                <tr key={p.title}><td>0{i + 1}</td><td>{p.when}</td><td><h3>{p.title}</h3><p>{p.body}</p></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Arrivals v="c" />
      <Proof v="c" />

      <section className="cmp-sec cmp-c-dark" aria-labelledby="c-visit">
        <div className="cmp-wrap">
          <p className="cmp-eyebrow">Visit the showroom</p>
          <h2 id="c-visit" className="cmp-h2" style={{ maxWidth: "18ch" }}>Tubs filled. Stoves burning. No pressure.</h2>
          <p className="cmp-lead">Tuesday to Saturday, 10 to 4, next to Home Depot in Wenatchee. Bring a photo of the backyard or the room.</p>
          <div style={{ marginTop: 32 }}><CtaPair /></div>
        </div>
      </section>
    </CompShell>
  );
}

export async function CHotTubs() {
  return (
    <CompShell v="c">
      <section className="cmp-c-hero" aria-labelledby="c-ht-h1">
        <div className="cmp-c-hero-t">
          <div>
            <p className="cmp-eyebrow">Hot tubs · Official Cal Spas dealer</p>
            <h1 id="c-ht-h1" className="cmp-c-h1">The winter soak, <em>every night.</em></h1>
            <p className="cmp-c-sub">January in the valley is made for this. Sit in a running Cal Spas tub at the showroom before you decide, then let us deliver, set up and show you how to care for it.</p>
            <CtaPair />
          </div>
          <div className="cmp-c-facts">
            <div><b>Try first</b>Running in the showroom</div>
            <div><b>Delivered</b>Set up by our crew</div>
            <div><b>Orientation</b>For every buyer</div>
            <div><b>Serviced</b>By the people who installed it</div>
          </div>
        </div>
        <div className="cmp-c-hero-g" style={{ gridTemplateRows: "1fr" }}>
          <div className="cmp-c-tile wide"><Photo src={PHOTO.csPlatinum} alt="A Cal Spas Platinum hot tub on a garden patio" pos="58% 50%" eager sizes="(max-width: 1000px) 100vw, 58vw" /><span className="lab"><i>Cal Spas</i>Platinum on a garden patio</span></div>
        </div>
      </section>

      <section className="cmp-sec" aria-labelledby="c-ht-types">
        <div className="cmp-wrap">
          <p className="cmp-eyebrow">Choose your tub</p>
          <h2 id="c-ht-types" className="cmp-h2">A tub for every backyard.</h2>
          <p className="cmp-lead">Match seats, jets and size to how you&apos;ll actually use it. We&apos;ll help.</p>
          <ul className="cmp-c-grid three" style={{ listStyle: "none", marginTop: 40 }}>
            {TUB_TYPES.map((t) => (
              <li key={t.name} className="cmp-c-prod">
                <div className="ph cover" style={{ aspectRatio: "4 / 3" }}><Photo src={t.image} alt={`A Cal Spas ${t.name.toLowerCase()} on a patio`} pos={t.pos} sizes="(max-width: 700px) 100vw, 33vw" /></div>
                <div className="b"><small>{t.tag}</small><h3>{t.name}</h3><p>{t.seats}. {t.body}</p><p style={{ marginTop: 14 }}><Link href="/visit?interest=hot-tub#book" className="cmp-more" style={{ fontSize: 12.5, letterSpacing: ".12em", textTransform: "uppercase" }}>Try one <span aria-hidden>→</span></Link></p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cmp-sec" style={{ paddingTop: 0 }} aria-labelledby="c-ht-why">
        <div className="cmp-wrap">
          <p className="cmp-eyebrow">Why buy here</p>
          <h2 id="c-ht-why" className="cmp-h2" style={{ maxWidth: "20ch" }}>The tub is half of it. The rest is us.</h2>
          <table className="cmp-c-table">
            <thead><tr><th scope="col">No.</th><th scope="col">Promise</th><th scope="col">What it means</th></tr></thead>
            <tbody>{WHY_HERE.map((w, i) => <tr key={w.title}><td>0{i + 1}</td><td><h3>{w.title}</h3></td><td><p>{w.body}</p></td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="cmp-c-split" aria-label="Swim spas">
        <div>
          <p className="cmp-eyebrow">Also in the showroom</p>
          <h2 className="cmp-h2" style={{ maxWidth: "14ch" }}>Swim all year. In the backyard.</h2>
          <table className="cmp-c-table"><tbody>{SWIM_MODELS.map((m) => <tr key={m.name}><td /><td><h3>{m.name}</h3></td><td><p>{m.body}</p></td></tr>)}</tbody></table>
          <div style={{ marginTop: 24 }}><Link href="/swim-spas" className="btn btn-outline">See the swim spas</Link></div>
        </div>
        <div style={{ padding: 0, position: "relative", minHeight: 360 }}>
          <Photo src={PHOTO.swimProX} alt="A Cal Spas Swim Pro X swim spa on a lawn beside a house" pos="45% 50%" sizes="(max-width: 1000px) 100vw, 50vw" />
        </div>
      </section>

      <Arrivals v="c" title="Pre-owned, inspected and ready." lead="Trade-ins come back through our shop, get inspected and repaired, and go on the floor. Delivered like a new tub." />

      <section className="cmp-sec cmp-c-dark" aria-labelledby="c-ht-end">
        <div className="cmp-wrap">
          <p className="cmp-eyebrow">Next step</p>
          <h2 id="c-ht-end" className="cmp-h2">Come sit in one.</h2>
          <p className="cmp-lead">The fastest way to choose a tub is to try a few. Book a time and we&apos;ll have them warm. Not ready? Get the winter hot tub care guide in the note.</p>
          <div style={{ marginTop: 32 }}><CtaPair /></div>
        </div>
      </section>
    </CompShell>
  );
}
