import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { INTERESTS, INTEREST_IDS } from "@/lib/interests";
import { cleanAttribution, describeTouch } from "@/lib/attribution";
import { cleanEmail, multiLine, oneLine, tagOf } from "@/lib/text";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { mailConfigured, sendMail, staffRecipients } from "@/lib/mail";
import { NOTE_CONSENT_TEXT, NOTE_CONSENT_VERSION } from "@/lib/note-consent";
import { signingAvailable } from "@/lib/tokens";
import { confirmLink, linkBase } from "@/lib/note-links";
import { confirmRequestEmail } from "@/emails/note-emails";
import { getGuide, getPreOwnedSpa } from "@/lib/sanity";

// POST /api/lead: visit requests ("visit") and note / guide signups ("note").
// Every error is { success: false, error, code }. A caller can never put a CR/LF or other control
// character into a subject, header or reply-to: every reflected field goes through oneLine().

type Payload = {
  kind?: unknown;
  interest?: unknown;
  interests?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  when?: unknown;
  message?: unknown;
  optIn?: unknown;
  source?: unknown;
  unit?: unknown;
  guide?: unknown;
  attribution?: unknown;
  company?: unknown; // honeypot
};

const MAX_BODY = 20_000;
const fail = (status: number, code: string, error: string, headers?: Record<string, string>) =>
  NextResponse.json({ success: false, error, code }, { status, headers });
const label = (id: string) => INTERESTS.find((i) => i.id === id)?.label ?? id;

export async function POST(req: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  if (!mailConfigured() && isProd) {
    console.error(JSON.stringify({ event: "lead.error", code: "mail_not_configured" }));
    return fail(503, "not_configured", "Email is not configured");
  }

  const ip = clientIp(req.headers);
  const byIp = rateLimit(`ip:${ip}`, 8, 10 * 60_000);
  if (!byIp.ok) return fail(429, "rate_limited", "Too many requests. Please wait a few minutes or call (509) 667-8833.", { "Retry-After": String(byIp.retryAfter) });
  if (!rateLimit("global", 300, 60 * 60_000).ok) return fail(429, "rate_limited", "We're getting a lot of requests right now. Please call (509) 667-8833.", { "Retry-After": "600" });

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return fail(413, "too_large", "Request too large");
  let d: Payload;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) return fail(413, "too_large", "Request too large");
    d = JSON.parse(raw);
  } catch {
    return fail(400, "bad_json", "Invalid request");
  }
  if (!d || typeof d !== "object" || Array.isArray(d)) return fail(400, "bad_json", "Invalid request");

  // Bots fill the hidden field; pretend success and do nothing.
  if (typeof d.company === "string" && d.company.trim()) return NextResponse.json({ success: true });

  const kind = d.kind === "note" ? "note" : "visit";
  const email = cleanEmail(d.email);
  const name = oneLine(d.name, kind === "note" ? 60 : 120);
  if (!email) return fail(400, "bad_email", "Please enter a valid email");
  if (kind === "visit" && !name) return fail(400, "missing_name", "Please add your name");
  if (!rateLimit(`email:${email}`, 4, 60 * 60_000).ok) return fail(429, "rate_limited", "That address was just used. Please check your inbox, or call (509) 667-8833.", { "Retry-After": "900" });

  // Guide signups: the guide decides the interest tag.
  const guideSlug = oneLine(d.guide, 96);
  const guide = kind === "note" && guideSlug ? await getGuide(guideSlug) : undefined;
  if (kind === "note" && guideSlug && !guide) return fail(400, "bad_guide", "That guide wasn't found");

  const rawInterests = kind === "note" ? (Array.isArray(d.interests) ? d.interests : []) : [d.interest];
  const interests = [...new Set([...(guide ? [guide.interest] : []), ...rawInterests.map((i) => oneLine(i, 40))])].filter((i) => INTEREST_IDS.includes(i)).slice(0, 8);
  const tags = interests.map(label).join(", ") || "General";

  // A unit is only accepted if its slug is a real pre-owned spa; the title is then rebuilt from our data.
  let unit = "";
  if (kind === "visit" && interests.includes("pre-owned")) {
    const slug = /\(([a-z0-9-]{1,96})\)\s*$/.exec(oneLine(d.unit, 200))?.[1];
    const spa = slug ? await getPreOwnedSpa(slug) : null;
    if (spa) unit = oneLine(`${spa.title} (${spa.slug})`, 160);
  }

  const optIn = kind === "note" || d.optIn === true;
  // A note signup without a working confirmation link would look like success while storing nothing.
  if (kind === "note" && !signingAvailable()) {
    console.error(JSON.stringify({ event: "lead.error", code: "no_signing_secret", note: "NOTE_SIGNING_SECRET unset: note signups disabled" }));
    return fail(503, "not_configured", "Signups are temporarily unavailable. Please call (509) 667-8833.");
  }
  const source = oneLine(d.source, 200);
  const attribution = cleanAttribution(d.attribution);
  const rid = randomUUID().slice(0, 8);
  const base = linkBase(req.nextUrl.origin);

  const subject = kind === "visit" ? `Visit request: ${name} (${tags})${unit ? ` - ${unit}` : ""}` : `Note signup (unconfirmed): ${email} (${tags})${guide ? ` - ${guide.title}` : ""}`;
  const text = [
    kind === "visit" ? "New visit / consult request from seasonallyliving.com" : "New Seasonally Living note signup (waiting on email confirmation)",
    "",
    `Name: ${name || "-"}`,
    `Email: ${email}`,
    `Phone: ${oneLine(d.phone, 40) || "-"}`,
    `Interest: ${tags}`,
    guide ? `Guide: ${guide.title}` : "",
    unit ? `Unit: ${unit}` : "",
    kind === "visit" ? `Best time: ${oneLine(d.when, 120) || "-"}` : "",
    `Note opt-in: ${optIn ? "yes (double opt-in email sent)" : "no"}`,
    `Source page: ${source || "-"}`,
    "",
    `First touch: ${describeTouch(attribution.first)}`,
    `Last touch: ${describeTouch(attribution.last)}`,
    `Ref: ${rid}`,
    "",
    kind === "visit" ? `Message:\n${multiLine(d.message, 2000) || "(none)"}` : "",
  ]
    .filter((l, i, all) => l !== "" || all[i - 1] !== "")
    .join("\n");

  // Double opt-in: nothing is added to any list until the signed link is clicked.
  let pending = false;
  async function sendConfirmation(): Promise<boolean> {
    if (!optIn) return true;
    const link = signingAvailable()
      ? confirmLink(base, { e: email!, n: name || undefined, i: interests, s: source, g: guide?.slug, ct: NOTE_CONSENT_TEXT, cv: NOTE_CONSENT_VERSION, ts: Date.now(), rid })
      : null;
    if (!link) {
      console.error(JSON.stringify({ event: "lead.warn", rid, code: "no_signing_secret", note: "NOTE_SIGNING_SECRET unset: double opt-in email not sent" }));
      return true;
    }
    const m = confirmRequestEmail({ name: name || undefined, interests, confirmUrl: link, guideTitle: guide?.title });
    const sent = await sendMail({ to: email!, subject: m.subject, text: m.text, html: m.html });
    pending = sent.ok || !!sent.skipped;
    return sent.ok || !!sent.skipped;
  }

  // A note signup sends the confirmation first, so a failed send (and the person's retry) can't pile duplicate staff emails.
  // A visit request always reaches staff first: the confirmation is a bonus.
  if (kind === "note" && !(await sendConfirmation())) return fail(502, "confirm_failed", "We couldn't send the confirmation email. Please try again.");
  const staff = await sendMail({ to: staffRecipients(), subject, text, replyTo: email });
  if (!staff.ok && !staff.skipped) return fail(502, "delivery_failed", "Delivery failed");
  if (kind === "visit") await sendConfirmation();

  console.log(JSON.stringify({
    event: "lead",
    rid,
    kind,
    interests,
    guide: guide?.slug,
    unit: unit || undefined,
    source: source.split("?")[0],
    optIn,
    pendingConfirmation: pending,
    who: await tagOf(email),
    emailDomain: email.split("@")[1],
    attribution,
    staffMail: staff.ok ? "sent" : "dev-log",
  }));

  return NextResponse.json({ success: true, pending });
}
