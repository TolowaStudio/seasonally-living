"use client";

import { useState } from "react";
import Icon from "./Icon";
import { INTERESTS } from "@/lib/interests";
import { NOTE_CONSENT_TEXT } from "@/lib/consent";
import { getAttribution, trackConversion } from "@/lib/attribution";

// With `guide` set (a /guides/[slug] page) the topic is fixed by the guide and the person gets that guide after confirming.
export default function NoteForm({ compact = false, defaultInterest, guide, guideTitle, submitLabel }: { compact?: boolean; defaultInterest?: string; guide?: string; guideTitle?: string; submitLabel?: string }) {
  const [picked, setPicked] = useState<string[]>(defaultInterest ? [defaultInterest] : []);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [pending, setPending] = useState(true);
  const [error, setError] = useState("");

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "note",
          interests: picked,
          guide,
          attribution: getAttribution(),
          name: fd.get("name"),
          email: fd.get("email"),
          optIn: true,
          source: window.location.pathname + window.location.search,
          company: fd.get("company"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "");
      setPending(data.pending !== false);
      setStatus("sent");
      trackConversion("note_signup", { guide, interests: picked.join(","), source: window.location.pathname });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "");
    }
  }

  if (status === "sent") {
    return (
      <div className="form-status" role="status">
        <p className="h-md">{pending ? "Check your email." : "You\u2019re in."}</p>
        <p className="body-muted" style={{ marginTop: 8 }}>
          {pending
            ? `We sent a link to confirm your address${guideTitle ? `, and your guide is waiting behind it` : ""}. Nothing else arrives until you click it. Check spam if you don\u2019t see it.`
            : "Thanks for signing up. The first note goes out next month."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }} aria-label="Get the Seasonally Living note">
      {!guide && <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
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
      </div>}
      <div className="form-row2" style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "1fr 1fr", gap: 12 }}>
        {!compact && <input name="name" className="input" placeholder="First name" autoComplete="given-name" aria-label="First name" />}
        <input name="email" className="input" type="email" required placeholder="Email address" autoComplete="email" aria-label="Email address" />
      </div>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden style={{ position: "absolute", left: -9999 }} />
      <button className="btn btn-primary" type="submit" disabled={status === "sending"} style={{ justifySelf: "start" }}>
        {status === "sending" ? "Sending..." : submitLabel ?? "Get the note"} <Icon name="arrow" size={16} />
      </button>
      {status === "error" && <p className="small" style={{ color: "#d4573f" }}>{error ? `${error} ` : "That didn\u2019t go through. "}Please try again or call (509) 667-8833.</p>}
      <p className="tiny" style={{ color: "var(--muted)" }}>{NOTE_CONSENT_TEXT} We never sell your email.</p>
    </form>
  );
}
