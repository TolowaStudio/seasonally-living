import Link from "next/link";
import Icon from "./Icon";
import { Logo } from "./Nav";
import NoteForm from "./NoteForm";
import { addressOf, mapsUrlOf } from "@/lib/site";
import { AREAS } from "@/content/areas";
import type { SiteSettings } from "@/content/types";

export default function Footer({ settings: s }: { settings: SiteSettings }) {
  return (
    <footer style={{ background: "var(--band)", color: "#f0ede8", paddingTop: 88, paddingBottom: 40 }} data-theme="alpine">
      <div className="wrap">
        <div className="split" style={{ alignItems: "start", paddingBottom: 64, borderBottom: "1px solid var(--line)" }}>
          <div>
            <span className="kicker">The Seasonally Living note</span>
            <h2 className="h-lg" style={{ marginTop: 18, maxWidth: "18ch" }}>
              One useful note a month. Never a blast.
            </h2>
            <p className="body-muted" style={{ marginTop: 14, maxWidth: "46ch" }}>
              Winter hot tub care, pre-owned arrivals, fireplace tips for burn-ban season and spring pool planning.
              Pick what you care about.
            </p>
            <Link href="/note" className="small ul-link" style={{ display: "inline-block", marginTop: 14, color: "var(--clay)" }}>
              See every topic →
            </Link>
          </div>
          <NoteForm compact label="Monthly note sign-up, footer" />
        </div>

        <div className="footer-cols" style={{ display: "grid", gridTemplateColumns: `1.3fr ${"1fr ".repeat(s.navGroups.length)}1.1fr`, gap: 36, paddingTop: 56 }}>
          <div>
            <Logo id={s.logo} height={96} alt={s.legalName} />
            <p className="small body-muted" style={{ marginTop: 18, maxWidth: "30ch" }}>
              {s.legalName}. Family-owned by {s.owners} since {s.founded}. Showroom open since {s.showroomOpened}.
            </p>
          </div>
          {s.navGroups.map((g) => (
            <div key={g.label}>
              <p className="eyebrow muted" style={{ marginBottom: 16 }}>{g.label}</p>
              <ul style={{ listStyle: "none", display: "grid", gap: 10 }}>
                {g.items.map((n) => (
                  <li key={n.href}>
                    <Link className="ul-link small" href={n.href}>{n.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="eyebrow muted" style={{ marginBottom: 16 }}>Company</p>
            <ul style={{ listStyle: "none", display: "grid", gap: 10, marginBottom: 28 }}>
              {s.navLinks.map((n) => (
                <li key={n.href}>
                  <Link className="ul-link small" href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
            <p className="eyebrow muted" style={{ marginBottom: 16 }}>Showroom</p>
            <a className="small ul-link" href={mapsUrlOf(s)} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
              {addressOf(s)}
            </a>
            <p className="small body-muted" style={{ marginTop: 6 }}>{s.address.note}</p>
            {s.hours.map((h) => (
              <p key={h.days} className="small body-muted" style={{ marginTop: 6 }}>
                {h.days}: {h.time}
              </p>
            ))}
            <a className="small ul-link" href={`tel:${s.phoneTel}`} style={{ display: "inline-flex", gap: 8, alignItems: "center", marginTop: 14 }}>
              <Icon name="phone" size={15} /> {s.phoneDisplay}
            </a>
            <br />
            <a className="small ul-link" href={`mailto:${s.email}`} style={{ display: "inline-flex", gap: 8, alignItems: "center", marginTop: 8 }}>
              <Icon name="mail" size={15} /> {s.email}
            </a>
            <br />
            <Link className="small ul-link" href="/visit#book" style={{ display: "inline-flex", gap: 8, alignItems: "center", marginTop: 8, color: "var(--clay)" }}>
              Book a visit <Icon name="arrow" size={15} />
            </Link>
          </div>
        </div>
        <p className="small body-muted" style={{ marginTop: 48 }}>
          <Link className="ul-link" href="/areas">Serving</Link>{" "}
          {AREAS.map((a, i) => (
            <span key={a.slug}>
              <Link className="ul-link" href={`/areas/${a.slug}`}>{a.label}</Link>
              {i < AREAS.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
        <p className="tiny" style={{ marginTop: 20, color: "var(--muted)" }}>
          © {new Date().getFullYear()} {s.legalName}. Stûv and Cal Spas are trademarks of their respective owners.
        </p>
      </div>
    </footer>
  );
}
