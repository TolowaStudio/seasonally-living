"use client";

import { useState } from "react";
import Icon from "./Icon";

// "Sell or trade in your old hot tub." Posts to /api/lead as interest "pre-owned-supply"; every answer travels in
// the message field (the lead route is not changed for this). Photos follow by email or at the shop (no uploads here).
const CONDITIONS = ["Works great", "Works, but has a problem", "Doesn't work", "Not sure"];
const WANTS = ["Sell it to you", "Trade toward a new or pre-owned spa", "Haul it away", "Not sure yet"];
const AGES = ["Under 5 years", "5 to 10 years", "10 to 15 years", "Over 15 years", "Not sure"];

export default function PreOwnedSellForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim() || "-";
    const message = [
      `Brand / model: ${v("make")}`,
      `Age: ${v("age")}`,
      `Seats: ${v("seats")}`,
      `Condition: ${v("condition")}`,
      `What they want: ${v("want")}`,
      `Where it is: ${v("location")}`,
      `Photos: ${fd.get("photos") === "on" ? "will send after (we should ask for them)" : "not mentioned"}`,
      `Details: ${v("details")}`,
    ].join("\n");
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "visit",
          interest: "pre-owned-supply",
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
        <p className="h-md">Thanks, we&apos;ve got it.</p>
        <p className="body-muted" style={{ marginTop: 8 }}>
          We&apos;ll call or email within one business day. If you have photos, send them to sales@seasonallyliving.com or bring them by the showroom. Need us sooner? Call (509) 667-8833.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 18 }} aria-label="Sell or trade in your hot tub">
      <div className="form-row2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="field">
          <label htmlFor="ps-name">Name <span className="req">*</span></label>
          <input id="ps-name" name="name" className="input" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="ps-phone">Phone</label>
          <input id="ps-phone" name="phone" className="input" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="ps-email">Email <span className="req">*</span></label>
        <input id="ps-email" name="email" className="input" type="email" required autoComplete="email" />
      </div>
      <div className="form-row2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="field">
          <label htmlFor="ps-make">Brand and model</label>
          <input id="ps-make" name="make" className="input" placeholder="e.g. Cal Spas Escape, or not sure" />
        </div>
        <div className="field">
          <label htmlFor="ps-age">About how old?</label>
          <select id="ps-age" name="age" className="select" defaultValue="">
            <option value="">Choose one</option>
            {AGES.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="field">
          <label htmlFor="ps-seats">How many seats?</label>
          <input id="ps-seats" name="seats" className="input" inputMode="numeric" placeholder="e.g. 6" />
        </div>
        <div className="field">
          <label htmlFor="ps-cond">What shape is it in?</label>
          <select id="ps-cond" name="condition" className="select" defaultValue="">
            <option value="">Choose one</option>
            {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="field">
          <label htmlFor="ps-want">What would you like to do?</label>
          <select id="ps-want" name="want" className="select" defaultValue="">
            <option value="">Choose one</option>
            {WANTS.map((w) => <option key={w}>{w}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ps-loc">Town where it is <span className="req">*</span></label>
          <input id="ps-loc" name="location" className="input" required placeholder="e.g. Cashmere" autoComplete="address-level2" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="ps-details">Anything else we should know?</label>
        <textarea id="ps-details" name="details" className="textarea" placeholder="What's wrong with it, stairs or gates in the way, how soon you need it gone..." />
      </div>
      <label className="small body-muted" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <input type="checkbox" name="photos" style={{ marginTop: 5 }} />
        I&apos;ll send photos after this. Please ask me for them.
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden style={{ position: "absolute", left: -9999 }} />
      {status === "error" && <p className="err-msg" style={{ color: "#d4573f" }}>{error}. Please call (509) 667-8833.</p>}
      <button className="btn btn-primary btn-lg" type="submit" disabled={status === "sending"} style={{ justifySelf: "start" }}>
        {status === "sending" ? "Sending..." : "Send it to the shop"} <Icon name="arrow" size={18} />
      </button>
    </form>
  );
}
