"use client";

import { useState } from "react";
import Icon from "./Icon";
import { INTERESTS } from "@/lib/interests";

export default function NoteForm({ compact = false, defaultInterest, label = "Get the Seasonally Living note" }: { compact?: boolean; defaultInterest?: string; label?: string }) {
  const [picked, setPicked] = useState<string[]>(defaultInterest ? [defaultInterest] : []);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "note",
          interests: picked,
          name: fd.get("name"),
          email: fd.get("email"),
          optIn: true,
          source: window.location.pathname + window.location.search,
          company: fd.get("company"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="form-status" role="status">
        <p className="h-md">You&apos;re in.</p>
        <p className="body-muted" style={{ marginTop: 8 }}>
          Thanks for signing up. The first note goes out next month.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }} aria-label={label}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {INTERESTS.map((i) => (
          <button
            type="button"
            key={i.id}
            className={`chip${picked.includes(i.id) ? " active" : ""}`}
            aria-pressed={picked.includes(i.id)}
            onClick={() => toggle(i.id)}
            title={i.magnet}
          >
            {i.label}
          </button>
        ))}
      </div>
      <div className="form-row2" style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "1fr 1fr", gap: 12 }}>
        {!compact && <input name="name" className="input" placeholder="First name" autoComplete="given-name" aria-label="First name" />}
        <input name="email" className="input" type="email" required placeholder="Email address" autoComplete="email" aria-label="Email address" />
      </div>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden style={{ position: "absolute", left: -9999 }} />
      <button className="btn btn-primary" type="submit" disabled={status === "sending"} style={{ justifySelf: "start" }}>
        {status === "sending" ? "Sending..." : "Get the note"} <Icon name="arrow" size={16} />
      </button>
      {status === "error" && <p className="small" style={{ color: "#d4573f" }}>That didn&apos;t go through. Please try again or call (509) 667-8833.</p>}
      <p className="tiny" style={{ color: "var(--muted)" }}>Monthly at most. Unsubscribe any time. We never sell your email.</p>
    </form>
  );
}
