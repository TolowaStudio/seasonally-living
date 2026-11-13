// Tiny email renderer: one column, inline styles, plain-text twin. Used by every note email so they
// look alike and always carry a footer with the shop's address and an unsubscribe link.

import { escapeHtml } from "@/lib/text";
import { SETTINGS } from "@/content/settings";

export type EmailBlocks = {
  preheader: string;
  heading: string;
  paragraphs: string[]; // plain text; no HTML
  bullets?: string[];
  cta?: { label: string; href: string }; // one call to action per email
  unsubscribeUrl?: string; // omit only for transactional mail (confirmation)
  footerNote?: string;
};

const INK = "#1d2327";
const SOFT = "#4f5a60";
const CLAY = "#b8581f";
const PAPER = "#f7f2ea";

const addr = `${SETTINGS.address.line1}, ${SETTINGS.address.city}, ${SETTINGS.address.state} ${SETTINGS.address.zip}`;

export function renderEmail(b: EmailBlocks): { html: string; text: string } {
  const e = escapeHtml;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(b.heading)}</title></head>
<body style="margin:0;padding:0;background:${PAPER};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${e(b.preheader)}</span>
<div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:Helvetica,Arial,sans-serif;color:${INK};font-size:16px;line-height:1.6;">
<p style="margin:0 0 18px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:${CLAY};">Seasonally Living &middot; Wenatchee</p>
<h1 style="margin:0 0 18px;font-size:26px;line-height:1.2;font-weight:600;">${e(b.heading)}</h1>
${b.paragraphs.map((p) => `<p style="margin:0 0 16px;color:${SOFT};">${e(p)}</p>`).join("\n")}
${b.bullets?.length ? `<ul style="margin:0 0 20px;padding-left:20px;color:${SOFT};">${b.bullets.map((x) => `<li style="margin-bottom:6px;">${e(x)}</li>`).join("")}</ul>` : ""}
${b.cta ? `<p style="margin:26px 0;"><a href="${e(b.cta.href)}" style="display:inline-block;background:${CLAY};color:#fff;text-decoration:none;font-weight:600;padding:14px 26px;border-radius:999px;">${e(b.cta.label)}</a></p>` : ""}
<hr style="border:none;border-top:1px solid #e0d8cc;margin:30px 0 18px;">
<p style="margin:0;font-size:13px;color:#7a7f82;">${e(SETTINGS.legalName)}, ${e(addr)}. ${e(SETTINGS.phoneDisplay)}.<br>
${b.footerNote ? e(b.footerNote) + "<br>" : ""}${b.unsubscribeUrl ? `<a href="${e(b.unsubscribeUrl)}" style="color:#7a7f82;">Unsubscribe</a> any time.` : ""}</p>
</div></body></html>`;

  const text = [
    b.heading,
    "",
    ...b.paragraphs.flatMap((p) => [p, ""]),
    ...(b.bullets?.length ? [...b.bullets.map((x) => `- ${x}`), ""] : []),
    ...(b.cta ? [`${b.cta.label}: ${b.cta.href}`, ""] : []),
    "--",
    `${SETTINGS.legalName}, ${addr}. ${SETTINGS.phoneDisplay}.`,
    ...(b.footerNote ? [b.footerNote] : []),
    ...(b.unsubscribeUrl ? [`Unsubscribe: ${b.unsubscribeUrl}`] : []),
  ].join("\n");

  return { html, text };
}

/** Booking link used as the single CTA in sequence emails, tagged so the visit is attributable. */
export function bookingUrl(base: string, interest: string, campaign: string, content: string): string {
  const q = new URLSearchParams({ interest, utm_source: "newsletter", utm_medium: "email", utm_campaign: campaign, utm_content: content });
  return `${base}/visit?${q.toString()}#book`;
}
