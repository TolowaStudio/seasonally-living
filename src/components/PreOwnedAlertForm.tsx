"use client";

import { useState } from "react";
import Icon from "./Icon";
import { SEAT_BANDS } from "@/lib/pre-owned-ui";

// "Tell me when a tub like this arrives." Posts to /api/lead as interest "pre-owned-alert";
// seats, budget and notes travel in the message (the lead route is not changed for this).
// The budget answer is for the shop only and is never displayed anywhere on the site.
const BUDGETS = ["Under $3,000", "$3,000 to $5,000", "$5,000 to $8,000", "Over $8,000", "Not sure yet"]; // TODO-confirm bands with Kimberly

export default function PreOwnedAlertForm({ defaultSeats, from }: { defaultSeats?: string; from?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const seats = SEAT_BANDS.find((b) => b.id === fd.get("seats"))?.label ?? "Any";
    const message = [
      `Seats wanted: ${seats}`,
      `Budget: ${String(fd.get("budget") || "-")}`,
      from ? `Looking for one like: ${from}` : "",
      `Notes: ${String(fd.get("notes") || "-").trim() || "-"}`,
    ]
      .filter(Boolean)
      .join("\n");
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "visit",
          interest: "pre-owned-alert",
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          message,
          optIn: false,
          source: window.location.pathname + window.location.search,
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
        <p className="h-md">You&apos;re on the list.</p>
        <p className="body-muted" style={{ marginTop: 8 }}>When a tub like that comes through the shop, we&apos;ll call or email you before it&apos;s posted. Need us sooner? Call (509) 667-8833.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }} aria-label="Tell me when a tub like this arrives">
      <div className="form-row2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="field">
          <label htmlFor="pa-name">Name <span className="req">*</span></label>
          <input id="pa-name" name="name" className="input" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="pa-email">Email <span className="req">*</span></label>
          <input id="pa-email" name="email" className="input" type="email" required autoComplete="email" />
        </div>
      </div>
      <div className="form-row2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="field">
          <label htmlFor="pa-seats">How many seats?</label>
          <select id="pa-seats" name="seats" className="select" defaultValue={defaultSeats ?? ""}>
            <option value="">Any size</option>
            {SEAT_BANDS.map((b) => (
              <option key={b.id} value={b.id}>{b.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="pa-budget">Rough budget</label>
          <select id="pa-budget" name="budget" className="select" defaultValue="">
            <option value="">Prefer not to say</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="pa-phone">Phone (optional)</label>
        <input id="pa-phone" name="phone" className="input" type="tel" autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="pa-notes">Anything else?</label>
        <textarea id="pa-notes" name="notes" className="textarea" placeholder="Lounger seat, a certain brand, needs to fit a tight spot..." />
      </div>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden style={{ position: "absolute", left: -9999 }} />
      {status === "error" && <p className="err-msg" style={{ color: "#d4573f" }}>{error}. Please call (509) 667-8833.</p>}
      <button className="btn btn-primary btn-lg" type="submit" disabled={status === "sending"} style={{ justifySelf: "start" }}>
        {status === "sending" ? "Sending..." : "Tell me when one arrives"} <Icon name="arrow" size={18} />
      </button>
    </form>
  );
}
