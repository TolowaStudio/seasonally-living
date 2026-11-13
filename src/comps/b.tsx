import Link from "next/link";
import { Arrivals, CompShell, CtaPair, Photo, Proof, Reveal } from "./shared";
import { PHOTO, POOL_STEPS, STORY, TUB_TYPES, WHY_HERE } from "./data";
import { getSettings } from "@/lib/sanity";
import { addressOf, mapsUrlOf } from "@/lib/site";

/** Direction B: The family shop. Warm, editorial, human. */

export async function BHome() {
  const s = await getSettings();
  const rows = [
    { t: "Hot tubs & swim spas", n: "Official Cal Spas dealer. Try one running in the showroom, delivered and set up by us.", href: "/comps/b/hot-tubs", img: PHOTO.csEscape, pos: "62% 50%", alt: "A Cal Spas Escape hot tub on a patio" },
    { t: "Swimming pools", n: "Installed by our own crew, with the surround that finishes it. One crew from design to the first swim.", href: "/pools", img: PHOTO.poolBlueHour, pos: "50% 50%", alt: "A modern home with a swimming pool at blue hour" },
    { t: "Pre-owned spas", n: "Trade-ins inspected and repaired in our own shop, cleaned and delivered like a new tub.", href: "/pre-owned", img: PHOTO.csPlatinumCourtyard, pos: "50% 50%", alt: "A Cal Spas Platinum hot tub on a stone courtyard" },
    { t: "Hearth & venting", n: "Stûv, Kuma, Morsø and Napoleon, vented and installed by our crew. Venting has been our trade since 1979.", href: "/fireplaces", img: PHOTO.stoveLiving, pos: "50% 50%", alt: "A freestanding wood stove in a living room" },
  ];
  return (
    <CompShell v="b">
      <section className="cmp-b-hero" aria-labelledby="b-h1">
        <div className="cmp-wrap cmp-b-hero-grid">
          <div>
            <p className="cmp-eyebrow">Family-owned since 1979 · Wenatchee</p>
            <h1 id="b-h1" className="cmp-b-h1">A family shop in the valley, <em>since 1979.</em></h1>
            <p className="cmp-b-sub">Cam and Susan McNeill started Chim Chimney in 1979. Today it&apos;s Seasonally Living: stoves and venting, Cal Spas hot tubs and swim spas, and pools installed by our own crew. We help you choose, we install it, and we&apos;re still here to service it.</p>
            <CtaPair />
            <p className="cmp-b-hours"><span>Tuesday to Saturday, 10 to 4</span><span>Next to Home Depot</span><span>{s.phoneDisplay}</span></p>
          </div>
          <div className="cmp-b-photo">
            <div className="cmp-b-img"><Photo src={PHOTO.mcneillFamily} alt="The McNeill family walking together through tall summer grass in the hills" pos="50% 40%" eager sizes="(max-width: 1000px) 100vw, 55vw" /></div>
            <div className="cmp-b-note"><b>47 years</b><span>One valley, one family. The showroom has been open since 1995.</span></div>
          </div>
        </div>
      </section>

      <section className="cmp-sec cmp-b-story" aria-labelledby="b-story">
        <div className="cmp-wrap cmp-b-story-grid">
          <Reveal>
            <p className="cmp-eyebrow">Cam &amp; Susan McNeill</p>
            <h2 id="b-story" className="cmp-h2">Choose well. Install it ourselves. Stay for the service.</h2>
            <p className="big">In 1995 they opened the showroom so neighbors could see a fire burning and sit in a hot tub before they decided. The way they work hasn&apos;t changed.</p>
            <div style={{ marginTop: 28 }}><Link href="/about" className="cmp-more">Read our story <span aria-hidden>→</span></Link></div>
          </Reveal>
          <Reveal delay={100}>
            <ol className="cmp-b-ledger">
              {STORY.map((e) => (
                <li key={e.year}><b>{e.year}</b><div><h3>{e.title}</h3><p>{e.body}</p></div></li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="cmp-sec" aria-labelledby="b-how">
        <div className="cmp-wrap">
          <p className="cmp-eyebrow">How we work</p>
          <h2 id="b-how" className="cmp-h2" style={{ maxWidth: "20ch" }}>A turn-key business, the old-fashioned way.</h2>
          <div className="cmp-b-how">
            {[
              { n: "1 · Choose", t: "We help you choose", b: "Tubs filled, stoves burning, no pressure. Bring a photo of the backyard or the room and we'll give you a straight answer on what fits." },
              { n: "2 · Install", t: "We install it ourselves", b: "Our own crew delivers and sets up the tubs, installs the pools and designs the venting, so one team is accountable." },
              { n: "3 · Stay", t: "We're still here", b: "Start-ups, repairs, winterizing and venting inspections, from the people who installed it." },
            ].map((x) => (
              <Reveal key={x.t}><div><small>{x.n}</small><h3>{x.t}</h3><p>{x.b}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cmp-sec" style={{ paddingTop: 0 }} aria-labelledby="b-lines">
        <div className="cmp-wrap">
          <p className="cmp-eyebrow">What we do</p>
          <h2 id="b-lines" className="cmp-h2" style={{ marginBottom: 40 }}>Water and fire.</h2>
          <ul className="cmp-b-lines">
            {rows.map((r) => (
              <li key={r.t}>
                <Link href={r.href} className="cmp-b-line">
                  <div className="cmp-b-line-ph"><Photo src={r.img} alt={r.alt} pos={r.pos} sizes="220px" /></div>
                  <div><h3>{r.t}</h3><p>{r.n}</p></div>
                  <span className="go">Explore <span aria-hidden>→</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cmp-sec" style={{ background: "var(--paper-2)" }} aria-labelledby="b-pools">
        <div className="cmp-wrap">
          <p className="cmp-eyebrow">Swimming pools · A project, not a product</p>
          <h2 id="b-pools" className="cmp-h2" style={{ maxWidth: "18ch" }}>From first consult to first swim.</h2>
          <p className="cmp-lead">Every pool is its own project, installed by the same crew you meet at the design consult. Spring 2027 install slots are limited; winter is when the planning happens.</p>
          <ol className="cmp-b-steps">
            {POOL_STEPS.map((p) => <li key={p.title}><small>{p.when}</small><h3>{p.title}</h3><p>{p.body}</p></li>)}
          </ol>
          <div style={{ marginTop: 36 }}><Link href="/pools" className="btn btn-primary btn-lg">Join the spring install list</Link></div>
        </div>
      </section>

      <Arrivals v="b" />
      <Proof v="b" />

      <section className="cmp-sec cmp-b-dark" aria-labelledby="b-visit">
        <div className="cmp-wrap cmp-b-visit">
          <div>
            <p className="cmp-eyebrow">Come say hello</p>
            <h2 id="b-visit" className="cmp-h2">Come meet us next door to Home Depot.</h2>
            <dl>
              <div><dt>Showroom</dt><dd><a className="ul-link" href={mapsUrlOf(s)} target="_blank" rel="noopener noreferrer">{addressOf(s)}</a></dd></div>
              <div><dt>Hours</dt><dd>{s.hours.map((h) => `${h.days}: ${h.time}`).join(" · ")}</dd></div>
              <div><dt>Phone</dt><dd><a className="ul-link" href={`tel:${s.phoneTel}`}>{s.phoneDisplay}</a></dd></div>
            </dl>
            <div style={{ marginTop: 32 }}><CtaPair /></div>
          </div>
          <div className="cmp-b-img"><Photo src={PHOTO.csMountain} alt="A Cal Spas hot tub on a stone patio with a waterfall and mountains behind" sizes="(max-width: 1000px) 100vw, 45vw" /></div>
        </div>
      </section>
    </CompShell>
  );
}

export async function BHotTubs() {
  return (
    <CompShell v="b">
      <section className="cmp-b-hero" aria-labelledby="b-ht-h1">
        <div className="cmp-wrap cmp-b-hero-grid">
          <div>
            <p className="cmp-eyebrow">Hot tubs · Official Cal Spas dealer</p>
            <h1 id="b-ht-h1" className="cmp-b-h1">The winter soak, <em>every night.</em></h1>
            <p className="cmp-b-sub">January in the valley is made for this. Sit in a running Cal Spas tub at the showroom before you decide, then let us deliver, set up and show you how to care for it.</p>
            <CtaPair />
          </div>
          <div className="cmp-b-photo">
            <div className="cmp-b-img" style={{ aspectRatio: "4 / 3" }}><Photo src={PHOTO.csPlatinum} alt="A Cal Spas Platinum hot tub on a garden patio" pos="58% 50%" eager sizes="(max-width: 1000px) 100vw, 55vw" /></div>
            <div className="cmp-b-note"><b>Try one first</b><span>Models filled and running in the showroom. Bring a swimsuit if you like.</span></div>
          </div>
        </div>
      </section>

      <section className="cmp-sec cmp-b-story" aria-labelledby="b-ht-why">
        <div className="cmp-wrap">
          <p className="cmp-eyebrow">Why buy here</p>
          <h2 id="b-ht-why" className="cmp-h2" style={{ maxWidth: "20ch" }}>The tub is half of it. The rest is us.</h2>
          <p className="cmp-lead">A hot tub is a ten-year decision. Buy it from people who&apos;ll still pick up the phone in year eight.</p>
          <div className="cmp-b-how">
            {WHY_HERE.map((w, i) => <Reveal key={w.title}><div><small>0{i + 1}</small><h3>{w.title}</h3><p>{w.body}</p></div></Reveal>)}
          </div>
        </div>
      </section>

      <section className="cmp-sec" aria-labelledby="b-ht-types">
        <div className="cmp-wrap">
          <p className="cmp-eyebrow">Cal Spas</p>
          <h2 id="b-ht-types" className="cmp-h2">A tub for every backyard.</h2>
          <p className="cmp-lead">We&apos;ll help you match seats, jets and size to how you&apos;ll actually use it.</p>
          <div className="cmp-b-types">
            {TUB_TYPES.map((t) => (
              <Reveal key={t.name}>
                <article className="cmp-b-type">
                  <div className="cmp-b-type-ph"><Photo src={t.image} alt={`A Cal Spas ${t.name.toLowerCase()} on a patio`} pos={t.pos} sizes="(max-width: 1000px) 100vw, 33vw" /></div>
                  <div className="cmp-b-type-b"><small>{t.tag}</small><h3>{t.name}</h3><p>{t.body}</p><p className="seats">{t.seats}</p></div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Arrivals v="b" title="Pre-owned, inspected and ready." lead="Trade-ins come back through our shop, get inspected and repaired, and go on the floor. Delivered like a new tub." />

      <section className="cmp-sec" style={{ background: "var(--paper-2)" }} aria-labelledby="b-ht-year">
        <div className="cmp-wrap">
          <p className="cmp-eyebrow">After you buy</p>
          <h2 id="b-ht-year" className="cmp-h2">Service from the people who installed it.</h2>
          <ol className="cmp-b-steps">
            {[
              { when: "Before you buy", title: "Try it", body: "Models filled and running in the showroom." },
              { when: "Delivery day", title: "Delivered and set up", body: "Site prep, pads and electrical planning, delivery, placement and start-up." },
              { when: "The first week", title: "Orientation", body: "Water care, filters and settings, so it stays easy." },
              { when: "Every season", title: "Serviced by us", body: "Start-ups, repairs and winterizing, from the same crew." },
            ].map((x) => <li key={x.title}><small>{x.when}</small><h3>{x.title}</h3><p>{x.body}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="cmp-sec cmp-b-dark" aria-labelledby="b-ht-end">
        <div className="cmp-wrap" style={{ textAlign: "center" }}>
          <h2 id="b-ht-end" className="cmp-h2" style={{ margin: "0 auto" }}>Come sit in one.</h2>
          <p className="cmp-lead" style={{ margin: "16px auto 0" }}>The fastest way to choose a tub is to try a few. Book a time and we&apos;ll have them warm. Not ready? Get the winter hot tub care guide in the note.</p>
          <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}><CtaPair /></div>
        </div>
      </section>
    </CompShell>
  );
}
