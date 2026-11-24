// Transactional email: Resend or Postmark (see EMAIL_PROVIDER). Audience lists stay on Resend (src/lib/audience.ts).

const RESEND_URL = "https://api.resend.com/emails";
const POSTMARK_URL = "https://api.postmarkapp.com/email";
const POSTMARK_STREAM = () => process.env.POSTMARK_MESSAGE_STREAM || "outbound";

export type EmailProvider = "resend" | "postmark";

/** Resend when unset; unknown values fall back to Resend with a warning. */
export function resolveEmailProvider(): EmailProvider {
  const raw = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (!raw || raw === "resend") return "resend";
  if (raw === "postmark") return "postmark";
  console.warn(`mail: unknown EMAIL_PROVIDER "${process.env.EMAIL_PROVIDER}", falling back to resend`);
  return "resend";
}

export const mailConfigured = () => {
  if (resolveEmailProvider() === "postmark") return !!process.env.POSTMARK_SERVER_TOKEN;
  return !!process.env.RESEND_API_KEY;
};

export const fromAddress = () => process.env.LEAD_FROM_EMAIL || "Seasonally Living <noreply@seasonallyliving.com>";
export const staffRecipients = () =>
  (process.env.LEAD_TO_EMAIL || "sales@seasonallyliving.com").split(",").map((s) => s.trim()).filter(Boolean);

/** Error text from a provider can echo the recipient: keep the gist, drop addresses. */
export const redact = (t: string) => t.replace(/[^\s"'<>,;]+@[^\s"'<>,;]+/g, "[email]").slice(0, 200);

export type Mail = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

export type MailResult = { ok: boolean; skipped?: boolean; status?: number };

function toPostmarkHeaders(headers?: Record<string, string>) {
  if (!headers) return undefined;
  const entries = Object.entries(headers);
  if (!entries.length) return undefined;
  return entries.map(([Name, Value]) => ({ Name, Value }));
}

async function sendViaResend(m: Mail, key: string): Promise<MailResult> {
  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from: fromAddress(),
        to: m.to,
        subject: m.subject,
        text: m.text,
        html: m.html,
        reply_to: m.replyTo,
        headers: m.headers,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.error("mail: resend error", res.status, redact(await res.text()));
    return { ok: res.ok, status: res.status };
  } catch (err) {
    console.error("mail: send failed", err instanceof Error ? err.message : err);
    return { ok: false };
  }
}

async function sendViaPostmark(m: Mail, token: string): Promise<MailResult> {
  try {
    const to = Array.isArray(m.to) ? m.to.join(",") : m.to;
    const res = await fetch(POSTMARK_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": token,
      },
      body: JSON.stringify({
        From: fromAddress(),
        To: to,
        Subject: m.subject,
        TextBody: m.text,
        HtmlBody: m.html,
        ReplyTo: m.replyTo,
        Headers: toPostmarkHeaders(m.headers),
        MessageStream: POSTMARK_STREAM(),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.error("mail: postmark error", res.status, redact(await res.text()));
    return { ok: res.ok, status: res.status };
  } catch (err) {
    console.error("mail: send failed", err instanceof Error ? err.message : err);
    return { ok: false };
  }
}

/** Sends one email. With no provider API key it logs (outside production only) and reports skipped: nothing is sent. */
export async function sendMail(m: Mail): Promise<MailResult> {
  const provider = resolveEmailProvider();
  const resendKey = process.env.RESEND_API_KEY;
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;

  const key = provider === "postmark" ? postmarkToken : resendKey;
  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`=== MAIL (dev, not sent) to ${[m.to].flat().join(", ")} ===\nSubject: ${m.subject}\n${m.text}`);
    }
    return { ok: false, skipped: true };
  }

  if (provider === "postmark") return sendViaPostmark(m, key);
  return sendViaResend(m, key);
}