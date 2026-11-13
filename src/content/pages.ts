import type { AboutContent, FireplacesContent, HomeContent, LineContent, ServiceContent, SimpleContent, PageContent } from "./types";

// Default copy for every page. It seeds Sanity (scripts/seed-sanity.ts) and is the fallback
// if Sanity is unreachable. Edit live copy in the Studio, not here.
const B = "seasonally-living/brand/";
export const IMG = {
  // Cal Spas (official dealer; manufacturer imagery approved)
  csUnderglow: B + "calspas/hot-tub-underglow-night",
  csMountain: B + "calspas/hot-tub-mountain-patio",
  csEscape: B + "calspas/escape-patio",
  csPlatinum: B + "calspas/platinum-patio",
  csPlatinumCourtyard: B + "calspas/platinum-courtyard",
  csSwimPro: B + "calspas/swim-pro-garden",
  csSwimProX: B + "calspas/swim-pro-x-garden",
  csSwimX: B + "calspas/swim-x-2026",
  csSwimCommander: B + "calspas/swim-commander-f1655",
  // Licensed stock
  flames: B + "stock/flames",
  stoveMinimal: B + "stock/stove-minimal",
  stoveLiving: B + "stock/stove-living",
  gasLinear: B + "stock/gas-linear",
  electricMantel: B + "stock/electric-mantel",
  mantelBrick: B + "stock/mantel-brick",
  masonryFire: B + "stock/masonry-fire",
  chimneySmoke: B + "stock/chimney-smoke",
  chimneyBrick: B + "stock/chimney-brick",
  hotTubSnowPeople: B + "stock/hot-tub-snow-people",
  hotTubSnow: B + "stock/hot-tub-snow",
  water: B + "stock/water",
  poolBlueHour: B + "stock/pool-blue-hour",
  poolNight: B + "stock/pool-night",
  // Family photo (Susan McNeill, used with permission)
  mcneillFamily: B + "people/mcneill-family",
  // North Central Washington, photographed by Susan McNeill (used with permission)
  localLupine: B + "local/lupine-mountains",
  localBalsamroot: B + "local/balsamroot-hillside",
  localGreenValley: B + "local/green-valley",
  localRiver: B + "local/river-mountains",
  localFallReflection: B + "local/fall-reflection",
  localSnowPeaks: B + "local/snowy-peaks-valley",
  localValley: B + "local/valley-overview",
} as const;

export const HOME: HomeContent = {
  _type: "homePageV2",
  pageId: "/",
  seo: {
    title: "Seasonally Living | Cal Spas Hot Tubs, Swim Spas & Stûv Fireplaces in Wenatchee",
    description:
      "Wenatchee's home resort showroom: Cal Spas hot tubs and swim spas, pre-owned spas, swimming pool installation, Stûv wood stoves, gas and electric inserts, and venting done right.",
  },
  hero: {
    kicker: "Hero",
    credential: "Official Cal Spas dealer · Wenatchee showroom, next to Home Depot",
    title: { before: "Your home resort, ", emphasis: "all four", after: " seasons." },
    lead: "Soak, swim and fire. Cal Spas hot tubs and swim spas, swimming pools installed by our own crew, and Stûv stoves with the venting done right, all from one North Central Washington showroom.",
    image: IMG.csUnderglow,
    alt: "A Cal Spas hot tub glowing on a patio at night",
    position: "center 55%",
    caption: "Cal Spas · Underglow lighting",
    cta: "Book a showroom visit",
    secondaryCta: "See Cal Spas hot tubs",
    secondaryHref: "/hot-tubs",
  },
  stuv: {
    kicker: "This winter's fire",
    title: "Stûv: the fire, designed.",
    body: "Stûv builds wood stoves, inserts and fireplaces in Belgium and adapts them for North America. Clean lines, a fire you can actually watch, and serious heat. We help you pick the model, then design and install the venting so it burns the way it should.",
    models: [
      { name: "s[16]", body: "Compact stoves, cube to tall" },
      { name: "s[30C]", body: "The rotating three-door classic" },
      { name: "s[21]", body: "Single and double-sided fireplaces" },
    ],
    image: IMG.stoveMinimal,
    alt: "A modern wood stove burning in a bright living room",
    cta: "Explore Stûv",
    secondaryCta: "How we vent it",
  },
  venting: {
    kicker: "Venting",
    title: "A stove is only as good as its venting.",
    body: "We started as Chim Chimney in 1979, and venting is still the heart of the trade. We design and install the venting for every stove and insert we sell, inspect the venting you already have, and keep one of the region's largest venting parts counters.",
    cta: "Book a venting consult",
    cards: [
      { icon: "shield", title: "Sized and installed to code", body: "Venting and clearances matched to the appliance." },
      { icon: "clock", title: "Before the first cold night", body: "Fall venting inspections so your stove is ready for burn season." },
    ],
  },
  lines: {
    kicker: "The home resort",
    title: "Soak, swim and fire.",
    lead: "Nine ways to live for the season. Everything we sell, we deliver, install and service ourselves.",
    items: [
      { href: "/hot-tubs", kicker: "Soak", title: "Cal Spas hot tubs", body: "Try one in the showroom. Delivery, setup and orientation with every tub.", image: IMG.csEscape },
      { href: "/swim-spas", kicker: "Swim", title: "Swim spas", body: "Cal Spas Swim Pro and Swim Pro X. Dry consults now, wet tests in spring.", image: IMG.csSwimPro },
      { href: "/pre-owned", kicker: "Soak", title: "Pre-owned spas", body: "Inspected, repaired trade-ins. Browse what's on the floor and ask about any spa.", image: IMG.csPlatinumCourtyard },
      { href: "/pools", kicker: "Swim", title: "Swimming pools", body: "Installed by our own crew, with the surround that finishes it. Spring 2027 installs are planned this winter.", image: IMG.poolBlueHour },
      { href: "/spa-care", kicker: "Care", title: "Pool & spa chemicals", body: "Water care, filters and supplies at the showroom counter. Call ahead and we'll have it ready.", image: IMG.water },
      { href: "/fireplaces", kicker: "Fire", title: "Stûv stoves & fireplaces", body: "Belgian-designed wood stoves, inserts and fireplaces, installed and vented by our crew.", image: IMG.stoveLiving },
      { href: "/fireplaces/gas-electric", kicker: "Fire", title: "Gas & electric inserts", body: "Turn an old fireplace into clean, instant heat. No ash, and warm on burn-ban days.", image: IMG.gasLinear },
      { href: "/service", kicker: "Fire", title: "Venting", body: "Venting design and install, and venting inspections, since 1979.", image: IMG.flames },
      { href: "/hearth-supplies", kicker: "Fire", title: "Hearth & venting supplies", body: "Venting parts, mantels, screens and stove care on the shelf.", image: IMG.mantelBrick },
    ],
  },
  seasons: {
    kicker: "Live for the season",
    title: "Something worth doing every month of the year.",
    credit: "Photos of the valley by Susan McNeill.",
    items: [
      { name: "Winter", lead: "The winter soak, stoves and inserts", note: "Hot tubs under snow, burn-ban-ready heat, venting checks.", image: IMG.localSnowPeaks, alt: "Snow-capped peaks above green hills and the valley" },
      { name: "Spring", lead: "Swim spas, pool openings and pool installs", note: "Wet tests open. Pool installs break ground.", image: IMG.localLupine, alt: "Purple lupine and yellow balsamroot in bloom below a mountain" },
      { name: "Summer", lead: "Pool season and pre-owned value", note: "Chemicals at the counter, deliveries and pre-owned trade-ins.", image: IMG.localRiver, alt: "A clear mountain river running between evergreen trees" },
      { name: "Fall", lead: "Burn prep and venting", note: "Venting inspections and stove installs before the first cold night.", image: IMG.localFallReflection, alt: "Golden fall trees reflected in still water" },
    ],
  },
  showroom: {
    kicker: "Visit the showroom",
    title: "Try the water. Feel the heat.",
    body: "Tubs filled, stoves burning, no pressure. Bring a photo of the backyard or the room and we'll give you a straight answer on what fits.",
    image: IMG.csMountain,
    alt: "A Cal Spas hot tub on a stone patio with mountains behind",
    cta: "Book a visit",
  },
};

const line = (c: Omit<LineContent, "_type">): LineContent => ({ _type: "linePage", ...c });

export const LINES: LineContent[] = [
  line({
    pageId: "/hot-tubs",
    seo: { title: "Cal Spas Hot Tubs", description: "Try a Cal Spas hot tub in our Wenatchee showroom. Official Cal Spas dealer: delivery, setup, orientation and service from Seasonally Living." },
    interest: "hot-tub",
    hero: { kicker: "Hot tubs · Official Cal Spas dealer", title: { before: "The winter soak, ", emphasis: "every night." }, lead: "January in the valley is made for this. Sit in a running Cal Spas tub at the showroom before you decide, then let us deliver, set up and show you how to care for it.", image: IMG.csPlatinum, alt: "A Cal Spas Platinum hot tub on a garden patio", cta: "Book a try-out" },
    points: { kicker: "Why buy here", title: "The tub is half of it. The rest is us.", lead: "A hot tub is a ten-year decision. Buy it from people who'll still pick up the phone in year eight.", items: [
      { title: "Try before you buy", body: "Models filled and running in the showroom. Bring a swimsuit if you like." },
      { title: "Delivered and set up", body: "Site prep, pads and electrical planning, delivery, placement and start-up." },
      { title: "Orientation for every buyer", body: "We walk you through water care, filters and settings so it stays easy." },
    ] },
    models: { kicker: "Cal Spas", title: "A tub for every backyard.", lead: "Cal Spas builds hot tubs and swim spas around one idea: turn your backyard into a home resort. We'll help you match seats, jets and size to how you'll actually use it.", items: [
      { tag: "Couples", name: "Compact tubs", body: "Two to four seats, easy to place on a deck or patio, quick to heat." },
      { tag: "Family", name: "Full-size tubs", body: "Five to seven seats with a lounger, for the whole family on a cold night." },
      { tag: "Therapy", name: "Hydrotherapy tubs", body: "Targeted jet seats for backs, shoulders and feet after a day on the mountain." },
    ] },
    feature: { kicker: "Pre-owned", title: "Pre-owned, inspected and ready.", body: "Trade-ins come back through our shop, get inspected and repaired, and go up in the pre-owned gallery. Browse what's on the floor now.", bullets: ["Inspected and repaired by our techs", "Cleaned and sanitized", "Delivered like a new tub"], image: IMG.csEscape, alt: "A Cal Spas Escape hot tub on a patio" },
    magnet: { title: "Get the winter hot tub care guide.", body: "Freeze protection, water care in the cold, and when to call us. Pick pre-owned too and you'll see arrivals first." },
    closing: { title: "Come sit in one.", body: "The fastest way to choose a tub is to try a few. Book a time and we'll have them warm.", cta: "Book a try-out" },
    quickLinks: [
      { label: "See pre-owned spas", href: "/pre-owned" },
      { label: "Pool & spa care", href: "/spa-care" },
      { label: "Compare swim spas", href: "/swim-spas" },
    ],
  }),
  line({
    pageId: "/swim-spas",
    seo: { title: "Swim Spas: Cal Spas Swim Pro & Swim Pro X", description: "Cal Spas Swim Pro and Swim Pro X swim spas in Wenatchee: year-round swimming, exercise and hydrotherapy. Dry consults now, wet tests in spring." },
    interest: "swim-spa",
    hero: { kicker: "Swim spas · Cal Spas Swim Pro", title: { before: "Swim all year. ", emphasis: "In the backyard." }, lead: "A swim spa gives you a current to swim against, a place to train and a place to soak, at a fraction of a pool's cost and footprint.", image: IMG.csSwimPro, alt: "A Cal Spas Swim Pro swim spa in a backyard garden", cta: "Book a swim spa consult" },
    points: { kicker: "Is it right for you?", title: "Pool fitness, hot tub warmth.", lead: "We'll help you size it, place it and plan the install before spring.", items: [
      { title: "Train in any weather", body: "Adjustable current for swimming, water walking and low-impact workouts." },
      { title: "Therapy built in", body: "Jets and warm water for recovery after Mission Ridge or a long day." },
      { title: "Fits where a pool won't", body: "A fraction of the space, the permit work and the upkeep of an in-ground pool." },
    ] },
    models: { kicker: "Two models", title: "Swim Pro or Swim Pro X?", items: [
      { tag: "Everyday fitness", name: "Swim Pro", body: "For families, light swimmers and anyone who wants a low-impact way to stay active, with a smooth, steady current and seats for a soak.", bullets: ["Multi-speed swim jet system", "Hydrotherapy seating", "LED lighting and touch controls", "Energy-efficient insulation"] },
      { tag: "Performance", name: "Swim Pro X", body: "For serious swimmers: more power, more control and a deeper channel for full-body movement.", bullets: ["Elite Pro swim jets with higher resistance", "Deeper swim channel", "Upgraded controls and monitoring", "Reinforced shell and frame"] },
    ] },
    feature: { kicker: "How we sell swim spas", title: "Dry consult now. Wet test in spring.", body: "Over the winter we do dry consults: sizing, placement, electrical and delivery. Wet tests run April through September, and the waitlist opens in February.", bullets: ["Site and access check", "Electrical and base planning", "Spring wet-test waitlist"], image: IMG.csSwimCommander, alt: "A Cal Spas Commander swim spa on a backyard patio" },
    magnet: { title: "Swim spa vs. pool: the honest comparison.", body: "Cost, space, upkeep and what each is actually good for. No sales pitch." },
    closing: { title: "Plan it this winter, swim this spring.", body: "Book a dry consult and you'll be first on the wet-test list.", cta: "Book a swim spa consult" },
  }),
  line({
    pageId: "/pre-owned",
    seo: { title: "Pre-owned Hot Tubs", description: "Pre-owned hot tubs in Wenatchee, inspected and repaired by the Seasonally Living shop. Get on the list to see arrivals first." },
    interest: "pre-owned",
    hero: { kicker: "Pre-owned spas", title: { before: "A great tub, ", emphasis: "for less." }, lead: "Every trade-in comes back through our own shop. It's inspected, repaired and cleaned before it goes on the floor. Browse what's here now and ask about any spa.", image: IMG.hotTubSnow, alt: "A hot tub in a snowy forest", cta: "Ask about a spa" },
    points: { kicker: "How it works", title: "From trade-in to your backyard.", lead: "Pre-owned spas move fast, especially in winter. Call or stop in for prices; the list is the best way to see new arrivals first.", items: [
      { title: "Inspected", body: "Our techs check pumps, heater, controls, jets and shell before anything is listed." },
      { title: "Repaired and cleaned", body: "Worn parts replaced, lines flushed and the tub cleaned and sanitized." },
      { title: "Delivered", body: "We deliver and set it up the same way we do a new tub." },
    ] },
    feature: { kicker: "Trading up?", title: "Your old tub is worth something.", body: "If your tub is getting older, ask about trading it in toward a new Cal Spas tub or a pre-owned unit. We'll take a look and give you a straight number.", bullets: ["Trade-in toward new or pre-owned", "We haul the old one away", "Straight answers on repair vs. replace"], image: IMG.csMountain, alt: "A new Cal Spas hot tub on a stone patio" },
    magnet: { title: "See pre-owned arrivals first.", body: "Subscribers to the note hear about pre-owned tubs before they're posted anywhere else." },
    closing: { title: "Ask what's in the shop.", body: "Inventory changes week to week. Tell us what you're after and we'll tell you what's coming.", cta: "Ask about a spa" },
  }),
  line({
    pageId: "/spa-care",
    seo: { title: "Pool & Spa Chemicals and Care", description: "Pool and spa chemicals, filters, cover lifters, steps and handrails at the Seasonally Living showroom in Wenatchee, plus hot tub service." },
    interest: "hot-tub",
    hero: { kicker: "Pool & spa care", title: { before: "Clear water, ", emphasis: "all season." }, lead: "Pool and spa chemicals, filters and the accessories that make water easy to live with, plus people who can answer your questions. Call ahead and we'll have your order ready at the counter.", image: IMG.water, alt: "Sunlight on clear rippling water", cta: "Ask a water question" },
    points: { kicker: "At the counter", title: "Everything your water needs.", lead: "Stop by for supplies, or bring your questions about cloudy water, foam or a filter that won't stay clean.", items: [
      { title: "Pool chemicals", body: "Sanitizers, shock, balancers and clarifiers to keep pool water clear all summer." },
      { title: "Spa chemicals", body: "Sanitizers, balancers and clarifiers to keep hot tub and swim spa water clear and comfortable." },
      { title: "Filters & accessories", body: "Replacement filters for the tubs we sell and many we don't, plus steps, cover lifters and handrails." },
    ] },
    feature: { kicker: "Need a hand?", title: "Service from the people who installed it.", body: "Start-ups, repairs, winterizing and seasonal open and close for second homes around Chelan and Leavenworth.", bullets: ["Hot tub start-ups and repairs", "Winterizing", "Seasonal open & close"], image: IMG.hotTubSnowPeople, alt: "Two people in a steaming hot tub above a snowy forest" },
    magnet: { title: "Get the winter hot tub care guide.", body: "Freeze protection, water care in the cold and when to call us." },
    closing: { title: "Questions about your water?", body: "Call or stop in. We'll help you sort it out, and we can have your chemicals ready when you arrive.", cta: "Ask a water question" },
  }),
  line({
    pageId: "/pools",
    seo: { title: "Swimming Pool Installation", description: "In-ground swimming pool installation by Seasonally Living's own crew in Wenatchee and North Central Washington. Plan this winter for spring 2027 installs." },
    interest: "pool",
    hero: { kicker: "Pools · Spring 2027 installs", title: { before: "Your pool, ", emphasis: "installed by our crew." }, lead: "We install swimming pools with our own crew, from the first consult to the first swim, along with the decking and surround that finish the space. Winter is when the planning happens, so installation can start when the ground thaws.", image: IMG.poolBlueHour, alt: "Modern home with a pool at blue hour", cta: "Join the spring install list" },
    points: { kicker: "How an install works", title: "Plan in winter. Install in spring.", lead: "Spring 2027 install slots are limited. Getting on the list now holds your place in the design queue.", items: [
      { title: "Design consult", body: "We talk budget, site, timeline and how you'll use it, with the crew who'll install it." },
      { title: "Plan and permit", body: "Layout, equipment and permits handled over the winter." },
      { title: "Install", body: "Our crew installs the pool and its surround from spring into summer, with a clear schedule from day one." },
    ] },
    models: { kicker: "Outdoor pool projects", title: "The pool and everything around it.", lead: "A pool is the center of the yard. We plan the pieces around it at the same time, so it all works on the first warm day.", items: [
      { tag: "Pool", name: "Pool installation", body: "An in-ground pool installed by our own crew, start to finish." },
      { tag: "Surround", name: "Decking & surround", body: "The deck and surround that frame the pool and make it easy to live around." },
      { tag: "Water", name: "A spa by the pool", body: "Add a Cal Spas hot tub or swim spa to the plan and we'll set it up alongside the pool." },
    ] },
    feature: { kicker: "Who it's for", title: "Made for valley summers.", body: "Most of our pool clients own their land, want to swim within the year and want one crew from design to the first swim.", bullets: ["Own the site", "Swimming within 12 months", "Want one accountable crew"], image: IMG.poolNight, alt: "Pool lit at night" },
    magnet: { title: "Get the spring 2027 pool planning guide.", body: "Budget ranges, timelines, permits and the questions to ask before any pool install." },
    closing: { title: "Get on the spring install list.", body: "Tell us about the site and we'll set up a design consult as the season opens.", cta: "Join the spring install list" },
    quickLinks: [
      { label: "Pool & spa chemicals", href: "/spa-care" },
      { label: "Compare swim spas", href: "/swim-spas" },
    ],
  }),
  line({
    pageId: "/fireplaces/gas-electric",
    seo: { title: "Gas & Electric Inserts and Fireplaces", description: "Gas and electric fireplace inserts and fireplaces in Wenatchee: instant heat, no ash, and warmth on burn-ban days. Installed and vented by Seasonally Living." },
    interest: "hearth",
    hero: { kicker: "Fire · Gas & electric inserts", title: { before: "Flame at the ", emphasis: "touch of a button." }, lead: "A gas or electric insert turns an old, drafty fireplace into clean, instant heat. No ash, no wood to haul, and no worry when the valley calls a burn ban.", image: IMG.gasLinear, alt: "A modern linear fireplace in a bright room with big windows", cta: "Book a fireplace consult" },
    points: { kicker: "Why gas or electric", title: "Warmth without the work.", lead: "The look of a real hearth, with heat that's ready the moment you want it.", items: [
      { title: "Instant heat", body: "Realistic flames and glowing embers at the touch of a button, with settings you control." },
      { title: "Clean and simple", body: "No ash, no wood to haul and stack. Zone heating where you actually spend your evenings." },
      { title: "Burn-ban friendly", body: "When air quality bans stop wood burning, gas and electric keep the room warm." },
    ] },
    models: { kicker: "Options", title: "Find your fit.", lead: "Inserts are where most people start: they work with the fireplace you already have.", items: [
      { tag: "Gas", name: "Gas inserts", body: "Turn an old wood fireplace into a clean, efficient gas fire. We fit the insert and the venting." },
      { tag: "Electric", name: "Electric inserts", body: "Slip an electric insert into an existing fireplace opening: a realistic flame and heat on demand, with no venting needed." },
      { tag: "Gas & electric", name: "Fireplaces", body: "Built-in and plug-in fireplaces for a new wall, a remodel or a room with no fireplace at all." },
    ] },
    feature: { kicker: "Installed by our crew", title: "Venting done right.", body: "A gas insert needs proper venting and a clean install. Venting has been our trade since 1979.", bullets: ["Venting designed for the appliance", "Inserts fitted to existing masonry", "Mantels and surrounds from our hearth shop"], image: IMG.electricMantel, alt: "A fireplace insert set in a white mantel" },
    magnet: { title: "Get the burn-ban-ready fireplace guide.", body: "Wood, gas or electric: what works on which days, and what it costs to run." },
    closing: { title: "See them burning.", body: "Compare gas, electric and Stûv wood side by side in the showroom.", cta: "Book a fireplace consult" },
  }),
  line({
    pageId: "/hearth-supplies",
    seo: { title: "Hearth Products & Venting Supplies", description: "Venting pipe and parts, mantels, screens, stove paint, gaskets and cleaners in Wenatchee, with venting design from the crew that has done it since 1979." },
    interest: "venting",
    hero: { kicker: "Fire · Hearth & venting supplies", title: { before: "The region's ", emphasis: "venting counter." }, lead: "One of the largest selections of venting and parts in the region, plus mantels, screens and the maintenance essentials that keep a stove or fireplace looking and working right.", image: IMG.mantelBrick, alt: "A white brick fireplace with a mantel", cta: "Get help with venting" },
    points: { kicker: "On the shelves", title: "Parts, finish and know-how.", lead: "Whether you're a homeowner or a contractor, come in with a question and leave with the right part.", items: [
      { title: "Venting & parts", body: "Pipe, caps and fittings, with help designing the system for your appliance." },
      { title: "Mantels & screens", body: "Non-combustible and handcrafted wood mantels, and decorative screens to finish the hearth." },
      { title: "Maintenance essentials", body: "High-temp stove paint, gaskets, glass cleaner and the accessories that keep a stove in shape." },
    ] },
    feature: { kicker: "System design", title: "We'll design the venting with you.", body: "Bring the appliance make and model and a photo of the space. We'll work out the venting and clearances, and install it if you want.", bullets: ["Venting sized to the appliance", "Parts in stock", "Installation by our crew"], image: IMG.stoveMinimal, alt: "A modern wood stove burning in a bright room" },
    closing: { title: "Need a part or a plan?", body: "Call ahead with the make and model and we'll have answers ready.", cta: "Get help with venting" },
  }),
  line({
    pageId: "/builders",
    seo: { title: "For Builders & Remodelers: Hearth and Spa Supply", description: "Stûv stoves, fireplaces, gas and electric inserts, venting and Cal Spas hot tubs for builders, remodelers and property managers in North Central Washington, supplied and installed by one local crew." },
    interest: "builder",
    hero: { kicker: "For builders & remodelers", title: { before: "You build the house. ", emphasis: "We bring the fire and the water." }, lead: "We supply and install what goes inside: Stûv stoves, fireplaces and inserts, the venting behind them, and Cal Spas hot tubs and swim spas, from Wenatchee to Chelan and Leavenworth.", image: IMG.gasLinear, alt: "A modern linear fireplace in a bright room with big windows", cta: "Talk trade with us" },
    points: { kicker: "Why builders use us", title: "Less coordination, fewer callbacks.", lead: "We've been installing stoves, fireplaces and venting in this valley since 1979.", items: [
      { title: "Supply and install", body: "Stûv stoves, fireplaces and gas and electric inserts, with the venting, installed by our crew on your schedule." },
      { title: "Parts on the shelf", body: "One of the largest venting selections in the region, so jobs don't wait on parts." },
      { title: "Spas for spec homes and rentals", body: "Cal Spas hot tubs and swim spas, delivered and set up for spec homes, rentals and second homes." },
    ] },
    feature: { kicker: "Trade program", title: "A dedicated contact for your projects.", body: "Tell us about your projects and we'll set you up with a contact, our trade terms, and a quarterly update on new products.", bullets: ["Ask about trade terms", "Install scheduling with our crew", "Showroom visits with your clients"], image: IMG.electricMantel, alt: "A fireplace insert set in a white mantel" },
    magnet: { title: "Get the quarterly builder update.", body: "New products, lead times and what's working on jobs around the valley. Four emails a year." },
    closing: { title: "Let's talk about your next project.", body: "Bring your plans by the showroom or give us a call.", cta: "Talk trade with us" },
  }),
];

export const FIREPLACES: FireplacesContent = {
  _type: "fireplacesPage",
  pageId: "/fireplaces",
  seo: { title: "Stûv Wood Stoves & Fireplaces", description: "See Stûv wood stoves, inserts and fireplaces in Wenatchee, plus gas and electric inserts. Model selection, venting design and installation by Seasonally Living (Chim Chimney)." },
  hero: { kicker: "Fireplaces & stoves · Featuring Stûv", title: { before: "The essential fire, ", emphasis: "done right." }, lead: "Stûv wood stoves, inserts and fireplaces, designed in Belgium and adapted for North America. We fit the model to your room, then design and install the venting ourselves.", image: IMG.stoveMinimal, alt: "A modern wood stove with a glass door and log store, burning in a bright living room", position: "center 72%", cta: "Book a fireplace consult", secondaryCta: "See the collection" },
  collection: {
    kicker: "The Stûv collection",
    title: "Three ways to bring fire home.",
    lead: "Every Stûv is built for a fire you can watch and heat you can feel. Here's how the range breaks down.",
    note: "Model availability varies. Ask us which Stûv models are on the showroom floor.",
    families: [
      { kicker: "Freestanding", title: "Wood stoves", body: "Freestanding stoves that need no surround or finishing. Place it, vent it, light it.", models: ["s[6]H", "s[16]cube", "s[16]H", "s[16]V", "s[30C]one", "s[30C]", "s[30C]H"] },
      { kicker: "For an existing hearth", title: "Wood inserts", body: "Turn an open, drafty masonry fireplace into real heat. We fit the insert and the venting.", models: ["s[6]in", "s[16]in"] },
      { kicker: "Built in", title: "Wood fireplaces", body: "Zero-clearance fireplaces for a new wall or remodel, including double-sided models that heat two rooms.", models: ["s[16]Z", "s[21]sf", "s[21]df", "s[21CLAD]"] },
    ],
  },
  burnBan: { kicker: "Burn-ban ready", title: "Heat you can use on the days that matter.", body: "The Wenatchee valley calls burn bans when the air stalls. Stage 1 bans stop uncertified stoves; Stage 2 stops nearly all burning. We'll walk you through which appliances are certified and what that means for your winter.", bullets: ["Clean-burning modern combustion", "Venting sized to the appliance, not guessed", "Honest advice on wood, gas and electric"], image: IMG.stoveLiving, alt: "A wood stove heating a living room" },
  steps: { kicker: "From showroom to first fire", title: "One crew, start to finish.", items: [
    { title: "Visit and pick", body: "See a Stûv burning in the showroom. We look at your room, how you'll use it and how much heat you need." },
    { title: "Site check", body: "We look at your existing venting or the route for new venting: clearances and roof." },
    { title: "Venting design", body: "We size the venting to the appliance and your home, and handle the permit." },
    { title: "Install and first fire", body: "Our crew installs the stove and venting, then lights the first fire with you." },
    { title: "Every fall", body: "A venting inspection before burn season, so it keeps burning clean." },
  ] },
  magnet: { title: "Get the burn-ban-ready fireplace guide.", body: "What to look for in a wood stove, how venting works, and how to stay warm on burn-ban days. Plus the monthly note." },
  closing: { title: "Come see a Stûv burning.", body: "Book a fireplace consult and we'll have one lit when you arrive. Bring a photo of the room.", cta: "Book a fireplace consult" },
};

export const SERVICE: ServiceContent = {
  _type: "servicePage",
  pageId: "/service",
  seo: { title: "Stove & Fireplace Venting", description: "Venting design and installation, venting inspections and a full venting parts counter for stoves, inserts and fireplaces, from the Wenatchee crew that started as Chim Chimney in 1979. Hot tub service too." },
  hero: { kicker: "Venting & service", title: { before: "Venting, ", emphasis: "done right." }, lead: "We started as Chim Chimney in 1979, and venting is still the heart of the trade. A stove or insert burns only as well as its venting, so we design it, install it and inspect it ourselves.", image: IMG.stoveLiving, alt: "A wood stove with its flue pipe rising up a tiled wall", position: "center 70%", cta: "Request service", secondaryCta: "Venting parts & supplies" },
  services: { kicker: "What we do", title: "Service for every season.", items: [
    { icon: "ruler", title: "Venting design & install", body: "New venting for stoves, inserts and fireplaces, sized to the appliance and installed to code." },
    { icon: "shield", title: "Venting inspections", body: "A clear look at your existing venting before you buy, sell, add an insert or light the first fire of the season." },
    { icon: "layers", title: "Venting parts counter", body: "Pipe, caps and fittings on the shelf, with help working out the right system for your appliance." },
    { icon: "sparkle", title: "Insert installs", body: "Turn an open fireplace into an efficient heater with a wood, gas or electric insert, vented properly." },
    { icon: "hands", title: "Hot tub service", body: "Start-ups, repairs, water care help and winterizing for the tubs we sell and many we don't." },
    { icon: "compass", title: "Seasonal open & close", body: "For second homes around Chelan and Leavenworth: we open in spring and close down in fall." },
  ] },
  closing: { title: "Get on the fall schedule.", body: "Venting inspections fill up fast once the first cold snap hits. Tell us what you've got and we'll find a time.", cta: "Request service" },
};

export const ABOUT: AboutContent = {
  _type: "aboutPage",
  pageId: "/about",
  seo: { title: "Our Story: Cam & Susan McNeill", description: "Family-owned by Cam and Susan McNeill since 1979. Chim Chimney Fireplace and Masonry, now Seasonally Living by Chim Chimney, next to Home Depot in Wenatchee." },
  hero: { kicker: "Our story", title: { before: "Family-owned ", emphasis: "since 1979." }, lead: "For more than forty years, the McNeill family has brought warmth and water to North Central Washington homes: stoves and inserts vented right, Cal Spas hot tubs and swim spas, and pools installed by our own crew.", image: IMG.localGreenValley, alt: "Green spring hills and a small farm in a mountain valley", cta: "Come meet us" },
  owners: {
    kicker: "Cam & Susan McNeill",
    title: "Forty-seven years in one valley.",
    paragraphs: [
      "Cam and Susan McNeill started Chim Chimney Fireplace and Masonry in Wenatchee in 1979. In 1995 they opened the showroom, so neighbors could see a fire burning and sit in a hot tub before they decided.",
      "The name on the door is now Seasonally Living by Chim Chimney. The way they work hasn't changed: help people choose well, install it with their own crew, and be here to service it for as long as it runs.",
      "It is still a family business, and the family is still here. Come by the showroom next to Home Depot and say hello.",
    ],
    image: IMG.mcneillFamily,
    alt: "The McNeill family walking together through tall summer grass in the hills",
    caption: "Cam, Susan and the McNeill family",
  },
  timeline: { kicker: "Our short story", title: "From chimneys to the home resort.", items: [
    { year: "1979", title: "Chim Chimney begins", body: "Cam and Susan McNeill start Chim Chimney Fireplace and Masonry." },
    { year: "1995", title: "The showroom opens", body: "The retail store opens so customers can see fireplaces and spas in person." },
    { year: "2024", title: "Focused on what we do best", body: "We simplified the business to focus on fire and water: stoves, venting, spas and pools." },
    { year: "Today", title: "Seasonally Living", body: "Doing business as Seasonally Living by Chim Chimney, next door to Home Depot." },
  ] },
  values: { kicker: "What we believe", title: "Comfort, safety and leisure.", body: "We're a turn-key business. We help you choose, we install it, and we're still here to service it. That's how a family business lasts more than forty years in one valley.", bullets: ["Stoves, fireplaces, inserts and venting", "Cal Spas hot tubs, swim spas and pre-owned spas", "Swimming pools installed by our own crew"], image: IMG.stoveLiving, alt: "A wood stove warming a living room" },
  closing: { title: "Come meet us next door to Home Depot.", body: "The showroom is open Tuesday to Saturday, 10 to 4. Sundays and Mondays by appointment." },
};

export const VISIT: SimpleContent = {
  _type: "simplePage",
  pageId: "/visit",
  seo: { title: "Visit the Showroom", description: "Visit Seasonally Living at 1407 Maiden Ln, Wenatchee (next to Home Depot). Book a hot tub try-out, fireplace consult or service visit." },
  kicker: "Visit the showroom",
  title: "Book a visit or consult.",
  lead: "Tell us what you're thinking about and when works. We'll confirm within one business day and have the right models running when you arrive.",
  image: IMG.csMountain,
  alt: "A Cal Spas hot tub on a stone patio with mountains behind",
};

export const NOTE: SimpleContent = {
  _type: "simplePage",
  pageId: "/note",
  seo: { title: "The Seasonally Living Note", description: "One useful note a month from Seasonally Living in Wenatchee: hot tub and stove care, pre-owned arrivals and pool planning." },
  kicker: "The Seasonally Living note",
  title: "One useful note a month.",
  lead: "Pick what you care about and we'll tailor what we send you.",
};

export const ALL_PAGES: PageContent[] = [HOME, ...LINES, FIREPLACES, SERVICE, ABOUT, VISIT, NOTE];
