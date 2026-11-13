// Journal (blog) content shapes, tags, and the code-default posts.
// Live posts come from Sanity documents of type "post" (studio/post-schema.ts). The posts below are
// the fallback that always renders, so /journal is never empty. A Sanity post with the same slug
// replaces its code default; set that post's status to "draft" in Sanity to retire a default.
//
// TODO-confirm markers: every shop-specific claim in these defaults is listed in the PR for
// Cam & Susan to check. Marked in code with `TODO-confirm` comments, not in the published copy.

export type JournalStatus = "draft" | "approved" | "scheduled" | "published";
export type JournalSeason = "winter" | "spring" | "summer" | "fall" | "year-round";
export type GbpCta = "LEARN_MORE" | "CALL" | "BOOK" | "ORDER" | "SHOP" | "SIGN_UP";

/** Subset of Sanity portable text the journal renders (block, list, link/strong/em marks). */
export type PortableSpan = { _type: "span"; _key?: string; text: string; marks?: string[] };
export type PortableBlock = {
  _type: "block";
  _key?: string;
  style?: "normal" | "h2" | "h3" | "blockquote";
  listItem?: "bullet" | "number";
  level?: number;
  children: PortableSpan[];
  markDefs?: { _key: string; _type: "link"; href: string }[];
};

export type SocialVariants = {
  facebook?: string;
  instagram?: { caption?: string; hashtags?: string[] };
  gbp?: { text?: string; cta?: GbpCta };
};

export type JournalPost = {
  _id: string;
  title: string;
  slug: string;
  tags: string[];
  season?: JournalSeason;
  /** Cloudinary public ID (cloud tolowa-studio). */
  heroImage: string;
  heroAlt: string;
  excerpt: string;
  body: PortableBlock[];
  social?: SocialVariants;
  status: JournalStatus;
  /** True once any channel has a posted link: the post stays on the site even if it was sent back to Draft, so a live Facebook link never 404s. */
  posted?: boolean;
  /** ISO date/time. Posts with a future value stay off the site and out of the queue. */
  publishAt?: string;
  updatedAt?: string;
};

/** Line / interest tags. IDs match src/lib/interests.ts where they overlap. */
export const JOURNAL_TAGS = [
  { id: "hot-tub", label: "Hot tubs" },
  { id: "swim-spa", label: "Swim spas" },
  { id: "pool", label: "Swimming pools" },
  { id: "pre-owned", label: "Pre-owned spas" },
  { id: "spa-care", label: "Pool & spa care" },
  { id: "hearth", label: "Fireplaces & stoves" },
  { id: "venting", label: "Venting" },
  { id: "local", label: "Around Wenatchee" },
] as const;

export const JOURNAL_TAG_IDS = JOURNAL_TAGS.map((t) => t.id) as readonly string[];
export const tagLabel = (id: string) => JOURNAL_TAGS.find((t) => t.id === id)?.label ?? id;

// ---- Tiny authoring helpers for the code-default posts ----
let seq = 0;
const key = () => `s${(seq++).toString(36)}`;
const span = (text: string): PortableSpan => ({ _type: "span", _key: key(), text });
const block = (text: string, extra: Partial<PortableBlock> = {}): PortableBlock => ({ _type: "block", _key: key(), style: "normal", children: [span(text)], ...extra });
const p = (text: string) => block(text);
const h2 = (text: string) => block(text, { style: "h2" });
const ul = (items: string[]) => items.map((t) => block(t, { listItem: "bullet", level: 1 }));

const PHONE = "(509) 667-8833";

export const DEFAULT_POSTS: JournalPost[] = [
  {
    _id: "post-default-hot-tub-through-a-wenatchee-freeze",
    title: "Getting your hot tub through a Wenatchee freeze",
    slug: "hot-tub-through-a-wenatchee-freeze",
    tags: ["hot-tub", "spa-care", "local"],
    season: "winter",
    heroImage: "seasonally-living/brand/calspas/hot-tub-underglow-night",
    heroAlt: "A Cal Spas hot tub glowing at night",
    excerpt: "A hot tub is built for winter. When a hard freeze comes, the trouble almost always starts the same way: the tub stops. Here is how to keep it running.",
    body: [
      p("A hot tub is built for winter. A cold snap is when it earns its keep, as long as it keeps running. When a freeze does damage, it almost always started with the tub stopping: the power went out, the water stopped moving, or the cover was off."),
      h2("Keep it running"),
      p("Leave the tub on and at its normal temperature through the cold. Most modern hot tubs have freeze protection, which turns the pump and heater on by itself when the water temperature drops close to freezing. That only works if the tub has power and water is free to flow."),
      p("Resist the urge to turn the heat way down to save money in January. A tub held at its usual temperature is the safest tub in a freeze."),
      h2("Cover on, latched and clear"),
      ...ul([
        "Keep the cover on and the straps latched, so heat stays in and wind can't get under it.",
        "Brush heavy snow off with a soft broom. Don't chip at ice with a shovel; you'll tear the cover.",
        "A cover that has soaked up water is heavy and has lost its insulation. If yours feels like a wet mattress, it's time to look at a new one.",
      ]),
      h2("Check these before the cold hits"),
      ...ul([
        "Power: press the test button on the GFCI, then reset it. A tub that has quietly tripped is a tub that is not protecting itself.",
        "Water level: keep it above the skimmer so the pump never runs dry.",
        "Filter: a clogged filter chokes the flow. Rinse it or swap it for a clean one before the weather turns.",
        "The cabinet: keep snow from piling against the side panels, and don't block the equipment access.",
      ]),
      h2("If the power goes out"),
      p("A full tub with a good cover holds its heat for a long time. It will not hold it forever in a deep freeze. If the power is out and the temperature is going to stay well below freezing, don't wait to see what happens. Call the shop. Draining a tub and clearing the lines is the safe move for a long outage, and it is worth having someone walk you through it before you ever need it."),
      h2("If something has already frozen"),
      p("Don't force anything, and don't switch the tub back on to see if it works. A pump running against a frozen line can be damaged. Turn the breaker off and call us."),
      p(`Questions about your own tub? Call the shop at ${PHONE} or stop by the showroom in Wenatchee.`),
    ],
    social: {
      facebook:
        "Cold snap coming? Your hot tub can handle it, as long as it keeps running.\n\nThree things to do before the freeze: test the GFCI, keep the water above the skimmer, and make sure the cover is latched and clear of heavy snow. Leave the tub on at its normal temperature; it has freeze protection that only works when it has power and moving water.\n\nThe whole checklist is on our journal.",
      instagram: {
        caption:
          "Cold snap coming? A hot tub is built for winter. It just needs to keep running.\n\nBefore the freeze: test the GFCI, keep the water above the skimmer, latch the cover, brush off heavy snow. Don't turn the heat way down.\n\nFull checklist on the journal (link in bio).",
        hashtags: ["#wenatchee", "#wenatcheewa", "#hottub", "#hottubtips", "#winterready", "#seasonallyliving"],
      },
      gbp: {
        text: "Cold snap coming? Keep your hot tub running. Leave it at its normal temperature, test the GFCI, keep the water above the skimmer and keep the cover latched and clear of heavy snow. If the power goes out for a long freeze, call the shop before anything freezes. Our full freeze checklist is on the journal.",
        cta: "LEARN_MORE",
      },
    },
    status: "published",
    publishAt: "2026-11-12T08:00:00-08:00",
  },
  {
    _id: "post-default-burn-ban-stages-explained",
    title: "Burn-ban stages explained: which fires you can still use",
    slug: "burn-ban-stages-explained",
    tags: ["hearth", "local"],
    season: "fall",
    heroImage: "seasonally-living/brands/stuv/hero",
    heroAlt: "A Stûv wood stove",
    excerpt: "When the air stalls in the valley, a burn ban can shut down your fireplace overnight. Here is what the two stages mean, and which fires keep going.",
    body: [
      p("Some winter days the air in the valley just sits. When it does, the state can call a burn ban to keep smoke from building up. If you heat with wood, or you're thinking about a stove, it helps to know what the stages mean before the first one is called."),
      h2("Stage 1"),
      p("A Stage 1 ban stops burning in open fireplaces and in older, uncertified wood stoves. Stoves and inserts that are certified as clean-burning (EPA-certified, or certified by Washington State) can generally still be used."),
      h2("Stage 2"),
      p("A Stage 2 ban is stricter. It covers almost all wood burning, including certified stoves and inserts. There are narrow exceptions, such as a home where a wood stove is the only adequate source of heat. If you think that's you, check the rules for your area and don't guess."),
      h2("What keeps going either way"),
      p("Gas, propane and electric fireplaces and inserts are not part of a burn ban. That is the main reason many people add one: it is heat and a fire to sit by on the days wood is off the table."),
      h2("Before you light anything"),
      ...ul([
        "Check the current burn-ban status for your county on the Washington Department of Ecology website. Bans are called day by day, and the rules can change.",
        "If you burn wood, burn it dry. Wet wood makes more smoke, whatever stove it goes in.",
        "Know whether your stove or insert is certified. The label on the back or the manual will say; if you can't find it, bring us a photo and we'll help you read it.",
      ]),
      p("Not sure which fire fits how you live? Our fireplaces page walks through every kind we carry, and the showroom has them burning."),
    ],
    // TODO-confirm: stage definitions against current WA Ecology rules and who calls bans in Chelan and Douglas counties.
    social: {
      facebook:
        "Burn ban called and wondering what you can still use?\n\nStage 1: open fireplaces and uncertified stoves are out. Certified stoves and inserts can generally keep going.\nStage 2: almost all wood burning stops, certified stoves too (with narrow exceptions).\nGas, propane and electric fireplaces aren't part of a burn ban.\n\nAlways check today's status with the Washington Department of Ecology before you light. More on our journal.",
      instagram: {
        caption:
          "Burn ban days, explained.\n\nStage 1: open fireplaces and uncertified stoves stop. Certified stoves and inserts can generally keep going.\nStage 2: almost all wood burning stops.\nGas, propane and electric: not part of a burn ban.\n\nCheck today's status with Washington Ecology before you light. Full guide on the journal (link in bio).",
        hashtags: ["#wenatchee", "#burnban", "#woodstove", "#fireplace", "#gasfireplace", "#seasonallyliving"],
      },
      gbp: {
        text: "Burn ban called? Stage 1 stops open fireplaces and uncertified stoves; certified stoves and inserts can generally keep going. Stage 2 stops almost all wood burning. Gas, propane and electric fireplaces aren't part of a burn ban. Check today's status with the Washington Department of Ecology before you light. Our guide explains the stages.",
        cta: "LEARN_MORE",
      },
    },
    status: "published",
    publishAt: "2026-11-12T08:00:00-08:00",
  },
  {
    _id: "post-default-what-certified-pre-owned-should-mean",
    title: "What “certified pre-owned” should mean for a hot tub",
    slug: "what-certified-pre-owned-should-mean",
    tags: ["pre-owned", "hot-tub"],
    season: "year-round",
    heroImage: "seasonally-living/brand/calspas/escape-patio",
    heroAlt: "A hot tub on a patio",
    excerpt: "A used hot tub can be a very good buy, or an expensive lesson. The difference is what was checked before it was sold. Here is what to ask any seller.",
    body: [
      p("A pre-owned hot tub can be a very good buy. It can also be an expensive lesson. The difference is almost always what was checked before it was sold to you. “Certified” and “inspected” are only words until someone tells you what was actually done."),
      h2("Ask for it in plain words"),
      ...ul([
        "What was inspected, tested or replaced? You should get a plain answer, not “it runs great.”",
        "Was it filled and run? A tub that has been heated and circulated for a few days shows you problems a quick look won't.",
        "Does it hold water? Ask whether the shell, plumbing and fittings were checked for leaks.",
        "What does the equipment look like: pumps, heater, control panel, jets and lights?",
        "How is the cover? A worn cover is a cost you should know about up front.",
        "What is the warranty, if any, and is it in writing?",
      ]),
      h2("Know what it needs at your house"),
      p("Before you fall for a tub, check what it needs. Many full-size hot tubs run on 240 volts and need their own dedicated circuit, and a pad or deck that can carry the weight of a full tub. Ask for the electrical requirement and the dimensions. We list those, along with seats and year, on each spa's page."),
      h2("What we put on each spa's page"),
      p("On our pre-owned spa pages, the “What our shop did” section says what the shop inspected, tested or replaced on that spa. We don't post prices; call us and we'll talk through the spa and your yard."),
      p(`See what is on the floor right now, or call the shop at ${PHONE}.`),
    ],
    // TODO-confirm: that every pre-owned spa gets run/tested by the shop before listing, and what warranty (if any) the shop offers.
    social: {
      facebook:
        "Thinking about a pre-owned hot tub? Good idea. Just ask the seller:\n\n- What was inspected, tested or replaced?\n- Was it filled and run for a few days?\n- Was it checked for leaks?\n- What shape is the cover in?\n- Is there a warranty, in writing?\n\nOur spa pages list what our shop did. See what's here this week on the journal.",
      instagram: {
        caption:
          "Pre-owned hot tub shopping? Ask these:\n\n1. What was inspected, tested or replaced?\n2. Was it filled and run?\n3. Checked for leaks?\n4. How's the cover?\n5. Warranty in writing?\n\nSee what's on our floor (link in bio).",
        hashtags: ["#wenatchee", "#preowned", "#hottub", "#usedhottub", "#spa", "#seasonallyliving"],
      },
      gbp: {
        text: "Buying a pre-owned hot tub? Ask what was inspected, tested or replaced, whether it was filled and run, whether it was checked for leaks, how the cover looks, and what the warranty is in writing. Our spa pages list what our shop did. See what's here this week.",
        cta: "LEARN_MORE",
      },
    },
    status: "published",
    publishAt: "2026-11-12T08:00:00-08:00",
  },
  {
    _id: "post-default-why-we-design-venting-first",
    title: "Why we design venting before we sell a stove",
    slug: "why-we-design-venting-first",
    tags: ["venting", "hearth"],
    season: "fall",
    heroImage: "seasonally-living/brands/kuma/hero",
    heroAlt: "A Kuma wood stove",
    excerpt: "The stove is the part you'll look at. The venting is the part that decides whether it works. It's why we start there.",
    body: [
      p("The stove is the part you'll look at every evening. The venting is the part that decides whether the stove works at all, whether it's safe, and whether it burns clean. So the venting comes first."),
      h2("Venting decides which stove fits"),
      p("Every stove has a manufacturer's requirements for the chimney or vent it can use: the size, the type of pipe, how far it has to stay from walls and ceilings, and where it can come out. Your house decides what's possible. A low ceiling, a long run, or a wall that's too close can rule out a stove you love, and it's far better to learn that in the showroom than after delivery day."),
      h2("A rule of thumb worth knowing"),
      p("For a chimney going through a roof, the common rule is the 3-2-10 rule: the top of the chimney should be at least 3 feet above the point where it passes through the roof, and at least 2 feet higher than anything within 10 feet of it. It exists for a reason: height gives a stove its draw, and clearing the roof line keeps wind from pushing smoke back down."),
      h2("What we look at first"),
      ...ul([
        "Is there existing venting, and what shape is it in?",
        "If not, what is the cleanest route up and out?",
        "What clearances does the stove you want need, and does the room give them?",
        "What does the permit and inspection side look like?",
      ]),
      h2("Then the stove"),
      p("Once we know what your house can take, choosing a stove is the fun part. We carry Stûv, Kuma, Morsø and Napoleon, and with the venting figured out we can tell you honestly which ones will work in your room."),
      p(`Bring a photo of the room and the spot you're picturing. Or call the shop at ${PHONE}.`),
    ],
    // TODO-confirm: that the shop's process is literally "design the venting before quoting a stove", and that the shop handles the permit.
    social: {
      facebook:
        "Why do we start with the venting before we talk stoves?\n\nBecause the venting decides which stove fits your house, whether it's safe and whether it burns clean. A low ceiling, a long run or a wall that's too close can rule out a stove you love, and it's better to learn that before delivery day.\n\nBring a photo of your room and we'll take a look. More on our journal.",
      instagram: {
        caption:
          "The stove is what you'll look at. The venting decides if it works.\n\nThat's why we start there: ceiling height, the route up and out, clearances to walls. Then we choose the stove.\n\nBring us a photo of your room. More on the journal (link in bio).",
        hashtags: ["#wenatchee", "#woodstove", "#venting", "#chimney", "#fireplace", "#seasonallyliving"],
      },
      gbp: {
        text: "Thinking about a wood stove? Start with the venting. It decides which stove fits your house, whether it is safe and whether it burns clean. Bring a photo of your room and the spot you have in mind, and we'll look at the route and the clearances with you.",
        cta: "LEARN_MORE",
      },
    },
    status: "published",
    publishAt: "2026-11-12T08:00:00-08:00",
  },
];
