"use client";

import { useState } from "react";
import Icon from "./Icon";
import { FEEDBACK_INTEREST } from "@/lib/interests";

type Status = "idle" | "sending" | "sent" | "error";

/** "Tell Cam directly": posts to the lead API with interest "feedback". It never replaces or gates the public review. */
export default function FeedbackForm({ phoneDisplay }: { phoneDisplay: string }) {
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
          interest: FEEDBACK_INTEREST,
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          message: fd.get("message"),
          source: window.location.pathname,
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
        <p className="h-md">Thank you. Cam will read this himself.</p>
        <p className="body-muted" style={{ marginTop: 8 }}>
          If you left a way to reach you, he&rsquo;ll get back to you. Prefer to talk it through? Call {phoneDisplay}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }} aria-label="Tell Cam directly">
      <div className="field">
        <label htmlFor="fb-msg">What would you like Cam to know? <span className="req">*</span></label>
        <textarea id="fb-msg" name="message" className="textarea" required maxLength={2000} placeholder="What went well, what didn't, or a question we can help with." />
      </div>
      <div className="form-row2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="field">
          <label htmlFor="fb-name">Name (optional)</label>
          <input id="fb-name" name="name" className="input" autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="fb-email">Email</label>
          <input id="fb-email" name="email" className="input" type="email" autoComplete="email" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="fb-phone">Phone</label>
        <input id="fb-phone" name="phone" className="input" type="tel" autoComplete="tel" />
        <span className="tiny body-muted" style={{ letterSpacing: 0 }}>Email or phone, so Cam can write or call back.</span>
      </div>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden style={{ position: "absolute", left: -9999 }} />
      {status === "error" && <p className="err-msg" role="alert" style={{ color: "#d4573f" }}>{error}. You can also call {phoneDisplay}.</p>}
      <button className="btn btn-outline btn-lg" type="submit" disabled={status === "sending"} style={{ justifySelf: "start" }}>
        {status === "sending" ? "Sending..." : "Send to Cam"} <Icon name="arrow" size={18} />
      </button>
    </form>
  );
}
