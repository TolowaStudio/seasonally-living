import { NextRequest, NextResponse } from "next/server";
import { INTERESTS, INTEREST_IDS } from "@/lib/interests";

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
  company?: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v: unknown, n = 500) => (typeof v === "string" ? v.trim().slice(0, n) : "");
// Single-line fields go into the subject/header lines: no CR/LF.
const line = (v: unknown, n = 200) => clip(v, n).replace(/[\r\n]+/g, " ");
const label = (id: string) => INTERESTS.find((i) => i.id === id)?.label ?? id;

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
  if (!EMAIL_RE.test(email)) return NextResponse.json({ success: false, error: "Please enter a valid email" }, { status: 400 });
  if (kind === "visit" && !name) return NextResponse.json({ success: false, error: "Please add your name" }, { status: 400 });

  const interests = (kind === "note" ? (Array.isArray(d.interests) ? d.interests : []) : [d.interest ?? ""]).filter((i) => INTEREST_IDS.includes(i));
  const tags = interests.map(label).join(", ") || "General";

  const subject =
    kind === "visit" ? `Visit request: ${name} (${tags})` : `Note signup: ${email} (${tags})`;
  const text = [
    kind === "visit" ? "New visit / consult request from seasonallyliving.com" : "New Seasonally Living note signup",
    "",
    `Name: ${name || "-"}`,
    `Email: ${email}`,
    `Phone: ${line(d.phone, 40) || "-"}`,
    `Interest: ${tags}`,
    kind === "visit" ? `Best time: ${line(d.when, 120) || "-"}` : "",
    kind === "visit" ? `Note opt-in: ${d.optIn ? "yes" : "no"}` : "Note opt-in: yes",
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
      reply_to: email,
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
