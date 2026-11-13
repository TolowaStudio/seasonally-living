// Single place that talks to Resend's /emails endpoint (staff notifications, double opt-in, guides, welcome emails).

export const mailConfigured = () => !!process.env.RESEND_API_KEY;
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

/** Sends one email. With no RESEND_API_KEY it logs (outside production only) and reports skipped: nothing is sent. */
export async function sendMail(m: Mail): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`=== MAIL (dev, not sent) to ${[m.to].flat().join(", ")} ===\nSubject: ${m.subject}\n${m.text}`);
    }
    return { ok: false, skipped: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
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
