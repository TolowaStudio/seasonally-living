import Link from "next/link";
import Icon from "./Icon";
import { Wordmark } from "./Nav";
import NoteForm from "./NoteForm";
import { NAV, site, addressBlock, mapsUrl } from "@/lib/site";

export default function Footer() {
  return (
    <footer style={{ background: "var(--band)", color: "#f0ede8", paddingTop: 88, paddingBottom: 40 }} data-theme="ember">
      <div className="wrap">
        <div className="split" style={{ alignItems: "start", paddingBottom: 64, borderBottom: "1px solid var(--line)" }}>
          <div>
            <span className="kicker">The Seasonally Living note</span>
            <h2 className="h-lg" style={{ marginTop: 18, maxWidth: "18ch" }}>
              One useful note a month. Never a blast.
            </h2>
            <p className="body-muted" style={{ marginTop: 14, maxWidth: "46ch" }}>
              Burn-ban-ready fireplace tips, winter hot tub care, first look at certified pre-owned spas, and
              spring pool planning. Pick what you care about.
            </p>
          </div>
          <NoteForm compact />
        </div>

        <div className="footer-cols" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 40, paddingTop: 56 }}>
          <div>
            <Wordmark color="#f0ede8" />
            <p className="small body-muted" style={{ marginTop: 18, maxWidth: "32ch" }}>
              {site.legalName}. Fireplaces, venting, hot tubs, swim spas and pools for North Central Washington.
            </p>
          </div>
          <div>
            <p className="eyebrow muted" style={{ marginBottom: 16 }}>Explore</p>
            <ul style={{ listStyle: "none", display: "grid", gap: 10 }}>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link className="ul-link small" href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
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
          </div>
          <div>
            <p className="eyebrow muted" style={{ marginBottom: 16 }}>Talk to us</p>
            <a className="small ul-link" href={`tel:${site.phoneTel}`} style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <Icon name="phone" size={15} /> {site.phoneDisplay}
            </a>
            <br />
            <a className="small ul-link" href={`mailto:${site.email}`} style={{ display: "inline-flex", gap: 8, alignItems: "center", marginTop: 10 }}>
              <Icon name="mail" size={15} /> {site.email}
            </a>
          </div>
        </div>
        <p className="tiny" style={{ marginTop: 56, color: "var(--faint)" }}>
          © {new Date().getFullYear()} {site.legalName}. Stûv is a trademark of Stûv SA. Cal Spas is a trademark of California Acrylic Industries.
        </p>
      </div>
    </footer>
  );
}
