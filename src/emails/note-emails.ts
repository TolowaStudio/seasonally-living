// Transactional note emails: double opt-in request and the "you're in" confirmation.

import { renderEmail } from "./render";
import { INTERESTS } from "@/lib/interests";

const labelOf = (id: string) => INTERESTS.find((i) => i.id === id)?.label ?? id;

export function confirmRequestEmail(o: { name?: string; interests: string[]; confirmUrl: string; guideTitle?: string }) {
  const topics = o.interests.map(labelOf).join(", ");
  const { html, text } = renderEmail({
    preheader: "One click to confirm. If you didn't ask for this, ignore this email.",
    heading: o.guideTitle ? `Confirm to get “${o.guideTitle}”` : "Confirm your email",
    paragraphs: [
      `${o.name ? `Hi ${o.name}, thanks` : "Thanks"} for asking for the Seasonally Living note${topics ? ` (${topics})` : ""}.`,
      `Click the button to confirm your email address${o.guideTitle ? " and open the guide" : ""}. Until you do, we won't send you anything else. The link works for 7 days.`,
      "If you didn't sign up, you can ignore this email and nothing will happen.",
    ],
    cta: { label: "Yes, confirm my email", href: o.confirmUrl },
  });
  return { subject: o.guideTitle ? `Confirm to get your guide: ${o.guideTitle}` : "Please confirm your email", html, text };
}

export function confirmedEmail(o: { name?: string; unsubscribeUrl?: string | null; guide?: { title: string; url: string } }) {
  const { html, text } = renderEmail({
    preheader: "You're on the list.",
    heading: "You're in",
    paragraphs: [
      `${o.name ? `Thanks, ${o.name}. ` : ""}You're signed up for the Seasonally Living note. We send at most one a month, and we never sell your email.`,
      ...(o.guide ? [`Your guide is ready any time at the link below, so you can come back to it.`] : []),
    ],
    cta: o.guide ? { label: `Read: ${o.guide.title}`, href: o.guide.url } : undefined,
    unsubscribeUrl: o.unsubscribeUrl ?? undefined,
  });
  return { subject: "You're on the Seasonally Living list", html, text };
}
