"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { NAV, site } from "@/lib/site";

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
  // Four quarters: the four seasons, one in fire colour.
  return (
    <span aria-hidden style={{ width: size, height: size, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, padding: 6, borderRadius: 8, background: "var(--ink)" }}>
      <span style={{ background: "var(--clay)", borderRadius: "6px 1px 1px 1px" }} />
      <span style={{ background: "var(--base)", opacity: 0.85, borderRadius: "1px 6px 1px 1px" }} />
      <span style={{ background: "var(--base)", opacity: 0.85, borderRadius: "1px 1px 1px 6px" }} />
      <span style={{ background: "var(--base)", opacity: 0.85, borderRadius: "1px 1px 6px 1px" }} />
    </span>
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

          <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 26 }} aria-label="Main navigation">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="ul-link"
                  style={{ fontSize: 14, fontWeight: 500, color: active ? "var(--clay)" : overPhoto ? "#fff" : "var(--ink)", paddingBottom: 2 }}
                >
                  {item.label}
                </Link>
              );
            })}
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
              style={{ display: "none", background: "none", border: "none", color: overPhoto ? "#fff" : "var(--ink)", padding: 6 }}
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
          padding: "calc(var(--nav-h) + 24px) 24px 40px",
          display: "flex", flexDirection: "column", gap: 4, overflowY: "auto",
        }}
      >
        {[{ href: "/", label: "Home" }, ...NAV].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="serif"
            style={{ fontSize: 28, fontWeight: 500, padding: "12px 0", color: pathname === item.href ? "var(--clay)" : "var(--ink)", borderBottom: "1px solid var(--line)", display: "block" }}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/visit#book" onClick={() => setOpen(false)} className="btn btn-primary btn-lg" style={{ marginTop: 24, justifyContent: "center" }}>
          Book a visit
        </Link>
        <a href={`tel:${site.phoneTel}`} className="btn btn-outline btn-lg" style={{ marginTop: 10, justifyContent: "center" }}>
          <Icon name="phone" size={18} /> {site.phoneDisplay}
        </a>
      </div>
    </>
  );
}
