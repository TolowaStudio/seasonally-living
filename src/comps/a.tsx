import Link from "next/link";
import { Arrivals, CompShell, CtaPair, Photo, Proof, Reveal } from "./shared";
import { PHOTO, POOL_STEPS, SWIM_MODELS, TUB_TYPES, WHY_HERE } from "./data";

/** Direction A: Four seasons resort. Cinematic, dark, full-bleed. */

function Chapter({ n, season, title, body, image, alt, pos, right, links }: { n: string; season: string; title: string; body: string; image: string; alt: string; pos?: string; right?: boolean; links: { href: string; label: string }[] }) {
  return (
    <section className={`cmp-a-chapter${right ? " right" : ""}`} id={season.toLowerCase()} aria-labelledby={`ch-${n}`}>
      <div className="cmp-a-chbg"><Photo src={image} alt={alt} pos={pos} sizes="100vw" /></div>
      <div className="cmp-wrap">
        <Reveal className="cmp-a-chin">
          <p className="cmp-a-season" data-n={n}>{season}</p>
          <h2 id={`ch-${n}`}>{title}</h2>
          <p>{body}</p>
          <ul className="cmp-a-links">
            {links.map((l) => <li key={l.href}><Link href={l.href}>{l.label} <span aria-hidden>→</span></Link></li>)}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function EndCta({ title, body }: { title: string; body: string }) {
  return (
    <section className="cmp-a-end" aria-labelledby="a-end">
      <div className="cmp-a-endbg"><Photo src={PHOTO.localFallReflection} alt="Golden fall trees reflected in still water in North Central Washington" sizes="100vw" /></div>
      <div className="cmp-wrap">
        <h2 id="a-end">{title}</h2>
        <p>{body}</p>
        <CtaPair light />
      </div>
    </section>
  );
}

export async function AHome() {
  return (
    <CompShell v="a">
      <section className="cmp-a-hero" aria-labelledby="a-h1">
        <div className="cmp-a-bg"><Photo src={PHOTO.hotTubSnow} alt="A hot tub steaming in a snowy forest" pos="50% 60%" eager sizes="100vw" /></div>
        <div className="cmp-a-scrim" aria-hidden />
        <div className="cmp-wrap cmp-a-hero-in">
          <p className="cmp-eyebrow" style={{ color: "var(--clay-soft)", marginBottom: 22 }}>Wenatchee · Family-owned since 1979</p>
          <h1 id="a-h1" className="cmp-a-h1">Your home resort, <em>all four seasons.</em></h1>
          <p className="cmp-a-sub">Soak, swim and fire. Cal Spas hot tubs and swim spas, pools installed by our own crew, and Stûv stoves with the venting done right, from one North Central Washington showroom.</p>
          <CtaPair light />
        </div>
        <nav className="cmp-a-rail" aria-label="Seasons">
          <div className="cmp-wrap">
            <ul>
              {[["01", "Winter", "Soak", "#winter"], ["02", "Spring", "Swim", "#spring"], ["03", "Summer", "Care", "#summer"], ["04", "Fall", "Fire", "#fall"]].map(([n, s, r, h]) => (
                <li key={s}><a href={h}><small>{n} · {s}</small><span>{r}</span></a></li>
              ))}
            </ul>
          </div>
        </nav>
      </section>

      <section className="cmp-a-rituals" aria-label="Soak, swim and fire">
        {[
          { k: "Soak", href: "/comps/a/hot-tubs", img: PHOTO.csMountain, alt: "A Cal Spas hot tub beside a waterfall on a garden patio", pos: "55% 50%", t: "Hot tubs and pre-owned spas, running in the showroom." },
          { k: "Swim", href: "/swim-spas", img: PHOTO.csSwimPro, alt: "A Cal Spas Swim Pro swim spa in a backyard garden", pos: "45% 50%", t: "Swim spas now, and pools built by our own crew." },
          { k: "Fire", href: "/fireplaces", img: PHOTO.stoveMinimal, alt: "A modern wood stove burning in a bright living room", pos: "50% 50%", t: "Stûv, Kuma, Morsø and Napoleon, vented right." },
        ].map((r) => (
          <Link key={r.k} href={r.href} className="cmp-a-ritual">
            <Photo src={r.img} alt={r.alt} pos={r.pos} sizes="(max-width: 940px) 100vw, 33vw" />
            <div className="cmp-a-ritual-t"><small>The ritual</small><h2>{r.k}</h2><p>{r.t}</p></div>
          </Link>
        ))}
      </section>

      <Chapter n="01" season="Winter" title="The winter soak, every night." body="January in the valley is made for this. Sit in a running Cal Spas tub at the showroom before you decide, then let us deliver, set up and show you how to care for it."
        image={PHOTO.underglow} alt="A Cal Spas hot tub glowing with underglow lighting on a patio at night" pos="12% 55%"
        links={[{ href: "/comps/a/hot-tubs", label: "Cal Spas hot tubs" }, { href: "/pre-owned", label: "Pre-owned spas" }, { href: "/swim-spas", label: "Swim spas" }]} />

      <Arrivals v="a" />

      <Chapter n="02" season="Spring" right title="Swim spas and pool openings." body="A swim spa gives you a current to swim against and a place to soak. Dry consults happen over the winter; wet tests run April through September."
        image={PHOTO.localLupine} alt="Purple lupine and yellow balsamroot in bloom below a mountain" pos="50% 60%"
        links={[{ href: "/swim-spas", label: "Swim Pro and Swim Pro X" }, { href: "/spa-care", label: "Pool & spa care" }]} />

      <section className="cmp-sec cmp-a-pools" aria-labelledby="a-pools">
        <div className="cmp-a-poolbg"><Photo src={PHOTO.poolNight} alt="" sizes="100vw" /></div>
        <div className="cmp-wrap">
          <p className="cmp-eyebrow">Swimming pools · A project, not a product</p>
          <h2 id="a-pools" className="cmp-h2" style={{ maxWidth: "16ch" }}>Plan in winter. Swim by summer.</h2>
          <p className="cmp-lead">Pools are installed by our own crew, from the first consult to the first swim. Spring 2027 install slots are limited; getting on the list now holds your place in the design queue.</p>
          <ol className="cmp-a-timeline">
            {POOL_STEPS.map((s) => (
              <li key={s.title}><small>{s.when}</small><h3>{s.title}</h3><p>{s.body}</p></li>
            ))}
          </ol>
          <div style={{ marginTop: 40 }}><Link href="/pools" className="btn btn-primary btn-lg">Join the spring install list</Link></div>
        </div>
      </section>

      <Chapter n="03" season="Summer" title="Clear water. Easy summers." body="Chemicals, filters and supplies at the showroom counter, deliveries and pre-owned trade-ins. Thinking of trading up? Your old tub is worth something, and we haul it away."
        image={PHOTO.poolBlueHour} alt="A modern home with a swimming pool at blue hour" pos="50% 55%"
        links={[{ href: "/spa-care", label: "Pool & spa chemicals" }, { href: "/pre-owned/sell", label: "Sell or trade in your tub" }]} />

      <Chapter n="04" season="Fall" right title="Burn prep, before the first cold night." body="We started as Chim Chimney in 1979 and venting is still the heart of the trade. We design and install the venting for every stove and insert we sell, and inspect the venting you already have."
        image={PHOTO.stoveLiving} alt="A freestanding wood stove in a bright, modern living room" pos="50% 50%"
        links={[{ href: "/fireplaces/stuv", label: "Stûv" }, { href: "/fireplaces/kuma", label: "Kuma" }, { href: "/fireplaces/morso", label: "Morsø" }, { href: "/fireplaces/napoleon", label: "Napoleon gas & electric" }, { href: "/service", label: "Venting design and inspections" }]} />

      <Proof v="a" />
      <EndCta title="Come sit in the water. Or by the fire." body="Tubs filled, stoves burning, no pressure. Tuesday to Saturday, 10 to 4, next to Home Depot in Wenatchee." />
    </CompShell>
  );
}

export async function AHotTubs() {
  return (
    <CompShell v="a">
      <section className="cmp-a-hero" style={{ minHeight: "88svh" }} aria-labelledby="a-ht-h1">
        <div className="cmp-a-bg"><Photo src={PHOTO.underglow} alt="A Cal Spas hot tub glowing with underglow lighting on a patio at night" pos="50% 55%" eager sizes="100vw" /></div>
        <div className="cmp-a-scrim" aria-hidden />
        <div className="cmp-wrap cmp-a-hero-in" style={{ paddingBottom: "clamp(64px, 10vh, 110px)" }}>
          <p className="cmp-eyebrow" style={{ color: "var(--clay-soft)", marginBottom: 22 }}>Hot tubs · Official Cal Spas dealer</p>
          <h1 id="a-ht-h1" className="cmp-a-h1">The winter soak, <em>every night.</em></h1>
          <p className="cmp-a-sub">January in the valley is made for this. Sit in a running Cal Spas tub at the showroom before you decide, then let us deliver, set up and show you how to care for it.</p>
          <CtaPair light />
        </div>
      </section>

      <section className="cmp-sec" aria-labelledby="a-ht-why">
        <div className="cmp-wrap">
          <p className="cmp-eyebrow">Why buy here</p>
          <h2 id="a-ht-why" className="cmp-h2" style={{ maxWidth: "18ch" }}>The tub is half of it. The rest is us.</h2>
          <p className="cmp-lead">A hot tub is a ten-year decision. Buy it from people who&apos;ll still pick up the phone in year eight.</p>
          <div className="cmp-a-3">
            {WHY_HERE.map((w, i) => (
              <div key={w.title}><small>0{i + 1}</small><h3 style={{ marginTop: 10 }}>{w.title}</h3><p>{w.body}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="cmp-a-types" aria-label="Cal Spas tub types">
        {TUB_TYPES.map((t) => (
          <article key={t.name} className="cmp-a-type">
            <div className="cmp-a-type-ph"><Photo src={t.image} alt={`A Cal Spas ${t.name.toLowerCase()} on a patio`} pos={t.pos} sizes="(max-width: 940px) 100vw, 50vw" /></div>
            <Reveal className="cmp-a-type-t">
              <p className="cmp-eyebrow">{t.tag} · {t.seats}</p>
              <h3>{t.name}</h3>
              <p>{t.body}</p>
              <div style={{ marginTop: 26 }}><Link href="/visit?interest=hot-tub#book" className="btn btn-outline">Try one in the showroom</Link></div>
            </Reveal>
          </article>
        ))}
      </section>

      <section className="cmp-a-types" aria-label="Swim spas">
        <article className="cmp-a-type" style={{ background: "var(--band)" }}>
          <Reveal className="cmp-a-type-t">
            <p className="cmp-eyebrow">Also in the showroom</p>
            <h2 id="a-ht-swim" style={{ fontSize: "clamp(34px, 4vw, 56px)", letterSpacing: "-.035em", lineHeight: 0.98, marginTop: 12 }}>Swim all year. In the backyard.</h2>
            <p>{SWIM_MODELS.map((m) => `${m.name}: ${m.body}`).join(" ")}</p>
            <div style={{ marginTop: 26 }}><Link href="/swim-spas" className="btn btn-outline">See the swim spas</Link></div>
          </Reveal>
          <div className="cmp-a-type-ph"><Photo src={PHOTO.swimProX} alt="A Cal Spas Swim Pro X swim spa on a lawn beside a house" pos="50% 50%" sizes="(max-width: 940px) 100vw, 50vw" /></div>
        </article>
      </section>

      <Arrivals v="a" title="Pre-owned, inspected and ready." lead="Trade-ins come back through our shop, get inspected and repaired, and go on the floor. Delivered like a new tub." />

      <section className="cmp-sec" style={{ background: "var(--paper-2)" }} aria-labelledby="a-ht-year">
        <div className="cmp-wrap">
          <p className="cmp-eyebrow">Your first year</p>
          <h2 id="a-ht-year" className="cmp-h2">We&apos;re with you every season.</h2>
          <ol className="cmp-a-timeline">
            {[
              { when: "Before you buy", title: "Try it", body: "Models filled and running in the showroom." },
              { when: "Delivery day", title: "Delivered and set up", body: "Site prep, pads and electrical planning, delivery, placement and start-up." },
              { when: "The first week", title: "Orientation", body: "Water care, filters and settings, so it stays easy." },
              { when: "Every season", title: "Serviced by us", body: "Start-ups, repairs and winterizing from the people who installed it." },
            ].map((s) => <li key={s.title}><small>{s.when}</small><h3>{s.title}</h3><p>{s.body}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="cmp-a-end" aria-labelledby="a-ht-end">
        <div className="cmp-a-endbg"><Photo src={PHOTO.hotTubSnow} alt="A hot tub steaming in a snowy forest" sizes="100vw" /></div>
        <div className="cmp-wrap">
          <h2 id="a-ht-end">Come sit in one.</h2>
          <p>The fastest way to choose a tub is to try a few. Book a time and we&apos;ll have them warm. Not ready yet? Get the winter hot tub care guide in the note.</p>
          <CtaPair light />
        </div>
      </section>
    </CompShell>
  );
}
