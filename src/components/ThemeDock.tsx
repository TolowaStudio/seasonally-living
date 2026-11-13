"use client";

import { useCallback, useEffect, useState } from "react";

const THEMES = [
  { id: "ember", label: "A · Ember" },
  { id: "alpine", label: "B · Alpine" },
  { id: "linen", label: "C · Linen" },
] as const;

/** Comp switcher for the design review. Hidden unless NEXT_PUBLIC_SHOW_COMPS=1 or ?comps=1. */
export default function ThemeDock({ enabled }: { enabled: boolean }) {
  const [theme, setTheme] = useState("alpine");
  const [show, setShow] = useState(enabled);

  const apply = useCallback((id: string) => {
    setTheme(id);
    document.documentElement.dataset.theme = id;
    try {
      localStorage.setItem("sl-theme", id);
    } catch {}
  }, []);

  useEffect(() => {
    // Read URL/localStorage after hydration (deferred one frame so SSR markup matches).
    const raf = requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      let initial = params.get("theme");
      try {
        initial = initial || localStorage.getItem("sl-theme");
      } catch {}
      if (params.get("comps") === "1") setShow(true);
      if (initial && THEMES.some((t) => t.id === initial)) apply(initial);
    });
    return () => cancelAnimationFrame(raf);
  }, [apply]);

  if (!show) return null;
  return (
    <div className="theme-dock" role="group" aria-label="Design comps">
      {THEMES.map((t) => (
        <button key={t.id} aria-pressed={theme === t.id} onClick={() => apply(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
