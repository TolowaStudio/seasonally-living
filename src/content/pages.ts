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
  calFlame: B + "calflame/outdoor-fireplace",
  // Licensed stock
  flames: B + "stock/flames",
  stoveCabin: B + "stock/stove-cabin",
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
  saunaDark: B + "stock/sauna-dark",
  saunaModern: B + "stock/sauna-modern",
  outdoorKitchen: B + "stock/outdoor-kitchen",
  outdoorKitchenPool: B + "stock/outdoor-kitchen-pool",
  framing: B + "stock/framing",
  framingInterior: B + "stock/framing-interior",
} as const;

export const HOME: HomeContent = {
  _type: "homePageV2",
  pageId: "/",
  seo: {
    title: "Seasonally Living | Cal Spas Hot Tubs, Swim Spas & Stûv Fireplaces in Wenatchee",
    description:
      "Wenatchee's home resort showroom: Cal Spas hot tubs and swim spas, Stûv wood stoves and fireplaces, venting and chimney service, Cal Saunas, outdoor living and pools.",
  },
  hero: {
    kicker: "Hero",
    credential: "Official Cal Spas dealer · Wenatchee showroom, next to Home Depot",
    title: { before: "Your home resort, ", emphasis: "all four", after: " seasons." },
    lead: "Soak, swim, sweat and fire. Cal Spas hot tubs and swim spas, Stûv stoves with venting done right, saunas and pools, all from one North Central Washington showroom.",
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
    kicker: "Venting & chimney",
    title: "A stove is only as good as its venting.",
    body: "We started as Chim Chimney. Venting, liners, inspections and sweeps are still the heart of what we do, for the stove you buy here and the one you already own.",
    cta: "Book venting or a sweep",
    cards: [
      { icon: "shield", title: "Sized and installed to code", body: "Flue, liner and clearances matched to the appliance." },
      { icon: "clock", title: "Before the first cold night", body: "Fall inspections and sweeps so you're ready for burn season." },
    ],
  },
  lines: {
    kicker: "The home resort",
    title: "Soak, swim, sweat and fire.",
    lead: "Nine ways to live for the season. Everything we sell, we deliver, install and service ourselves.",
    items: [
      { href: "/hot-tubs", kicker: "Soak", title: "Cal Spas hot tubs", body: "Try one in the showroom. Delivery, setup and orientation with every tub.", image: IMG.csEscape },
      { href: "/swim-spas", kicker: "Swim", title: "Swim spas", body: "Cal Spas Swim Pro and Swim Pro X. Dry consults now, wet tests in spring.", image: IMG.csSwimPro },
      { href: "/pre-owned", kicker: "Soak", title: "Pre-owned spas", body: "Inspected, repaired trade-ins. Subscribers see them first.", image: IMG.csPlatinumCourtyard },
      { href: "/fireplaces", kicker: "Fire", title: "Stûv stoves & fireplaces", body: "Belgian-designed wood stoves, inserts and fireplaces, installed and vented by our crew.", image: IMG.stoveCabin },
      { href: "/fireplaces/gas-electric", kicker: "Fire", title: "Gas & electric fireplaces", body: "Instant flame, no ash, and heat on burn-ban days.", image: IMG.gasLinear },
      { href: "/service", kicker: "Fire", title: "Venting & chimney", body: "Venting design and install, liners, inspections and sweeps since 1979.", image: IMG.chimneyBrick },
      { href: "/saunas", kicker: "Sweat", title: "Cal Saunas", body: "Traditional and infrared saunas with real woodwork.", image: IMG.saunaDark },
      { href: "/outdoor-living", kicker: "Outdoor", title: "Outdoor kitchens & projects", body: "Cal Flame grill islands and fireplaces, patios, pads and gazebos.", image: IMG.calFlame },
      { href: "/pools", kicker: "Build", title: "Pools", body: "Projects, not products. Spring 2027 builds are planned this winter.", image: IMG.poolBlueHour },
    ],
  },
  seasons: {
    kicker: "Live for the season",
    title: "Something worth doing every month of the year.",
    items: [
      { name: "Winter", lead: "The winter soak, hearth and stoves", note: "Hot tubs under snow, burn-ban-ready heat, venting checks." },
      { name: "Spring", lead: "Swim spas, openings and pool starts", note: "Wet tests open. Pool builds break ground." },
      { name: "Summer", lead: "Backyard builds and clearance", note: "Installs, deliveries and pre-owned value." },
      { name: "Fall", lead: "Burn prep and sweeps", note: "Inspections and venting before the first cold night." },
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
    feature: { kicker: "Pre-owned", title: "Pre-owned, inspected and ready.", body: "Trade-ins come back through our shop. When a good one is ready, subscribers to the note hear about it first.", bullets: ["Inspected and repaired by our techs", "Cleaned and sanitized", "Delivered like a new tub"], image: IMG.csEscape, alt: "A Cal Spas Escape hot tub on a patio" },
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
    hero: { kicker: "Pre-owned spas", title: { before: "A great tub, ", emphasis: "for less." }, lead: "Trade-ins come back through our own shop. When one is ready, it's inspected, repaired and cleaned before it goes back on the floor.", image: IMG.hotTubSnow, alt: "A hot tub in a snowy forest", cta: "Ask about pre-owned" },
    points: { kicker: "How it works", title: "From trade-in to your backyard.", lead: "Pre-owned units move fast, especially in winter. The list is the best way to see them first.", items: [
      { title: "Inspected", body: "Our techs check pumps, heater, controls, jets and shell before anything is listed." },
      { title: "Repaired and cleaned", body: "Worn parts replaced, lines flushed and the tub cleaned and sanitized." },
      { title: "Delivered", body: "We deliver and set it up the same way we do a new tub." },
    ] },
    feature: { kicker: "Trading up?", title: "Your old tub is worth something.", body: "If your tub is getting older, ask about trading it in toward a new Cal Spas tub or a pre-owned unit. We'll take a look and give you a straight number.", bullets: ["Trade-in toward new or pre-owned", "We haul the old one away", "Straight answers on repair vs. replace"], image: IMG.csMountain, alt: "A new Cal Spas hot tub on a stone patio" },
    magnet: { title: "See pre-owned arrivals first.", body: "Subscribers to the note hear about pre-owned tubs before they're posted anywhere else." },
    closing: { title: "Ask what's in the shop.", body: "Inventory changes week to week. Tell us what you're after and we'll tell you what's coming.", cta: "Ask about pre-owned" },
  }),
  line({
    pageId: "/spa-care",
    seo: { title: "Pool & Spa Care", description: "Pool and spa water care, filters, cover lifters, steps and handrails at the Seasonally Living showroom in Wenatchee, plus hot tub service." },
    interest: "hot-tub",
    hero: { kicker: "Pool & spa care", title: { before: "Clear water, ", emphasis: "all season." }, lead: "Water treatment, filters and the accessories that make a tub easier to live with, plus people who can answer your questions.", image: IMG.water, alt: "Sunlight on clear rippling water", cta: "Ask a water question" },
    points: { kicker: "In the showroom", title: "Everything your tub needs.", lead: "Stop by for supplies, or bring your questions about cloudy water, foam or a filter that won't stay clean.", items: [
      { title: "Water treatment", body: "Sanitizers, balancers and clarifiers to keep pool and spa water clear and balanced." },
      { title: "Filters", body: "Replacement filters for the tubs we sell and many we don't." },
      { title: "Accessories", body: "Entry steps, cover lifters, handrails and more to make the tub easier to use every day." },
    ] },
    feature: { kicker: "Need a hand?", title: "Service from the people who installed it.", body: "Start-ups, repairs, winterizing and seasonal open and close for second homes around Chelan and Leavenworth.", bullets: ["Hot tub start-ups and repairs", "Winterizing", "Seasonal open & close"], image: IMG.hotTubSnowPeople, alt: "Two people in a steaming hot tub above a snowy forest" },
    magnet: { title: "Get the winter hot tub care guide.", body: "Freeze protection, water care in the cold and when to call us." },
    closing: { title: "Questions about your water?", body: "Call or stop in. We'll help you sort it out.", cta: "Ask a water question" },
  }),
  line({
    pageId: "/pools",
    seo: { title: "Pools: Spring 2027 Planning", description: "Plan an in-ground pool with Seasonally Living in Wenatchee. Design consults over the winter for spring 2027 builds." },
    interest: "pool",
    hero: { kicker: "Pools · Spring 2027", title: { before: "Pools are projects, ", emphasis: "not products." }, lead: "A pool is designed around your land, your budget and your summers. Winter is when the planning happens, so the build can start when the ground thaws.", image: IMG.poolBlueHour, alt: "Modern home with a pool at blue hour", cta: "Join the spring build list" },
    points: { kicker: "How a build works", title: "Plan in winter. Build in spring.", lead: "Spring 2027 build slots are limited. Getting on the list now holds your place in the design queue.", items: [
      { title: "Design consult", body: "We talk budget, site, timeline and how you'll use it, with the people who'll build it." },
      { title: "Plan and permit", body: "Layout, equipment and permits handled over the winter." },
      { title: "Build", body: "Construction runs spring into summer, with a clear schedule from day one." },
    ] },
    feature: { kicker: "Who it's for", title: "Built for valley summers.", body: "Most of our pool clients own their land, plan to build within the year and want one team from design to the first swim.", bullets: ["Own the site", "Building within 12 months", "Want one accountable team"], image: IMG.poolNight, alt: "Pool lit at night" },
    magnet: { title: "Get the spring 2027 pool planning guide.", body: "Budget ranges, timelines, permits and the questions to ask any builder." },
    closing: { title: "Get on the spring build list.", body: "Tell us about the site and we'll set up a design consult as the season opens.", cta: "Join the spring build list" },
  }),
  line({
    pageId: "/saunas",
    seo: { title: "Cal Saunas: Traditional & Infrared", description: "Cal Saunas traditional and infrared saunas in Wenatchee. See the woodwork in our showroom and plan placement, power and install with us." },
    interest: "sauna",
    hero: { kicker: "Saunas · Cal Saunas", title: { before: "Sweat it out. ", emphasis: "Every season." }, lead: "Cal Saunas builds premium saunas with careful woodwork, in traditional and infrared models. Pair one with a hot tub or a cold plunge and you have the whole home-resort circuit.", image: IMG.saunaDark, alt: "Sauna stones, a wooden bucket and benches in low light", cta: "Book a sauna consult" },
    points: { kicker: "Why a sauna", title: "Heat therapy, at home.", lead: "Recovery after a ski day, a warm-up before a cold soak, or twenty quiet minutes in January.", items: [
      { title: "Real woodwork", body: "Cal Saunas are built with attention to joinery and finish. Come feel the wood in the showroom." },
      { title: "Indoor or outdoor", body: "Models for a spare room, a basement or the backyard next to the hot tub." },
      { title: "Planned and installed", body: "We plan placement, power and ventilation, then install it right." },
    ] },
    models: { kicker: "Two ways to heat", title: "Traditional or infrared?", items: [
      { tag: "Steam and stones", name: "Traditional sauna", body: "A heater warms stones and air to classic sauna temperatures. Ladle water for a burst of steam.", bullets: ["High heat, classic feel", "Steam on demand", "Best for the full sauna ritual"] },
      { tag: "Gentle, direct heat", name: "Infrared sauna", body: "Infrared panels warm you directly at lower air temperatures, so sessions feel easier and heat-up is quick.", bullets: ["Lower air temperature", "Quick to warm up", "Easy fit for indoor spaces"] },
    ] },
    feature: { kicker: "The home-resort circuit", title: "Sauna, soak, repeat.", body: "Many of our customers put a sauna next to the hot tub. We'll help you lay out the whole backyard so it works in the snow.", bullets: ["Placement with the hot tub in mind", "Electrical planning", "Pads, paths and lighting through our outdoor projects team"], image: IMG.saunaModern, alt: "A modern sauna with tiered wooden benches" },
    magnet: { title: "Traditional vs. infrared: the plain-English guide.", body: "What each feels like, what each needs for power and space, and how to choose." },
    closing: { title: "Come feel the heat.", body: "See the Cal Saunas woodwork in person and talk through where yours would go.", cta: "Book a sauna consult" },
  }),
  line({
    pageId: "/outdoor-living",
    seo: { title: "Outdoor Kitchens & Backyard Projects", description: "Cal Flame outdoor kitchens, grill islands and outdoor fireplaces, concrete patios, hot tub pads and gazebos from Seasonally Living in Wenatchee." },
    interest: "outdoor",
    hero: { kicker: "Outdoor living · Cal Flame", title: { before: "The backyard, ", emphasis: "finished." }, lead: "Cal Flame outdoor kitchens, grill islands and outdoor fireplaces, plus the patios, pads and gazebos that pull the whole home resort together.", image: IMG.outdoorKitchen, alt: "An outdoor kitchen island with bar stools", cta: "Plan a backyard project" },
    points: { kicker: "What we build", title: "Small to mid-sized projects, done right.", lead: "No oversized crews or big-contract pressure. Just the help you need to get the most out of your backyard.", items: [
      { title: "Outdoor kitchens", body: "Cal Flame barbecue islands, built-in grills and outdoor fireplaces, built to last outside." },
      { title: "Patios and pads", body: "Concrete patios and hot tub or swim spa pads, prepped properly before delivery day." },
      { title: "Gazebos and shelter", body: "Gazebos and covers so you use the tub, the sauna and the grill in any weather." },
    ] },
    feature: { kicker: "One team", title: "Plan it all together.", body: "Because we sell the tubs, saunas and fireplaces too, we can plan the whole backyard at once: power, paths, pads and where everything goes.", bullets: ["Layout and planning", "Hot tub, swim spa and sauna prep", "Grill islands and outdoor fireplaces"], image: IMG.calFlame, alt: "A Cal Flame outdoor fireplace on a backyard patio" },
    magnet: { title: "Get the backyard project planner.", body: "A simple checklist for laying out a hot tub, sauna and outdoor kitchen that work together." },
    closing: { title: "Let's plan your backyard.", body: "Bring a photo or a rough sketch and we'll talk through what fits.", cta: "Plan a backyard project" },
  }),
  line({
    pageId: "/fireplaces/gas-electric",
    seo: { title: "Gas & Electric Fireplaces", description: "Gas and electric fireplaces and inserts in Wenatchee: instant heat, no ash, and warmth on burn-ban days. Installed and vented by Seasonally Living." },
    interest: "hearth",
    hero: { kicker: "Fire · Gas & electric", title: { before: "Flame at the ", emphasis: "touch of a button." }, lead: "Not every night is a wood night. Gas and electric fireplaces give you instant warmth with no ash, no wood storage and no worry when the valley calls a burn ban.", image: IMG.gasLinear, alt: "A modern linear fireplace in a bright room with big windows", cta: "Book a fireplace consult" },
    points: { kicker: "Why gas or electric", title: "Warmth without the work.", lead: "The look of a real hearth, with heat that's ready the moment you want it.", items: [
      { title: "Instant heat", body: "Realistic flames and glowing embers at the touch of a button, with settings you control." },
      { title: "Clean and simple", body: "No ash, no wood to haul and stack. Zone heating where you actually spend your evenings." },
      { title: "Burn-ban friendly", body: "When air quality bans stop wood burning, gas and electric keep the room warm." },
    ] },
    models: { kicker: "Options", title: "Find your fit.", items: [
      { tag: "Gas", name: "Gas fireplaces", body: "Built-in fireplaces for a new wall, remodel or feature wall, with realistic flames and real heat." },
      { tag: "Gas", name: "Gas inserts", body: "Turn an old wood fireplace into a clean, efficient gas fire. We fit the insert and the venting." },
      { tag: "Electric", name: "Electric fireplaces", body: "Plug-in and built-in models, modern to traditional, with no venting needed. Heat and ambiance anywhere." },
    ] },
    feature: { kicker: "Installed by our crew", title: "Venting and gas lines done right.", body: "Gas fireplaces need proper venting and a clean install. That's been our trade since 1979.", bullets: ["Venting designed for the appliance", "Inserts fitted to existing masonry", "Mantels and surrounds from our hearth shop"], image: IMG.electricMantel, alt: "A fireplace insert set in a white mantel" },
    magnet: { title: "Get the burn-ban-ready fireplace guide.", body: "Wood, gas or electric: what works on which days, and what it costs to run." },
    closing: { title: "See them burning.", body: "Compare gas, electric and Stûv wood side by side in the showroom.", cta: "Book a fireplace consult" },
  }),
  line({
    pageId: "/hearth-supplies",
    seo: { title: "Hearth Products & Venting Supplies", description: "Mantels, screens, chimney venting and parts, stove paint, gaskets and cleaners in Wenatchee, with chimney system design from the Chim Chimney crew." },
    interest: "venting",
    hero: { kicker: "Fire · Hearth & venting supplies", title: { before: "The region's ", emphasis: "venting counter." }, lead: "One of the largest selections of chimney venting and parts in the region, plus mantels, screens and the maintenance essentials that keep a fireplace looking and working right.", image: IMG.mantelBrick, alt: "A white brick fireplace with a mantel", cta: "Get help with venting" },
    points: { kicker: "On the shelves", title: "Parts, finish and know-how.", lead: "Whether you're a homeowner or a contractor, come in with a question and leave with the right part.", items: [
      { title: "Chimney venting & parts", body: "Pipe, liners, caps and fittings, with help designing the system for your appliance." },
      { title: "Mantels & screens", body: "Non-combustible and handcrafted wood mantels, and decorative screens to finish the hearth." },
      { title: "Maintenance essentials", body: "High-temp stove paint, gaskets, glass cleaner and the accessories that keep a stove in shape." },
    ] },
    feature: { kicker: "System design", title: "We'll design the venting with you.", body: "Bring the appliance make and model and a photo of the space. We'll work out the flue, liner and clearances, and install it if you want.", bullets: ["Venting sized to the appliance", "Parts in stock", "Installation by our crew"], image: IMG.chimneyBrick, alt: "A brick chimney among trees" },
    closing: { title: "Need a part or a plan?", body: "Call ahead with the make and model and we'll have answers ready.", cta: "Get help with venting" },
  }),
  line({
    pageId: "/builders",
    seo: { title: "For Builders & Remodelers", description: "Fireplaces, venting, hot tubs and saunas for builders, remodelers and property managers in North Central Washington. One local supplier and install crew." },
    interest: "builder",
    hero: { kicker: "For builders & remodelers", title: { before: "One call for the ", emphasis: "hearth and the backyard." }, lead: "Spec the fireplace, the venting and the hot tub with one local team that supplies, installs and services it, from Wenatchee to Chelan and Leavenworth.", image: IMG.framing, alt: "A builder working on a house frame", cta: "Talk trade with us", position: "center 30%" },
    points: { kicker: "Why builders use us", title: "Less coordination, fewer callbacks.", lead: "We've been installing fireplaces and venting in this valley since 1979.", items: [
      { title: "Supply and install", body: "Fireplaces, inserts, Stûv stoves and the venting, installed by our crew on your schedule." },
      { title: "Parts on the shelf", body: "One of the largest chimney venting selections in the region, so jobs don't wait on parts." },
      { title: "Backyard packages", body: "Cal Spas hot tubs and swim spas, saunas and Cal Flame outdoor kitchens for spec homes and rentals." },
    ] },
    feature: { kicker: "Trade program", title: "A dedicated contact for your projects.", body: "Tell us about your builds and we'll set you up with a contact, our trade terms, and a quarterly update on new products.", bullets: ["Ask about trade terms", "Project scheduling with our install crew", "Showroom visits with your clients"], image: IMG.framingInterior, alt: "Interior wood framing of a house under construction" },
    magnet: { title: "Get the quarterly builder update.", body: "New products, lead times and what's working on jobs around the valley. Four emails a year." },
    closing: { title: "Let's talk about your next build.", body: "Bring your plans by the showroom or give us a call.", cta: "Talk trade with us" },
  }),
];

export const FIREPLACES: FireplacesContent = {
  _type: "fireplacesPage",
  pageId: "/fireplaces",
  seo: { title: "Stûv Wood Stoves & Fireplaces", description: "See Stûv wood stoves, inserts and fireplaces in Wenatchee. Model selection, venting design and installation by Seasonally Living (Chim Chimney)." },
  hero: { kicker: "Fireplaces & stoves · Featuring Stûv", title: { before: "The essential fire, ", emphasis: "done right." }, lead: "Stûv wood stoves, inserts and fireplaces, designed in Belgium and adapted for North America. We fit the model to your room, then design and install the venting ourselves.", image: IMG.stoveCabin, alt: "A wood stove in a timber A-frame living room", position: "center 55%", cta: "Book a fireplace consult", secondaryCta: "See the collection" },
  collection: {
    kicker: "The Stûv collection",
    title: "Three ways to bring fire home.",
    lead: "Every Stûv is built for a fire you can watch and heat you can feel. Here's how the range breaks down.",
    note: "Model availability varies. Ask us which Stûv models are on the showroom floor.",
    families: [
      { kicker: "Freestanding", title: "Wood stoves", body: "Freestanding stoves that need no surround or finishing. Place it, vent it, light it.", models: ["s[6]H", "s[16]cube", "s[16]H", "s[16]V", "s[30C]one", "s[30C]", "s[30C]H"] },
      { kicker: "For an existing hearth", title: "Wood inserts", body: "Turn an open, drafty masonry fireplace into real heat. We fit the insert and reline the chimney.", models: ["s[6]in", "s[16]in"] },
      { kicker: "Built in", title: "Wood fireplaces", body: "Zero-clearance fireplaces for a new wall or remodel, including double-sided models that heat two rooms.", models: ["s[16]Z", "s[21]sf", "s[21]df", "s[21CLAD]"] },
    ],
  },
  burnBan: { kicker: "Burn-ban ready", title: "Heat you can use on the days that matter.", body: "The Wenatchee valley calls burn bans when the air stalls. Stage 1 bans stop uncertified stoves; Stage 2 stops nearly all burning. We'll walk you through which appliances are certified and what that means for your winter.", bullets: ["Clean-burning modern combustion", "Venting sized to the appliance, not guessed", "Honest advice on wood, gas and electric"], image: IMG.stoveLiving, alt: "A wood stove heating a living room" },
  steps: { kicker: "From showroom to first fire", title: "One crew, start to finish.", items: [
    { title: "Visit and pick", body: "See a Stûv burning in the showroom. We look at your room, how you'll use it and how much heat you need." },
    { title: "Site check", body: "We look at the chimney or the route for a new flue: clearances, liner condition and roof." },
    { title: "Venting design", body: "We size the flue and liner to the appliance and your home, and handle the permit." },
    { title: "Install and first fire", body: "Our crew installs the stove and venting, then lights the first fire with you." },
    { title: "Every fall", body: "Inspection and sweep before burn season, so it keeps burning clean." },
  ] },
  magnet: { title: "Get the burn-ban-ready fireplace guide.", body: "What to look for in a wood stove, how venting works, and how to stay warm on burn-ban days. Plus the monthly note." },
  closing: { title: "Come see a Stûv burning.", body: "Book a fireplace consult and we'll have one lit when you arrive. Bring a photo of the room.", cta: "Book a fireplace consult" },
};

export const SERVICE: ServiceContent = {
  _type: "servicePage",
  pageId: "/service",
  seo: { title: "Venting, Chimney & Spa Service", description: "Stove and fireplace venting, chimney liners, inspections and sweeps, plus hot tub service, from the Chim Chimney crew in Wenatchee." },
  hero: { kicker: "Venting & service", title: { before: "We started as ", emphasis: "Chim Chimney." }, lead: "Since 1979, venting, liners, inspections and sweeps have been the heart of the business. If it burns or it bubbles, we'll keep it running.", image: IMG.chimneySmoke, alt: "Smoke rising from a chimney", cta: "Request service", secondaryCta: "Venting parts & supplies" },
  services: { kicker: "What we do", title: "Service for every season.", items: [
    { icon: "ruler", title: "Venting design & install", body: "New flues and chimney liners for stoves, inserts and fireplaces, sized to the appliance." },
    { icon: "shield", title: "Inspections", body: "A clear look at your chimney and venting before you buy, sell or light the first fire of the season." },
    { icon: "sparkle", title: "Sweeps", body: "Creosote removal and a cleaner, safer burn. Book in fall before the rush." },
    { icon: "layers", title: "Insert retrofits", body: "Turn an open masonry fireplace into an efficient heater with an insert and a new liner." },
    { icon: "hands", title: "Hot tub service", body: "Start-ups, repairs, water care help and winterizing for the tubs we sell and many we don't." },
    { icon: "compass", title: "Seasonal open & close", body: "For second homes around Chelan and Leavenworth: we open in spring and close down in fall." },
  ] },
  closing: { title: "Get on the fall schedule.", body: "Inspections and sweeps fill up fast once the first cold snap hits. Tell us what you've got and we'll find a time.", cta: "Request service" },
};

export const ABOUT: AboutContent = {
  _type: "aboutPage",
  pageId: "/about",
  seo: { title: "Our Story", description: "Family-owned by Cam and Susan McNeill since 1979. Chim Chimney Fireplace and Masonry, now Seasonally Living by Chim Chimney, next to Home Depot in Wenatchee." },
  hero: { kicker: "Our story", title: { before: "Family-owned ", emphasis: "since 1979." }, lead: "We specialize in transforming your home with the fireplace, chimney and masonry of your choice, and your backyard with hot tubs, swim spas and outdoor living. Turn-key, start to finish.", image: IMG.masonryFire, alt: "A fire burning in a traditional masonry fireplace", cta: "Come meet us" },
  timeline: { kicker: "Our short story", title: "From chimneys to the whole home resort.", items: [
    { year: "1979", title: "Chim Chimney begins", body: "Cam and Susan McNeill start Chim Chimney Fireplace and Masonry." },
    { year: "1995", title: "The showroom opens", body: "The retail store opens so customers can see fireplaces and spas in person." },
    { year: "2024", title: "Focused on what we do best", body: "We simplified the business to focus on fire, water and the backyard." },
    { year: "Today", title: "Seasonally Living", body: "Doing business as Seasonally Living by Chim Chimney, next door to Home Depot." },
  ] },
  values: { kicker: "What we believe", title: "Comfort, safety and leisure.", body: "We're a turn-key business. We help you choose, we install it, and we're still here to service it. That's how a family business lasts more than forty years in one valley.", bullets: ["Fireplaces, chimneys and masonry", "Hot tubs, swim spas and saunas, installed", "Patios, pads, gazebos and outdoor kitchens"], image: IMG.stoveLiving, alt: "A wood stove warming a living room" },
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
  seo: { title: "The Seasonally Living Note", description: "One useful note a month from Seasonally Living in Wenatchee: hot tub and fireplace care, pre-owned arrivals and pool planning." },
  kicker: "The Seasonally Living note",
  title: "One useful note a month.",
  lead: "Pick what you care about and we'll tailor what we send you.",
};

export const ALL_PAGES: PageContent[] = [HOME, ...LINES, FIREPLACES, SERVICE, ABOUT, VISIT, NOTE];
