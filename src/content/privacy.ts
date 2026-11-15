// Draft privacy policy text (TOL-3359). Client-facing wording: Jeramey approves it before this goes live.
// Every statement describes what the code does today. If a tag, form or vendor changes, change this file too.

export const PRIVACY_UPDATED = "November 15, 2026";

export type PrivacySection = { title: string; body: string[] };

export const PRIVACY_INTRO =
  "Seasonally Living by Chim Chimney is a family-owned shop in Wenatchee, Washington. This page says what we collect when you use this website, why, and how to opt out. We keep it short because we collect little.";

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    title: "What you give us",
    body: [
      "When you book a visit, ask about a pre-owned spa, sell or trade in a tub, send private feedback, or sign up for our monthly note or a guide, we receive what you type: your name, email, phone number if you give one, the product you are interested in, and your message.",
      "We use it to answer you. Visit and inquiry details go to our staff by email. We do not sell your details and we do not share them with other businesses for their own marketing.",
    ],
  },
  {
    title: "The monthly note and guides",
    body: [
      "The note is optional and needs your yes: we email a confirmation link first, and nothing else is sent until you click it. Every email has an unsubscribe link that works at once.",
    ],
  },
  {
    title: "Cookies and similar tools",
    body: [
      "Choosing Accept or No thanks on the cookie banner is saved in your browser, not on our servers. You can change your mind at any time with Cookie settings in the footer.",
      "One small cookie, sl_attr, remembers which page or ad first brought you here, for 90 days. It holds the source and campaign names from the link you came in on and nothing else about you. It lets us tell which of our efforts bring people in.",
      "Analytics and advertising tools load only if we have switched them on. When they are on, Google Analytics and Google Ads start with cookies off and stay that way until you press Accept. Meta (Facebook) ad measurement and PostHog analytics do not load at all until you press Accept. If you press No thanks, none of them set cookies.",
      "If you press Accept, Google and Meta may receive information about your visit, such as pages viewed and whether you booked or signed up, to measure our ads. If you submit a form after accepting, Meta may also receive a scrambled (hashed) version of your email or phone number to match the ad you saw.",
    ],
  },
  {
    title: "Who handles the data for us",
    body: [
      "Our website host (Google Cloud), email service (Resend), content system (Sanity) and image host (Cloudinary) process data on our behalf to run the site. Google, Meta and PostHog act as described above, and only if you accept.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You can ask us what we have about you, ask us to correct it, or ask us to delete it. Email or call us and we will do it.",
      "You can also turn cookies off in your browser. The site still works without them.",
    ],
  },
  {
    title: "Children",
    body: ["This site is meant for adults. We do not knowingly collect information from children."],
  },
  {
    title: "Changes",
    body: ["If this page changes in a way that matters, we will update the date at the top."],
  },
];
