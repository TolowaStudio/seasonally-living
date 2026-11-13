"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { NAV_GROUPS, NAV_LINKS, site, type NavGroup } from "@/lib/site";

export function Wordmark({ size = 18, color }: { size?: number; color?: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 9, lineHeight: 1 }}>
      <span
        className="serif"
        style={{ fontWeight: 600, fontSize: size, letterSpacing: "0.16em", textTransform: "uppercase", color: color || "var(--ink)" }}
      >
        Seasonally
      </span>
      <span style={{ fontSize: size * 0.46, fontWeight: 500, letterSpacing: "0.34em", textTransform: "uppercase", color: "var(--muted)" }}>
        Living
      </span>
    </span>
  );
}

function Mark({ size = 34 }: { size?: number }) {
  // Four quarters: the four seasons, one in the accent colour.
  return (
    <span aria-hidden style={{ width: size, height: size, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, padding: 6, borderRadius: 8, background: "var(--ink)" }}>
      <span style={{ background: "var(--clay)", borderRadius: "6px 1px 1px 1px" }} />
      <span style={{ background: "var(--base)", opacity: 0.85, borderRadius: "1px 6px 1px 1px" }} />
      <span style={{ background: "var(--base)", opacity: 0.85, borderRadius: "1px 1px 1px 6px" }} />
      <span style={{ background: "var(--base)", opacity: 0.85, borderRadius: "1px 1px 6px 1px" }} />
    </span>
  );
}

function Dropdown({ group, pathname, color }: { group: NavGroup; pathname: string; color: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = group.items.some((i) => pathname === i.href);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="nav-dd"
      onMouseLeave={() => setOpen(false)}
      style={{ position: "relative" }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: "10px 0",
          fontSize: 14.5, fontWeight: 500, color: active ? "var(--clay)" : color,
        }}
      >
        {group.label}
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s var(--ease)" }}>
          <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
      <div className="nav-dd-panel" data-open={open} role="menu">
        {group.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            role="menuitem"
            onClick={(e) => {
              setOpen(false);
              e.currentTarget.blur();
            }}
            className="nav-dd-item"
            aria-current={pathname === item.href ? "page" : undefined}
          >
            <span className="nav-dd-label">{item.label}</span>
            {item.note && <span className="nav-dd-note">{item.note}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || !isHome || open;
  const overPhoto = !solid;
  const linkColor = overPhoto ? "#fff" : "var(--ink)";

  return (
    <>
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "var(--nav-h)",
          display: "flex", alignItems: "center",
          background: solid ? "var(--nav-bg)" : "transparent",
          backdropFilter: solid ? "blur(16px) saturate(1.1)" : "none",
          WebkitBackdropFilter: solid ? "blur(16px) saturate(1.1)" : "none",
          borderBottom: `1px solid ${solid ? "var(--line)" : "transparent"}`,
          transition: "background .35s var(--ease), border-color .35s var(--ease)",
        }}
      >
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 20 }}>
          <Link href="/" onClick={() => setOpen(false)} style={{ display: "inline-flex", alignItems: "center", gap: 12 }} aria-label={`${site.name} home`}>
            <Mark />
            <Wordmark color={overPhoto ? "#fff" : undefined} />
          </Link>

          <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 28 }} aria-label="Main navigation">
            {NAV_GROUPS.map((g) => (
              <Dropdown key={g.label} group={g} pathname={pathname} color={linkColor} />
            ))}
            {NAV_LINKS.filter((l) => l.href !== "/visit").map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="ul-link"
                style={{ fontSize: 14.5, fontWeight: 500, color: pathname === item.href ? "var(--clay)" : linkColor, paddingBottom: 2 }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link href="/visit#book" className="btn btn-primary nav-book" style={{ padding: "12px 20px", fontSize: 14 }}>
              Book a visit
            </Link>
            <button
              className="nav-burger"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              style={{ display: "none", background: "none", border: "none", color: linkColor, padding: 6 }}
            >
              <Icon name={open ? "x" : "menu"} size={26} />
            </button>
          </div>
        </div>
      </header>

      <div
        aria-hidden={!open}
        style={{
          position: "fixed", inset: 0, zIndex: 49, background: "var(--paper)",
          transform: open ? "translateY(0)" : "translateY(-100%)",
          visibility: open ? "visible" : "hidden",
          transition: "transform .4s var(--ease), visibility .4s",
          padding: "calc(var(--nav-h) + 20px) 24px 40px",
          overflowY: "auto",
        }}
      >
        <Link href="/" onClick={() => setOpen(false)} className="serif" style={{ fontSize: 26, fontWeight: 500, display: "block", padding: "8px 0", color: pathname === "/" ? "var(--clay)" : "var(--ink)" }}>
          Home
        </Link>
        {NAV_GROUPS.map((g) => (
          <div key={g.label} style={{ borderTop: "1px solid var(--line)", padding: "14px 0 6px" }}>
            <p className="eyebrow" style={{ marginBottom: 6 }}>{g.label}</p>
            {g.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{ display: "block", padding: "8px 0", fontSize: 18, fontWeight: 500, color: pathname === item.href ? "var(--clay)" : "var(--ink)" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 10 }}>
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="serif"
              style={{ display: "block", padding: "8px 0", fontSize: 24, fontWeight: 500, color: pathname === item.href ? "var(--clay)" : "var(--ink)" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link href="/visit#book" onClick={() => setOpen(false)} className="btn btn-primary btn-lg" style={{ marginTop: 22, justifyContent: "center", width: "100%" }}>
          Book a visit
        </Link>
        <a href={`tel:${site.phoneTel}`} className="btn btn-outline btn-lg" style={{ marginTop: 10, justifyContent: "center", width: "100%" }}>
          <Icon name="phone" size={18} /> {site.phoneDisplay}
        </a>
      </div>
    </>
  );
}
