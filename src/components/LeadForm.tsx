"use client";

import { useState } from "react";
import Icon from "./Icon";
import { INTERESTS } from "@/lib/interests";

type Status = "idle" | "sending" | "sent" | "error";

// `unit` is sent with the lead (title + slug, for the shop); `unitLabel` is what the shopper sees.
export default function LeadForm({ defaultInterest = "hearth", unit, unitLabel }: { defaultInterest?: string; unit?: string; unitLabel?: string }) {
  const [interest, setInterest] = useState(unit ? "pre-owned" : defaultInterest);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

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
          kind: "visit",
          interest: unit ? "pre-owned" : interest,
          unit: unit || undefined,
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          when: fd.get("when"),
          message: fd.get("message"),
          optIn: fd.get("optIn") === "on",
          source: typeof window !== "undefined" ? window.location.pathname + window.location.search : "",
          company: fd.get("company"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "Something went wrong");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "sent") {
    return (
      <div className="form-status" role="status">
        <p className="h-md">{unit ? "Thanks, we\u2019ll be in touch about this spa." : "Thanks, you\u2019re on the calendar list."}</p>
        <p className="body-muted" style={{ marginTop: 8 }}>
          {unit ? "We\u2019ll call or email within one business day with the price and details." : "We\u2019ll call or email within one business day to confirm a time."} Need us sooner? Call (509) 667-8833.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 18 }} aria-label="Book a visit">
      {unit ? (
        <p className="h-md" style={{ fontSize: 20 }}>Asking about: {unitLabel ?? unit}</p>
      ) : (
      <div>
        <span className="field-label">What are you thinking about?</span>
        <div className="tile-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 10 }}>
          {INTERESTS.map((i) => (
            <button
              type="button"
              key={i.id}
              className={`opt-tile${interest === i.id ? " sel" : ""}`}
              aria-pressed={interest === i.id}
              onClick={() => setInterest(i.id)}
              style={{ textAlign: "left", color: "var(--ink)" }}
            >
              <span className="ot-title">{i.label}</span>
            </button>
          ))}
        </div>
      </div>
      )}
      <div className="form-row2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="field">
          <label htmlFor="lf-name">Name <span className="req">*</span></label>
          <input id="lf-name" name="name" className="input" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="lf-phone">Phone</label>
          <input id="lf-phone" name="phone" className="input" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="form-row2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="field">
          <label htmlFor="lf-email">Email <span className="req">*</span></label>
          <input id="lf-email" name="email" className="input" type="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="lf-when">Best time to visit</label>
          <input id="lf-when" name="when" className="input" placeholder="e.g. Saturday morning" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="lf-msg">Anything we should know?</label>
        <textarea id="lf-msg" name="message" className="textarea" placeholder={unit ? "Where the tub would go, a trade-in, questions about this spa..." : "Room size, existing fireplace, where the tub would go..."} />
      </div>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden style={{ position: "absolute", left: -9999 }} />
      <label className="small body-muted" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <input type="checkbox" name="optIn" style={{ marginTop: 5 }} />
        Also send me the monthly Seasonally Living note. Unsubscribe any time.
      </label>
      {status === "error" && <p className="err-msg" style={{ color: "#d4573f" }}>{error}. Please call (509) 667-8833.</p>}
      <button className="btn btn-primary btn-lg" type="submit" disabled={status === "sending"} style={{ justifySelf: "start" }}>
        {status === "sending" ? "Sending..." : unit ? "Ask about this spa" : "Request my visit"} <Icon name="arrow" size={18} />
      </button>
    </form>
  );
}
