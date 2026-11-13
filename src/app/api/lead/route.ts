import { NextRequest, NextResponse } from "next/server";
import { FEEDBACK_INTEREST, INTERESTS, INTEREST_IDS, LEAD_INTEREST_IDS } from "@/lib/interests";

type Payload = {
  kind?: "visit" | "note";
  interest?: string;
  interests?: string[];
  name?: string;
  email?: string;
  phone?: string;
  when?: string;
  message?: string;
  optIn?: boolean;
  source?: string;
  unit?: string;
  company?: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v: unknown, n = 500) => (typeof v === "string" ? v.trim().slice(0, n) : "");
// Single-line fields go into the subject/header lines: no CR/LF or other control characters.
const line = (v: unknown, n = 200) => clip(v, n).replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
const label = (id: string) => (id === FEEDBACK_INTEREST ? "Private feedback for Cam" : (INTERESTS.find((i) => i.id === id)?.label ?? id));

export async function POST(req: NextRequest) {
  const key = process.env.RESEND_API_KEY;
  const isProd = process.env.NODE_ENV === "production";
  if (!key && isProd) {
    console.error("lead: RESEND_API_KEY is not set");
    return NextResponse.json({ success: false, error: "Email is not configured" }, { status: 503 });
  }

  let d: Payload;
  try {
    d = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  if (!d || typeof d !== "object" || Array.isArray(d)) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  // Bots fill the hidden field; pretend success.
  if (clip(d.company)) return NextResponse.json({ success: true });

  const kind = d.kind === "note" ? "note" : "visit";
  const email = line(d.email, 200);
  const name = line(d.name, 120);
  const feedback = kind === "visit" && d.interest === FEEDBACK_INTEREST;
  if (feedback) {
    // "Tell Cam directly": a way to reply (email or phone) and the message itself. Name is optional.
    if (email && !EMAIL_RE.test(email)) return NextResponse.json({ success: false, error: "That email doesn't look right" }, { status: 400 });
    if (!email && !line(d.phone, 40)) return NextResponse.json({ success: false, error: "Please add an email or phone so Cam can reply" }, { status: 400 });
    if (!clip(d.message, 2000)) return NextResponse.json({ success: false, error: "Please tell us what happened" }, { status: 400 });
  } else {
    if (!EMAIL_RE.test(email)) return NextResponse.json({ success: false, error: "Please enter a valid email" }, { status: 400 });
    if (kind === "visit" && !name) return NextResponse.json({ success: false, error: "Please add your name" }, { status: 400 });
  }

  const interests = (kind === "note" ? (Array.isArray(d.interests) ? d.interests : []) : [d.interest ?? ""]).filter((i) => (kind === "note" ? INTEREST_IDS : LEAD_INTEREST_IDS).includes(i));
  const tags = interests.map(label).join(", ") || "General";

  // Only pre-owned inquiries carry a unit (the spa's title and slug, set by the detail page).
  const unit = kind === "visit" && interests.includes("pre-owned") ? line(d.unit, 160) : "";
  const subject = feedback
    ? `Private feedback for Cam${name ? ` from ${name}` : ""}`
    : kind === "visit" ? `Visit request: ${name} (${tags})${unit ? ` - ${unit}` : ""}` : `Note signup: ${email} (${tags})`;
  const text = [
    feedback
      ? "Private feedback for Cam from the /review page. This person was also invited to post a public Google review; this form is a direct line, not a filter."
      : kind === "visit" ? "New visit / consult request from seasonallyliving.com" : "New Seasonally Living note signup",
    "",
    `Name: ${name || "-"}`,
    `Email: ${email || "-"}`,
    `Phone: ${line(d.phone, 40) || "-"}`,
    `Interest: ${tags}`,
    unit ? `Unit: ${unit}` : "",
    kind === "visit" && !feedback ? `Best time: ${line(d.when, 120) || "-"}` : "",
    feedback ? "" : kind === "visit" ? `Note opt-in: ${d.optIn ? "yes" : "no"}` : "Note opt-in: yes",
    `Source page: ${line(d.source, 200) || "-"}`,
    "",
    kind === "visit" ? `Message:\n${clip(d.message, 2000) || "(none)"}` : "",
  ]
    .filter((l) => l !== "")
    .join("\n");

  if (!key) {
    console.log("=== LEAD (dev, not sent) ===\n" + subject + "\n" + text);
    return NextResponse.json({ success: true });
  }

  const to = (process.env.LEAD_TO_EMAIL || "sales@seasonallyliving.com").split(",").map((s) => s.trim()).filter(Boolean);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL || "Seasonally Living <noreply@seasonallyliving.com>",
      to,
      ...(email ? { reply_to: email } : {}),
      subject,
      text,
    }),
  });
  if (!res.ok) {
    console.error("lead: resend error", res.status, await res.text());
    return NextResponse.json({ success: false, error: "Delivery failed" }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}
