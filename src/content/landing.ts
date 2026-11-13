import { IMG } from "./pages";
import type { Item, RichTitle, Seo } from "./types";

// Campaign landing pages (/lp/[campaign]). Code defaults; a Sanity "landingPage" document with id
// "landingPage-<slug>" overrides any field. Claims here are limited to what the rest of the site already
// says (src/content/pages.ts, brands.ts). Anything not on the site is listed as TODO-confirm in the PR.

export type LandingContent = {
  _type: "landingPage";
  slug: string;
  seo: Seo;
  /** Lead-form interest tag (src/lib/interests.ts). */
  interest: string;
  hero: { kicker: string; title: RichTitle; lead: string; image: string; alt: string; position?: string; cta: string };
  points: { title: string; items: Item[] };
  feature: { kicker: string; title: string; body: string; bullets: string[]; image: string; alt: string };
  form: { title: string; lead: string };
};

export const LANDING_SLUGS = [
  "hot-tubs-wenatchee",
  "pre-owned-hot-tubs",
  "gas-inserts-burn-ban",
  "stuv-wood-stoves",
  "pool-planning-2027",
  "swim-spas",
] as const;
export type LandingSlug = (typeof LANDING_SLUGS)[number];

const lp = (c: Omit<LandingContent, "_type">): LandingContent => ({ _type: "landingPage", ...c });

export const LANDING_PAGES: LandingContent[] = [
  lp({
    slug: "hot-tubs-wenatchee",
    seo: { title: "Cal Spas Hot Tubs in Wenatchee", description: "Try a Cal Spas hot tub at our Wenatchee showroom. Official Cal Spas dealer: delivery, setup, orientation and service." },
    interest: "hot-tub",
    hero: { kicker: "Hot tubs · Official Cal Spas dealer", title: { before: "The winter soak, ", emphasis: "every night." }, lead: "Sit in a running Cal Spas tub at our Wenatchee showroom before you decide. We deliver it, set it up and show you how to care for it.", image: IMG.csPlatinum, alt: "A Cal Spas Platinum hot tub on a garden patio", cta: "Book a try-out" },
    points: { title: "The tub is half of it. The rest is us.", items: [
      { title: "Try before you buy", body: "Models filled and running in the showroom. Bring a swimsuit if you like." },
      { title: "Delivered and set up", body: "Site prep, pads and electrical planning, delivery, placement and start-up." },
      { title: "Still here in year eight", body: "Orientation for every buyer, and service from the people who set it up." },
    ] },
    feature: { kicker: "A tub for every backyard", title: "Two seats or seven.", body: "Compact tubs for couples, full-size tubs for the whole family, and hydrotherapy seats for backs and shoulders. We'll match seats, jets and size to how you'll actually use it.", bullets: ["Official Cal Spas dealer", "Showroom on Maiden Ln, next to Home Depot", "Bring a photo of the spot in your yard"], image: IMG.csMountain, alt: "A Cal Spas hot tub on a stone patio with mountains behind" },
    form: { title: "Book a try-out", lead: "Tell us when you can come by and we'll have a few tubs warm. We reply within one business day." },
  }),
  lp({
    slug: "pre-owned-hot-tubs",
    seo: { title: "Pre-owned Hot Tubs in Wenatchee", description: "Pre-owned hot tubs inspected and repaired by the Seasonally Living shop in Wenatchee. Ask what's on the floor." },
    interest: "pre-owned",
    hero: { kicker: "Pre-owned spas", title: { before: "A great tub, ", emphasis: "for less." }, lead: "Every trade-in comes back through our own shop. It's inspected, repaired and cleaned before it goes on the floor. Ask what's here now.", image: IMG.hotTubSnow, alt: "A hot tub in a snowy forest", cta: "Ask about a spa" },
    points: { title: "From trade-in to your backyard.", items: [
      { title: "Inspected", body: "Our techs check pumps, heater, controls, jets and shell before anything is listed." },
      { title: "Repaired and cleaned", body: "Worn parts replaced, lines flushed and the tub cleaned and sanitized." },
      { title: "Delivered", body: "We deliver and set it up the same way we do a new tub." },
    ] },
    feature: { kicker: "Inventory changes week to week", title: "Tell us what you're after.", body: "Call or ask below and we'll tell you what's on the floor and what's coming. Trading up? We'll take a look at your old tub and give you a straight number.", bullets: ["Call for price on any spa", "Trade-in toward new or pre-owned", "We haul the old one away"], image: IMG.csEscape, alt: "A Cal Spas Escape hot tub on a patio" },
    form: { title: "Ask about a spa", lead: "Tell us what you're looking for. We'll call or email within one business day with what's on the floor." },
  }),
  lp({
    slug: "gas-inserts-burn-ban",
    seo: { title: "Gas & Electric Fireplace Inserts in Wenatchee", description: "Gas and electric inserts that keep the room warm on burn-ban days, installed and vented by Seasonally Living in Wenatchee." },
    interest: "hearth",
    hero: { kicker: "Gas & electric inserts", title: { before: "Warm on burn-ban days, ", emphasis: "at the touch of a button." }, lead: "A gas or electric insert turns an old, drafty fireplace into clean, instant heat. No ash and no wood to haul. We fit the insert and the venting.", image: IMG.gasLinear, alt: "A modern linear fireplace in a bright room with big windows", cta: "Book a fireplace consult" },
    points: { title: "Warmth without the work.", items: [
      { title: "Instant heat", body: "Realistic flames and glowing embers at the touch of a button, with settings you control." },
      { title: "Clean and simple", body: "No ash, no wood to haul and stack. Heat where you spend your evenings." },
      { title: "Burn-ban friendly", body: "When air quality bans stop wood burning, gas and electric keep the room warm." },
    ] },
    feature: { kicker: "Installed by our crew", title: "Venting done right.", body: "A gas insert needs proper venting and a clean install. Venting has been our trade since 1979, when we started as Chim Chimney.", bullets: ["Venting designed for the appliance", "Inserts fitted to existing masonry", "See gas, electric and Stûv side by side in the showroom"], image: IMG.electricMantel, alt: "A fireplace insert set in a white mantel" },
    form: { title: "Book a fireplace consult", lead: "Send a photo of your fireplace if you have one. We'll call or email within one business day." },
  }),
  lp({
    slug: "stuv-wood-stoves",
    seo: { title: "Stûv Wood Stoves in Wenatchee", description: "Stûv wood stoves, inserts and fireplaces in Wenatchee, installed and vented by Seasonally Living." },
    interest: "hearth",
    hero: { kicker: "Stûv · Wood stoves & fireplaces", title: { before: "Stûv: ", emphasis: "the fire, designed." }, lead: "Belgian wood stoves, inserts and fireplaces with big windows on the fire. We help you pick the model, then design and install the venting so it burns the way it should.", image: "seasonally-living/brands/stuv/s-21-sf-2", alt: "A double-sided Stûv 21 wood fireplace burning in a brick wall between two rooms", cta: "Book a stove consult" },
    points: { title: "A fire you can actually watch.", items: [
      { title: "Designed to be seen", body: "Wide windows on every model, frameless glass on the Stûv 21, and a Stûv 30 that turns to face the room." },
      { title: "Clean-burning", body: "Most Stûv stoves and inserts are EPA certified for North America. We'll show you which fits your home." },
      { title: "Vented by our crew", body: "Venting and clearances sized to the stove, installed by the people who've done it since 1979." },
    ] },
    feature: { kicker: "See them burning", title: "Compare in the showroom.", body: "Stoves, inserts and fireplaces from Stûv, Kuma and Morsø, and gas and electric inserts too. Bring the room dimensions and a photo and we'll give you a straight answer.", bullets: ["Stûv s[16], s[30C] and s[21] families", "Wood, gas and electric side by side", "Venting design and install"], image: IMG.stoveMinimal, alt: "A modern wood stove burning in a bright living room" },
    form: { title: "Book a stove consult", lead: "Tell us about the room and any existing fireplace. We'll call or email within one business day." },
  }),
  lp({
    slug: "pool-planning-2027",
    seo: { title: "Pool Installation: Spring 2027 Waitlist", description: "Join the spring 2027 pool install list. In-ground pools installed by Seasonally Living's own crew in Wenatchee and North Central Washington." },
    interest: "pool",
    hero: { kicker: "Pools · Spring 2027 installs", title: { before: "Your pool, ", emphasis: "installed by our crew." }, lead: "Spring 2027 install slots are limited. Join the list now to hold your place in the design queue. Design consults start as the season opens.", image: IMG.poolBlueHour, alt: "Modern home with a pool at blue hour", cta: "Join the spring install list" },
    points: { title: "Plan in winter. Install in spring.", items: [
      { title: "Join the list", body: "Tell us about the site and what you want. That holds your place in the design queue." },
      { title: "Design and permits", body: "Layout, equipment and permits are planned before the ground thaws." },
      { title: "Install", body: "Our own crew installs the pool and the surround from spring into summer." },
    ] },
    feature: { kicker: "Who it's for", title: "One crew, design to first swim.", body: "Most of our pool clients own their land, want to swim within the year and want one accountable crew. Add a Cal Spas hot tub or swim spa to the plan and we'll set it up alongside.", bullets: ["Own the site", "Swimming within 12 months", "Decking and surround planned with the pool"], image: IMG.poolNight, alt: "Pool lit at night" },
    form: { title: "Join the spring install list", lead: "No visit needed yet. Tell us about the site and we'll be in touch about a design consult." },
  }),
  lp({
    slug: "swim-spas",
    seo: { title: "Swim Spas in Wenatchee: Cal Spas Swim Pro", description: "Cal Spas Swim Pro and Swim Pro X swim spas in Wenatchee. Book a dry consult now; wet tests open in spring." },
    interest: "swim-spa",
    hero: { kicker: "Swim spas · Cal Spas Swim Pro", title: { before: "Swim all year. ", emphasis: "In the backyard." }, lead: "A current to swim against, a place to train and a place to soak, in a fraction of a pool's space. Plan it this winter, swim this spring.", image: IMG.csSwimPro, alt: "A Cal Spas Swim Pro swim spa in a backyard garden", cta: "Book a swim spa consult" },
    points: { title: "Pool fitness, hot tub warmth.", items: [
      { title: "Train in any weather", body: "Adjustable current for swimming, water walking and low-impact workouts." },
      { title: "Therapy built in", body: "Jets and warm water for recovery after a long day." },
      { title: "Fits where a pool won't", body: "A fraction of the space and the upkeep of an in-ground pool." },
    ] },
    feature: { kicker: "Dry consult now, wet test in spring", title: "Swim Pro or Swim Pro X?", body: "Over the winter we do dry consults: sizing, placement, electrical and delivery. Wet tests run April through September, and the waitlist opens in February.", bullets: ["Site and access check", "Electrical and base planning", "Swim Pro for everyday fitness, Swim Pro X for performance"], image: IMG.csSwimCommander, alt: "A Cal Spas Commander swim spa on a backyard patio" },
    form: { title: "Book a swim spa consult", lead: "Tell us about the spot in your yard. We'll call or email within one business day." },
  }),
];
