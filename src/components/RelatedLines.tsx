import Link from "next/link";
import Icon from "./Icon";
import { NAV_GROUPS } from "@/lib/site";

/** "Explore the rest of the home resort": every other line, so no page is a dead end. */
export default function RelatedLines({ current }: { current: string }) {
  const links = NAV_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label }))).filter((l) => l.href !== current);
  return (
    <section className="section-sm">
      <div className="wrap">
        <span className="kicker">Explore the home resort</span>
        <div className="line-grid" style={{ marginTop: 26, gap: 0 }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="related-link"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "18px 4px", borderTop: "1px solid var(--line)" }}
            >
              <span>
                <span className="tiny" style={{ color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 600 }}>{l.group}</span>
                <span style={{ display: "block", fontWeight: 600, marginTop: 2 }}>{l.label}</span>
              </span>
              <Icon name="arrow" size={16} style={{ color: "var(--clay)", flex: "0 0 auto" }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
