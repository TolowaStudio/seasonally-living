import { NextRequest, NextResponse } from "next/server";
import { getAudience } from "@/lib/audience";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { linkBase } from "@/lib/note-links";
import { verifyToken } from "@/lib/tokens";
import { sendMail, staffRecipients } from "@/lib/mail";
import { tagOf } from "@/lib/text";

// POST /api/note/unsubscribe?t=<signed token>. Serves both the button on /note/unsubscribe (form post,
// redirects back to the page) and mail-client one-click unsubscribe (RFC 8058: POST with
// "List-Unsubscribe=One-Click", answered with a plain 200).

export async function POST(req: NextRequest) {
  const base = linkBase(req.nextUrl.origin);
  let token = req.nextUrl.searchParams.get("t");
  let oneClick = false;
  try {
    const form = await req.formData();
    oneClick = form.get("List-Unsubscribe") === "One-Click";
    if (!token) {
      const v = form.get("t");
      token = typeof v === "string" ? v : null;
    }
  } catch {
    /* no form body */
  }

  const rejected = (status: number, q: string) =>
    oneClick ? NextResponse.json({ success: false }, { status }) : NextResponse.redirect(new URL(`/note/unsubscribe?${q}`, base), 303);

  if (!rateLimit(`unsub:${clientIp(req.headers)}`, 20, 10 * 60_000).ok) return rejected(429, "error=busy");
  const t = verifyToken(token, "unsub");
  if (!t) return rejected(400, "error=invalid");

  const r = await getAudience().unsubscribe(t.e);
  console.log(JSON.stringify({ event: "note.unsubscribed", who: await tagOf(t.e), provider: r.provider, ok: r.ok, oneClick }));
  if (!r.ok && !r.skipped) return rejected(502, "error=store");
  // No list provider connected: nothing was removed anywhere, so staff must act on it.
  if (r.skipped) await sendMail({ to: staffRecipients(), subject: `Unsubscribe request: ${t.e}`, text: `${t.e} used the unsubscribe link in a Seasonally Living note email. No audience provider is connected, so please remove them from the list by hand.` });
  return oneClick ? NextResponse.json({ success: true }) : NextResponse.redirect(new URL("/note/unsubscribe?done=1", base), 303);
}
