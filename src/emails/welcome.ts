// Welcome sequence: 3 emails per interest, sent on days 0, 4 and 10 after confirming. Each ends in one
// booking CTA tagged with utm_source=newsletter so a booked visit can be traced to the email.
//
// NOT WIRED TO ANY SCHEDULE. Nothing in the app calls sendWelcomeEmail; n8n (or the audience provider)
// triggers it after Jeramey says go. Shop-specific claims are kept out; see `todoConfirm` at the bottom.

import { bookingUrl, renderEmail } from "./render";
import { sendMail, type MailResult } from "@/lib/mail";

export const WELCOME_DAYS = [0, 4, 10] as const;

type Step = { subject: string; preheader: string; heading: string; paragraphs: string[]; bullets?: string[]; cta: string; guide?: string };

export const WELCOME: Record<string, [Step, Step, Step]> = {
  "hot-tub": [
    {
      subject: "Your winter hot tub care guide",
      preheader: "The short version: keep it running, keep it covered, keep the water balanced.",
      heading: "Welcome. Start with the cold-weather basics",
      paragraphs: ["Thanks for joining the Seasonally Living note. Your winter hot tub care guide is below. If you read nothing else, remember this: a tub that is kept running, covered and at the right water level handles a Wenatchee winter just fine.", "Planning a new tub? The fastest way to choose is to sit in a few."],
      cta: "Book a try-out",
      guide: "winter-hot-tub-care",
    },
    {
      subject: "The five-minute weekly hot tub check",
      preheader: "Level, water, filter, cover, GFCI.",
      heading: "Five minutes, once a week",
      paragraphs: ["Most hot tub trouble starts small. A quick weekly look keeps it that way."],
      bullets: ["Water level is above the skimmer line", "pH and alkalinity are in range", "Filter is rinsed (deep-clean on your manual's schedule)", "Cover is clear of heavy snow and latched", "Once a month: press the GFCI test button"],
      cta: "Ask us a hot tub question",
    },
    {
      subject: "How to choose a tub you'll actually use",
      preheader: "Seats, jets, where it goes and what it plugs into.",
      heading: "Choosing a tub for the way you'll use it",
      paragraphs: ["Start with who will be in it: two people, a family, someone who wants targeted jets for a sore back. Then think about where it will sit and how you will get there. Most full-size tubs need a dedicated 240-volt circuit, so the electrical plan matters as much as the tub.", "A tub is a ten-year decision. It is worth an hour in the showroom."],
      cta: "Book a try-out",
    },
  ],
  hearth: [
    {
      subject: "Your burn-ban-ready fireplace guide",
      preheader: "Stage 1, Stage 2 and what keeps working on a ban day.",
      heading: "Welcome. Know the rules before the first ban",
      paragraphs: ["Thanks for joining the Seasonally Living note. Your guide to Washington's Stage 1 and Stage 2 burn bans is below. The short version: check the stage before you light, every time."],
      cta: "Book a fireplace consult",
      guide: "burn-ban-fireplace-guide",
    },
    {
      subject: "What keeps heating on a burn-ban day",
      preheader: "Gas and electric are not solid-fuel devices.",
      heading: "A fire that works on a ban day",
      paragraphs: ["A Stage 2 burn ban shuts down wood burning in any stove, certified or not. Gas and electric fireplaces and inserts are not solid-fuel devices, so they keep working. Many people keep a wood stove for most of the winter and a gas or electric option for the days it is off limits.", "Come see both kinds burning and decide which mix fits your room."],
      cta: "Book a fireplace consult",
    },
    {
      subject: "Book your venting inspection before the cold snap",
      preheader: "Inspections fill up fast once it gets cold.",
      heading: "Check the venting before you rely on it",
      paragraphs: ["A stove or insert is only as good as its venting. Before the season's first fire, have the flue and pipe looked over for buildup, loose sections and a damaged cap.", "Appointments fill up once the first cold snap hits, so earlier is easier."],
      cta: "Request a venting inspection",
    },
  ],
  venting: [
    {
      subject: "Your pre-season venting checklist",
      preheader: "Six things to look at before the first fire.",
      heading: "Welcome. Six things to check before you light",
      paragraphs: ["Thanks for joining the Seasonally Living note. Here is the pre-season checklist:"],
      bullets: ["Creosote or soot buildup in the flue", "Loose, rusted or separated pipe sections", "A cap and screen that are intact", "Clearance from anything that can burn", "A working smoke alarm and carbon monoxide alarm", "A chimney or flue that drafts: no smoke rolling back into the room"],
      cta: "Request a venting inspection",
    },
    {
      subject: "Venting is the heart of the trade",
      preheader: "We started as Chim Chimney in 1979.",
      heading: "Why we care so much about the pipe",
      paragraphs: ["We started as Chim Chimney in 1979, and venting is still the heart of what we do. A stove burns only as well as its venting, so we design it, install it and inspect it ourselves, sized to the appliance and installed to code."],
      cta: "Talk to us about your venting",
    },
    {
      subject: "Bring the model number: our venting parts counter",
      preheader: "Pipe, caps and fittings on the shelf.",
      heading: "Parts on the shelf, help at the counter",
      paragraphs: ["Need pipe, a cap or a fitting? The venting parts counter stocks the common pieces. Bring the appliance model number, or a photo of the nameplate, and we will help you work out the right system."],
      cta: "Plan a stop at the showroom",
    },
  ],
  "pre-owned": [
    {
      subject: "You'll hear about pre-owned spas first",
      preheader: "A heads-up when new arrivals come through our shop.",
      heading: "Welcome. Here's how the first look works",
      paragraphs: ["Thanks for joining the Seasonally Living note. When a pre-owned spa is ready to show, you will get an email with the details before it is announced more widely. Prices are not posted; call or stop in for the number.", "Your shopping checklist is below, whether the spa is ours or anyone else's."],
      cta: "Ask about a spa",
      guide: "pre-owned-first-look",
    },
    {
      subject: "Five questions to ask about any used hot tub",
      preheader: "A good seller answers each in a sentence.",
      heading: "Ask these before you buy",
      paragraphs: [],
      bullets: ["How old is it, and what brand and model?", "What was inspected, tested or repaired?", "Does it heat and jet properly when run?", "Is there any warranty or service behind it?", "Who delivers it, and what does delivery include?"],
      cta: "Ask about a spa",
    },
    {
      subject: "Will it fit, and will it plug in?",
      preheader: "Measure the spot, the path and the power.",
      heading: "Fit and power, before delivery day",
      paragraphs: ["Measure the spot, the path to it and the clearance for lifting. Then ask what electrical the tub needs: small tubs may run on a standard 120-volt outlet, but most full-size tubs need a dedicated 240-volt circuit installed by an electrician."],
      cta: "Ask about a spa",
    },
  ],
  "swim-spa": [
    {
      subject: "Swim spa or pool? How to think about it",
      preheader: "Space, season, budget and how much project you want.",
      heading: "Welcome. A swim spa and a pool answer different questions",
      paragraphs: ["Thanks for joining the Seasonally Living note. A swim spa is a compact tank with a current you swim against, and it doubles as a hot soak. A pool is bigger, can be shaped around your yard and is a larger project with more permits and more digging.", "Neither is better. It comes down to space, how you want to swim and how much project you want."],
      cta: "Talk it through with us",
    },
    {
      subject: "Swimming against a current is something you feel",
      preheader: "It's worth trying before you decide.",
      heading: "Try the water, not just the brochure",
      paragraphs: ["Specs do not tell you how a swim spa feels. Come ask about trying the Cal Spas swim spas, and bring your questions about distance, depth and how you will use it in different seasons."],
      cta: "Book a swim spa visit",
    },
    {
      subject: "Where will a swim spa go?",
      preheader: "Size, delivery path and electrical.",
      heading: "Plan the spot before you fall for the model",
      paragraphs: ["A swim spa is bigger than a hot tub, so the spot, the path to it and the base it sits on all need thought. Electrical needs are significant too. Bring a photo or measurements and we will talk through placement."],
      cta: "Book a swim spa visit",
    },
  ],
  pool: [
    {
      subject: "Your spring 2027 pool planning guide",
      preheader: "Plan in winter, install in spring.",
      heading: "Welcome. Plan this winter, swim next summer",
      paragraphs: ["Thanks for joining the Seasonally Living note. Your spring 2027 pool planning guide is below: site checks, permits, cost drivers and the questions to ask any builder.", "Starting early does not commit you to anything. It gives you time to choose well."],
      cta: "Join the spring install list",
      guide: "spring-2027-pool-planning",
    },
    {
      subject: "Questions to ask any pool builder",
      preheader: "You're entitled to clear answers.",
      heading: "Six questions before you sign anything",
      paragraphs: [],
      bullets: ["Are you a registered Washington contractor, bonded and insured?", "Who does the work: your own crew or subcontractors?", "What is and isn't in the estimate?", "What is the payment schedule?", "What does the warranty cover?", "What is the schedule, and what happens with weather delays?"],
      cta: "Join the spring install list",
    },
    {
      subject: "What your yard is already telling you",
      preheader: "Sun, wind, access and utilities.",
      heading: "Read the site before you pick a shape",
      paragraphs: ["Where does the sun fall in the afternoon? Which way does the wind blow? Can equipment reach the yard? Where are the underground utilities? In Washington you must call 811 before any digging. Answers to these shape the design more than the pool's size does."],
      cta: "Join the spring install list",
    },
  ],
  builder: [
    {
      subject: "Welcome to the Seasonally Living builder list",
      preheader: "A short update a few times a year.",
      heading: "Welcome to the builder list",
      paragraphs: ["Thanks for joining. A few times a year we will send what matters to builders and trades: venting and hearth supply updates, new products and what is on the shelf."],
      cta: "Tell us about your next job",
    },
    {
      subject: "Venting and hearth parts for your next job",
      preheader: "Pipe, caps, fittings and help picking the right system.",
      heading: "Parts and help at the counter",
      paragraphs: ["We stock venting parts and hearth supplies at the showroom and can help work out the right system for an appliance. Bring the model number or a photo of the nameplate."],
      cta: "Tell us about your next job",
    },
    {
      subject: "Planning a hearth or hot tub into a build?",
      preheader: "Bring us in before the framing is done.",
      heading: "The earlier we hear about it, the easier it is",
      paragraphs: ["Fireplaces, stoves and inserts need the venting, clearances and electrical or gas planned before framing. Hot tubs and swim spas need a base and a circuit. Send us the plans early and we will flag what we see."],
      cta: "Tell us about your next job",
    },
  ],
};

export function welcomeEmail(o: { interest: string; step: 0 | 1 | 2; base: string; unsubscribeUrl: string; guideUrl?: string; name?: string }) {
  const seq = WELCOME[o.interest];
  if (!seq) throw new Error(`No welcome sequence for interest "${o.interest}"`);
  const s = seq[o.step];
  const paragraphs = [...(o.step === 0 && o.name ? [`Hi ${o.name},`] : []), ...s.paragraphs];
  const bullets = s.guide && o.guideUrl ? undefined : s.bullets;
  const { html, text } = renderEmail({
    preheader: s.preheader,
    heading: s.heading,
    paragraphs: s.guide && o.guideUrl ? [...paragraphs, `Read it here: ${o.guideUrl}`] : paragraphs,
    bullets,
    cta: { label: s.cta, href: bookingUrl(o.base, o.interest, `welcome-${o.interest}`, `e${o.step + 1}`) },
    unsubscribeUrl: o.unsubscribeUrl,
  });
  return { subject: s.subject, html, text };
}

/**
 * Sends one welcome email. Nothing in the app calls this: the sequence is not scheduled.
 * Pass dryRun: true to render without sending.
 */
export async function sendWelcomeEmail(o: Parameters<typeof welcomeEmail>[0] & { to: string; dryRun?: boolean }): Promise<MailResult & { subject: string }> {
  const m = welcomeEmail(o);
  if (o.dryRun) return { ok: true, skipped: true, subject: m.subject };
  const r = await sendMail({
    to: o.to,
    subject: m.subject,
    text: m.text,
    html: m.html,
    headers: { "List-Unsubscribe": `<${o.unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  });
  return { ...r, subject: m.subject };
}

// TODO-confirm before scheduling (shown to Jeramey in the PR, never rendered):
//  - Cam & Susan's OK on every line of copy (public-facing).
//  - "Venting parts counter stocks the common pieces": counter exists per the site; stock claim is general.
//  - Swim spa try-out: confirm a running swim spa is available to try in the showroom.
//  - Builder list: confirm there is a quarterly builder update to send, and what is in it.
//  - Pre-owned heads-up window (48h in Plan v4.1) deliberately NOT promised in email copy.
