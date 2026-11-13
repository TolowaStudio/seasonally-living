import Link from "next/link";
import Icon from "./Icon";
import { Wordmark } from "./Nav";
import NoteForm from "./NoteForm";
import { NAV_GROUPS, NAV_LINKS, site, addressBlock, mapsUrl } from "@/lib/site";

export default function Footer() {
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
              Fireplace tips for burn-ban season, winter hot tub care, pre-owned arrivals, and spring pool planning.
              Pick what you care about.
            </p>
            <Link href="/note" className="small ul-link" style={{ display: "inline-block", marginTop: 14, color: "var(--clay)" }}>
              See every topic →
            </Link>
          </div>
          <NoteForm compact />
        </div>

        <div className="footer-cols" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr 1.1fr", gap: 36, paddingTop: 56 }}>
          <div>
            <Wordmark color="#f0ede8" />
            <p className="small body-muted" style={{ marginTop: 18, maxWidth: "30ch" }}>
              {site.legalName}. Family-owned by {site.owners} since {site.founded}. Showroom open since {site.showroomOpened}.
            </p>
          </div>
          {NAV_GROUPS.map((g) => (
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
              {NAV_LINKS.map((n) => (
                <li key={n.href}>
                  <Link className="ul-link small" href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
            <p className="eyebrow muted" style={{ marginBottom: 16 }}>Showroom</p>
            <a className="small ul-link" href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
              {addressBlock}
            </a>
            <p className="small body-muted" style={{ marginTop: 6 }}>{site.address.note}</p>
            {site.hours.map((h) => (
              <p key={h.days} className="small body-muted" style={{ marginTop: 6 }}>
                {h.days}: {h.time}
              </p>
            ))}
            <a className="small ul-link" href={`tel:${site.phoneTel}`} style={{ display: "inline-flex", gap: 8, alignItems: "center", marginTop: 14 }}>
              <Icon name="phone" size={15} /> {site.phoneDisplay}
            </a>
            <br />
            <a className="small ul-link" href={`mailto:${site.email}`} style={{ display: "inline-flex", gap: 8, alignItems: "center", marginTop: 8 }}>
              <Icon name="mail" size={15} /> {site.email}
            </a>
            <br />
            <Link className="small ul-link" href="/visit#book" style={{ display: "inline-flex", gap: 8, alignItems: "center", marginTop: 8, color: "var(--clay)" }}>
              Book a visit <Icon name="arrow" size={15} />
            </Link>
          </div>
        </div>
        <p className="tiny" style={{ marginTop: 56, color: "var(--faint)" }}>
          © {new Date().getFullYear()} {site.legalName}. Stûv, Cal Spas, Cal Saunas and Cal Flame are trademarks of their respective owners.
        </p>
      </div>
    </footer>
  );
}
