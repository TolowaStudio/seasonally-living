import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Nav";
import Reveal from "@/components/RevealWrapper";
import { getPreOwnedSpas, getSettings } from "@/lib/sanity";
import { addressOf, mapsUrlOf } from "@/lib/site";
import { COMPS, CREDENTIALS, type V } from "./data";

export { Reveal };

/** Responsive Cloudinary photo that fills its (relatively positioned) parent. */
export function Photo({ src, alt, sizes = "100vw", pos, eager, className, style }: { src: string; alt: string; sizes?: string; pos?: string; eager?: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      style={{ objectFit: "cover", objectPosition: pos, ...style }}
      {...(eager ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
    />
  );
}

/** The two-tier CTA: Book a visit is primary, Get the note is secondary. */
export function CtaPair({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <div className={`cmp-cta ${className}`}>
      <Link href="/visit#book" className="btn btn-primary btn-lg">Book a visit</Link>
      <Link href="/note" className={`btn btn-lg ${light ? "cmp-btn-onphoto" : "btn-outline"}`}>Get the note</Link>
    </div>
  );
}

export async function CompShell({ v, children }: { v: V; children: React.ReactNode }) {
  const s = await getSettings();
  const c = COMPS[v];
  const tubs = `/comps/${v}/hot-tubs`;
  const nav = [
    { href: tubs, label: "Hot tubs & swim spas" },
    { href: "/pools", label: "Pools" },
    { href: "/pre-owned", label: "Pre-owned" },
    { href: "/fireplaces", label: "Hearth & venting" },
    { href: "/about", label: "Our story" },
  ];
  return (
    <div className={`cmp cmp-${v}`}>
      <header className="cmp-head">
        <div className="cmp-wrap cmp-head-in">
          <Link href={`/comps/${v}`} className="cmp-logo" aria-label={`${s.name} home (comp ${c.letter})`}>
            <Logo id={s.logo} height={56} alt={s.legalName} />
          </Link>
          <nav className="cmp-nav" aria-label="Main">
            {nav.map((n) => <Link key={n.href} href={n.href} className="ul-link">{n.label}</Link>)}
          </nav>
          <div className="cmp-head-cta">
            <a className="cmp-phone" href={`tel:${s.phoneTel}`}>{s.phoneDisplay}</a>
            <Link href="/visit#book" className="btn btn-primary cmp-book">Book a visit</Link>
          </div>
          <details className="cmp-menu">
            <summary aria-label="Menu"><span /><span /></summary>
            <div className="cmp-menu-panel">
              {nav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
              <Link href="/note">Get the note</Link>
              <Link href="/visit#book" className="btn btn-primary">Book a visit</Link>
            </div>
          </details>
        </div>
      </header>

      <main id="comp-main">{children}</main>

      <footer className="cmp-foot">
        <div className="cmp-wrap">
          <div className="cmp-foot-grid">
            <div>
              <Logo id={s.logo} height={72} alt={s.legalName} />
              <p className="cmp-foot-p">{s.legalName}. Family-owned by {s.owners} since {s.founded}. Showroom open since {s.showroomOpened}.</p>
            </div>
            <div>
              <h2 className="cmp-foot-h">Visit</h2>
              <a href={mapsUrlOf(s)} target="_blank" rel="noopener noreferrer" className="ul-link">{addressOf(s)}</a>
              <p className="cmp-foot-p">{s.address.note}</p>
              {s.hours.map((h) => <p key={h.days} className="cmp-foot-p">{h.days}: {h.time}</p>)}
            </div>
            <div>
              <h2 className="cmp-foot-h">Shop</h2>
              <ul>
                {nav.slice(0, 4).map((n) => <li key={n.href}><Link href={n.href} className="ul-link">{n.label}</Link></li>)}
                <li><Link href="/spa-care" className="ul-link">Pool & spa care</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="cmp-foot-h">Talk to us</h2>
              <ul>
                <li><a className="ul-link" href={`tel:${s.phoneTel}`}>{s.phoneDisplay}</a></li>
                <li><a className="ul-link" href={`mailto:${s.email}`}>{s.email}</a></li>
                <li><Link className="ul-link" href="/note">The monthly note</Link></li>
              </ul>
              <Link href="/visit#book" className="btn btn-primary cmp-foot-btn">Book a visit</Link>
            </div>
          </div>
          <p className="cmp-foot-legal">© {new Date().getFullYear()} {s.legalName}. Stûv and Cal Spas are trademarks of their respective owners.</p>
        </div>
      </footer>

      <CompBar v={v} />
    </div>
  );
}

/** Floating "which comp am I in" pill so Jeramey can flip between directions. Not part of the design. */
function CompBar({ v }: { v: V }) {
  const c = COMPS[v];
  return (
    <nav className="cmp-bar" aria-label="Design comps">
      <Link href="/comps">All comps</Link>
      <span aria-hidden>·</span>
      <strong>Comp {c.letter}</strong>
      <Link href={`/comps/${v}`}>Home</Link>
      <Link href={`/comps/${v}/hot-tubs`}>Hot tubs</Link>
    </nav>
  );
}

/** Pre-owned arrivals. Real listings once the shop posts them; clearly-labelled placeholders until then. */
export async function Arrivals({ v, title = "Just arrived", lead = "Trade-ins, inspected and repaired in our own shop. Call for price." }: { v: V; title?: string; lead?: string }) {
  const spas = (await getPreOwnedSpas()).slice(0, 4);
  return (
    <section className="cmp-sec cmp-arrivals" aria-labelledby={`arr-${v}`}>
      <div className="cmp-wrap">
        <div className="cmp-sechead">
          <div>
            <p className="cmp-eyebrow">Pre-owned</p>
            <h2 id={`arr-${v}`} className="cmp-h2">{title}</h2>
            <p className="cmp-lead">{lead}</p>
          </div>
          <Link href="/pre-owned" className="cmp-more">See every pre-owned spa <span aria-hidden>→</span></Link>
        </div>
        <ul className="cmp-strip" tabIndex={0} aria-label="Pre-owned arrivals">
          {spas.length > 0
            ? spas.map((s) => (
                <li key={s.slug}>
                  <Link href={`/pre-owned/${s.slug}`} className="cmp-spa">
                    <div className="cmp-spa-ph">{s.photos?.[0] && <Photo src={s.photos[0].image} alt={s.photos[0].alt || s.title} sizes="(max-width: 700px) 70vw, 25vw" />}</div>
                    <p className="cmp-spa-t">{s.title}</p>
                    <p className="cmp-spa-s">{[s.seats && `${s.seats} seats`, "Call for price"].filter(Boolean).join(" · ")}</p>
                  </Link>
                </li>
              ))
            : [0, 1, 2, 3].map((i) => (
                <li key={i}>
                  <div className="cmp-spa cmp-spa-empty">
                    <div className="cmp-spa-ph"><span className="cmp-tag">Placeholder</span></div>
                    <p className="cmp-spa-t">{["Next arrival", "On the shop floor", "Being inspected", "Just traded in"][i]}</p>
                    <p className="cmp-spa-s">Photo and specs post here the day a spa clears inspection. Call for price.</p>
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
}

/** Credentials are facts; the review block is an explicit placeholder (no invented reviews). */
export function Proof({ v }: { v: V }) {
  return (
    <section className="cmp-sec cmp-proof" aria-labelledby={`proof-${v}`}>
      <div className="cmp-wrap">
        <p className="cmp-eyebrow">Why people stay with us</p>
        <h2 id={`proof-${v}`} className="cmp-h2">Forty-seven years in one valley.</h2>
        <ul className="cmp-creds">{CREDENTIALS.map((c) => <li key={c}>{c}</li>)}</ul>
        <div className="cmp-review-ph">
          <span className="cmp-tag">Placeholder</span>
          <p>Neighbors&apos; reviews go here. The Google profile is being claimed (TOL-2908); once it is, real reviews appear with names and dates. No quotes are shown until then.</p>
        </div>
      </div>
    </section>
  );
}
