// Day-7 review request: email and SMS templates. CODE ONLY: nothing here sends anything.
// Wiring (n8n or Resend, one send per buyer 7 days after delivery) is a separate, approved step. See TOL-2909.
//
// Rules these templates follow (Google's review policy and the FTC's 2024 consumer-review rule):
//  - Every buyer gets the same request, happy or not. Never filter, never ask "how was it?" first and only send
//    the link to people who say it was good.
//  - No reward, discount, entry or gift for a review, and no mention of one. The free orientation is part of the
//    purchase for everyone and is NOT linked to the review.
//  - Email goes to customers who gave us their address for their order. SMS only to people who agreed to texts
//    (written consent), with the business name and a STOP line. Respect STOP at once.
//  - The link is the same for everyone: /review (which leads with the Google button).

export type ReviewRequestInput = {
  /** First name only; falls back to "there". */
  firstName?: string;
  /** What they bought, in plain words, e.g. "hot tub", "Stûv stove", "spa chemicals". Optional. */
  purchase?: string;
  /** Absolute URL of the review landing page, e.g. https://seasonallyliving.com/review */
  reviewUrl: string;
  /** Shop phone for the footer, e.g. (509) 667-8833 */
  phoneDisplay: string;
};

const hi = (n?: string) => (n?.trim() ? n.trim().split(/\s+/)[0] : "there");
const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function reviewRequestEmail(i: ReviewRequestInput) {
  const name = hi(i.firstName);
  const subject = "How are we doing?";
  const bought = i.purchase?.trim() ? ` with your new ${i.purchase.trim()}` : "";
  const text = [
    `Hi ${name},`,
    "",
    `It's been about a week, and we hope everything is going well${bought}. Thank you again for choosing a local, family-run shop.`,
    "",
    "If you have a minute, a Google review helps your neighbors find us and tells us how we're doing. Good, bad or in between, we read every one:",
    "",
    i.reviewUrl,
    "",
    "Questions or something not right? Just reply to this email or call the shop. We'd rather hear it and fix it.",
    "",
    "Thank you,",
    "Cam & Susan McNeill and the crew",
    `Seasonally Living by Chim Chimney · ${i.phoneDisplay}`,
    "",
    "You're getting this one-time note because you bought from us. We don't offer anything in return for reviews.",
  ].join("\n");
  const html = `<p>Hi ${esc(name)},</p>
<p>It&rsquo;s been about a week, and we hope everything is going well${esc(bought)}. Thank you again for choosing a local, family-run shop.</p>
<p>If you have a minute, a Google review helps your neighbors find us and tells us how we&rsquo;re doing. Good, bad or in between, we read every one.</p>
<p><a href="${esc(i.reviewUrl)}" style="display:inline-block;padding:12px 22px;background:#c56a3c;color:#fff;border-radius:999px;text-decoration:none;font-weight:600">Leave a Google review</a></p>
<p>Questions or something not right? Just reply to this email or call the shop. We&rsquo;d rather hear it and fix it.</p>
<p>Thank you,<br>Cam &amp; Susan McNeill and the crew<br>Seasonally Living by Chim Chimney &middot; ${esc(i.phoneDisplay)}</p>
<p style="color:#777;font-size:12px">You&rsquo;re getting this one-time note because you bought from us. We don&rsquo;t offer anything in return for reviews.</p>`;
  return { subject, text, html };
}

/** One SMS segment where possible. Only for buyers who opted in to texts; the STOP line is required. */
export function reviewRequestSms(i: Pick<ReviewRequestInput, "firstName" | "reviewUrl">) {
  return `Hi ${hi(i.firstName)}, it's Seasonally Living in Wenatchee. Thanks again for your purchase! If you have a minute, a Google review helps us: ${i.reviewUrl} Reply STOP to opt out.`;
}
