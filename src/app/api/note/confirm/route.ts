import { NextRequest, NextResponse } from "next/server";
import { getAudience } from "@/lib/audience";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { mailConfigured, sendMail, staffRecipients } from "@/lib/mail";
import { guideReadLink, linkBase, unsubscribeLink } from "@/lib/note-links";
import { signToken, verifyToken } from "@/lib/tokens";
import { getGuide } from "@/lib/sanity";
import { confirmedEmail } from "@/emails/note-emails";
import { INTERESTS } from "@/lib/interests";
import { tagOf } from "@/lib/text";

// POST /api/note/confirm: the double opt-in click. The email link opens /note/confirm (a page with a
// button) rather than confirming on GET, so mail scanners that pre-fetch links can't confirm for anyone.

async function tokenFrom(req: NextRequest): Promise<string | null> {
  const q = req.nextUrl.searchParams.get("t");
  if (q) return q;
  try {
    const v = (await req.formData()).get("t");
    return typeof v === "string" ? v : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const base = linkBase(req.nextUrl.origin);
  const back = (q: string) => NextResponse.redirect(new URL(`/note/confirm?${q}`, base), 303);
  if (!rateLimit(`confirm:${clientIp(req.headers)}`, 20, 10 * 60_000).ok) return back("error=busy");

  const t = verifyToken(await tokenFrom(req), "confirm");
  if (!t) return back("error=invalid");

  const confirmedAt = new Date().toISOString();
  const result = await getAudience().subscribe({
    email: t.e,
    name: t.n,
    interests: t.i,
    source: t.s,
    guide: t.g,
    consentText: t.ct,
    consentVersion: t.cv,
    consentAt: new Date(t.ts).toISOString(),
    confirmedAt,
  });
  if (!result.ok && !result.skipped) return back("error=store");

  const guide = t.g ? await getGuide(t.g) : undefined;
  const unsub = unsubscribeLink(base, t.e);
  const guideUrl = guide ? guideReadLink(base, guide.slug, t.e) : null;

  // Staff get the consent record; the subscriber gets a short "you're in" with their guide link.
  const topics = t.i.map((i) => INTERESTS.find((x) => x.id === i)?.label ?? i).join(", ") || "General";
  await sendMail({
    to: staffRecipients(),
    subject: `Note signup CONFIRMED: ${t.e} (${topics})`,
    text: [
      `Confirmed by email click at ${confirmedAt}.`,
      `Provider: ${result.provider}${result.skipped ? " (nothing stored: add this person to the list by hand)" : ""}`,
      `Name: ${t.n || "-"}`,
      `Topics: ${topics}`,
      guide ? `Guide: ${guide.title}` : "",
      `Signed up from: ${t.s || "-"} at ${new Date(t.ts).toISOString()}`,
      `Consent (${t.cv}): ${t.ct}`,
      `Ref: ${t.rid}`,
    ].filter(Boolean).join("\n"),
  });
  if (mailConfigured() || process.env.NODE_ENV !== "production") {
    const m = confirmedEmail({ name: t.n, unsubscribeUrl: unsub, guide: guide && guideUrl ? { title: guide.title, url: guideUrl } : undefined });
    await sendMail({
      to: t.e,
      subject: m.subject,
      text: m.text,
      html: m.html,
      headers: unsub ? { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } : undefined,
    });
  }

  console.log(JSON.stringify({ event: "note.confirmed", rid: t.rid, who: await tagOf(t.e), interests: t.i, guide: t.g, provider: result.provider, consentVersion: t.cv }));

  // Guide signups land on the guide; everyone else on a thank-you page.
  const readToken = guide ? signToken({ t: "guide", e: t.e, g: guide.slug, exp: Date.now() + 3600_000 * 24 * 365 }) : null;
  if (guide && readToken) return NextResponse.redirect(new URL(`/guides/${guide.slug}/read?t=${readToken}&welcome=1`, base), 303);
  return back("done=1");
}
