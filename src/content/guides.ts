// Lead-magnet guides (/guides/[slug]). Code defaults; a Sanity "guide" document with the same slug
// overrides the matching default (see getGuides in lib/sanity.ts).
//
// Copy rules: general advice only where it is widely true; anything about OUR shop, prices, timing or
// models is either left out or listed in `todoConfirm` for the owners to check. `todoConfirm` is never rendered.

export type GuideSection = { heading: string; body: string; bullets?: string[] };

export type Guide = {
  _type?: "guide";
  slug: string;
  interest: string; // id from lib/interests.ts; tags the signup
  kicker: string;
  title: string;
  summary: string; // landing-page promise (one or two sentences)
  gives: string[]; // "what you'll get" bullets on the landing page
  readMinutes: number;
  intro: string; // first paragraph of the read page
  sections: GuideSection[];
  closing: { title: string; body: string; cta: string };
  todoConfirm?: string[];
  seo?: { title: string; description: string };
};

export const GUIDES: Guide[] = [
  {
    slug: "winter-hot-tub-care",
    interest: "hot-tub",
    kicker: "Hot tubs",
    title: "The winter hot tub care guide",
    summary: "Freeze protection, water care in the cold, snow on the cover and when to call us. One page you can keep by the back door.",
    gives: ["What to check before the first hard freeze", "Water care targets and how often to test", "A plan for snow, ice and power outages"],
    readMinutes: 6,
    intro:
      "Winter is the best time to be in a hot tub, and a tub that is kept running handles cold weather well. Trouble tends to start when a tub is neglected, left half-drained or loses power during a hard freeze. This guide covers the habits that prevent that. It is general advice: your owner's manual wins wherever it says something different.",
    sections: [
      {
        heading: "Keep it running",
        body:
          "A running tub circulates its water and heats it, which is the best protection against freezing. Unless you are properly winterizing (draining) the tub for the season, leave it on.\n\nMost modern spas also have freeze protection that runs the pump and heater when the temperature drops. That only works if the tub has power and enough water, so check your manual for how yours behaves.",
        bullets: ["Keep the cover on and latched whenever nobody is in the tub", "If you are away, you can lower the set temperature a few degrees, but do not switch the tub off in a freeze", "Leaving for a long stretch? Ask us before you go, not after"],
      },
      {
        heading: "Watch the water level",
        body:
          "Keep the water above the skimmer line and well over the top of the filter. A low tub can starve the pump and heater, and freeze protection cannot protect equipment that has no water around it. Check the level every week or so.",
      },
      {
        heading: "Test the water",
        body:
          "Cold weather does not mean you can skip water care. Plan to test about twice a week while you are using the tub.\n\nThe widely used ranges for pH are 7.2 to 7.8 and for total alkalinity 80 to 120 ppm. Sanitizer targets depend on the product and the spa maker, so follow your manual and the label on your sanitizer. If the water looks cloudy, smells strong or feels slick, stop by the counter with your questions.",
        bullets: ["Rinse the filter every few weeks and deep-clean it on the schedule in your manual", "Keep a spare filter so you can swap and soak", "Drain and refill on the schedule your manual gives, usually a few times a year"],
      },
      {
        heading: "Snow, ice and the cover",
        body:
          "Heavy, wet snow is hard on a cover and on the foam under it. Push or sweep snow off with a soft broom. Do not chip ice with a shovel or a sharp tool.\n\nKeep a clear, salted or sanded path to the tub and a non-slip mat at the steps. Wet skin and cold air make for slippery footing.",
      },
      {
        heading: "Power outages",
        body:
          "A full tub with the cover closed holds its heat for a good while, so a short outage is usually fine. Keep the cover closed and do not open the tub just to check on it.\n\nKnow where the tub's breaker and GFCI are. Press the GFCI test button once a month; it should trip, and you reset it. If the power is out for a long stretch during a deep freeze, call us rather than guess. Draining a tub the wrong way can damage plumbing.",
      },
      {
        heading: "Soaking safely in the cold",
        body:
          "The U.S. Consumer Product Safety Commission recommends water no hotter than 104°F. In winter the temptation is to stay in longer, so take breaks, drink water and be careful stepping out into cold air. If you are pregnant, have heart trouble or take medication, ask your doctor first. Never let young children soak unsupervised.",
      },
      {
        heading: "When to call a pro",
        body: "Call us if the tub will not heat, trips the GFCI more than once, shows an error code that does not clear, or leaks. Small problems are cheaper in November than in January.",
      },
    ],
    closing: {
      title: "Want to see a tub running before it snows?",
      body: "Book a visit and we will have a few models warm when you arrive. Already own a tub? Ask us about winter service.",
      cta: "Book a try-out",
    },
    todoConfirm: [
      "Shop's own recommended sanitizer targets and fill/drain interval",
      "Whether winter service visits and winterizing are offered at the current price and season",
      "Cal Spas freeze-protection behavior for the models sold (manual specifics)",
    ],
    seo: { title: "Winter hot tub care guide", description: "Freeze protection, cold-weather water care, snow on the cover and power outages: a plain guide from Seasonally Living in Wenatchee." },
  },
  {
    slug: "burn-ban-fireplace-guide",
    interest: "hearth",
    kicker: "Fireplaces & stoves",
    title: "The burn-ban-ready fireplace guide",
    summary: "What Washington's Stage 1 and Stage 2 burn bans mean for your stove or fireplace, and how to stay warm and legal when one is called.",
    gives: ["Stage 1 vs. Stage 2 in plain words", "Why a certified stove and dry wood matter", "Backup heat options that are not affected by a ban"],
    readMinutes: 5,
    intro:
      "When winter air gets stagnant, Washington agencies call burn bans to keep smoke from building up. If you heat with wood, or just love a fire, it helps to know the rules before the first one is called. This is a plain-language summary, not legal advice. The legal text is in WAC 173-433, and the current stage for your county is on Ecology's burn ban page.",
    sections: [
      {
        heading: "Who calls a burn ban",
        body:
          "Burn bans are called by the Washington Department of Ecology or by a local clean air agency, depending on the county, when forecast air quality is poor. Some local agencies are stricter than the state, so always check your own county. Ecology's map at ecology.wa.gov/burnbans links to the right agency.",
      },
      {
        heading: "Stage 1 and Stage 2",
        body:
          "Stage 1: uncertified wood stoves, fireplaces and inserts may not be used, and outdoor burning is banned. Certified wood stoves, certified inserts and pellet stoves can still be used.\n\nStage 2: burning in any solid-fuel device is banned, certified or not. Gas, propane and electric appliances are not solid-fuel devices and are not affected.\n\nIn both stages, a household with no other adequate source of heat is exempt for its main heat. Check your local agency for the exact wording.",
        bullets: ["Look up the stage before you light, every time, because it can change day to day", "Stage 2 can be called with little notice during a cold snap"],
      },
      {
        heading: "Why certification matters",
        body:
          "Washington requires wood heating appliances to be certified by the state. It is illegal to sell or install one that is not. Certified stoves burn cleaner and stay usable under a Stage 1 ban. If you have an older stove or an open fireplace, it may be among the first things a Stage 1 ban shuts down.",
      },
      {
        heading: "Burn dry, burn clean",
        body: "Use well-seasoned firewood that has dried for at least a season, keep it off the ground and covered on top, and give the fire plenty of air. A hot fire with a clear chimney makes far less smoke than a smoldering one.",
      },
      {
        heading: "Have a ban-proof plan",
        body:
          "The simplest way to be comfortable on a burn-ban day is a heat source the ban does not touch. A gas or electric fireplace or insert is not a solid-fuel device, so it keeps working through both stages. Many households keep a certified wood stove for most of the winter and a gas or electric option for the days it is off limits.",
      },
      {
        heading: "Before the season: check your venting",
        body: "A stove or insert is only as good as its venting. Have the flue and pipe inspected before the first fire of the season. Inspections fill up quickly once the first cold snap arrives, so book early.",
        bullets: ["Look for creosote buildup and loose or rusted sections", "Check that the cap and screen are intact", "Make sure smoke and carbon monoxide alarms work"],
      },
    ],
    closing: {
      title: "Want to see a stove or insert burning?",
      body: "Book a fireplace consult and bring a photo of the room. We will walk you through the options, including what keeps working on a burn-ban day.",
      cta: "Book a fireplace consult",
    },
    todoConfirm: [
      "Which agency calls the burn ban for Chelan County and Wenatchee, and the best link for it",
      "Which of our stove lines and models are Washington-certified (do not claim on the page until confirmed)",
      "Whether we are comfortable listing venting inspection timing/lead times",
    ],
    seo: { title: "Burn-ban-ready fireplace guide", description: "Washington Stage 1 and Stage 2 burn bans explained, why a certified stove matters and what keeps heating your home on a ban day." },
  },
  {
    slug: "pre-owned-first-look",
    interest: "pre-owned",
    kicker: "Pre-owned spas",
    title: "First look at pre-owned arrivals",
    summary: "Get an email when a pre-owned spa comes through our shop, a head start before it goes up for everyone. Plus the checklist we would use to shop one.",
    gives: ["A heads-up when new pre-owned spas arrive", "A checklist for shopping any used hot tub", "The questions worth asking before you buy"],
    readMinutes: 4,
    intro:
      "Pre-owned spas come through our shop as trade-ins and move quickly. Signing up gets you the first look. Until the first one arrives, here is how to shop a used hot tub, whether it is ours or anyone else's.",
    sections: [
      {
        heading: "How the first look works",
        body: "When a pre-owned spa is ready to show, subscribers get an email with the details before it is announced more widely. Pre-owned spas on our site are listed without prices: call or stop in for the number.",
      },
      {
        heading: "Questions to ask about any used hot tub",
        body: "A good seller can answer these in a sentence each.",
        bullets: [
          "How old is it, and what brand and model?",
          "What was inspected, tested, repaired or replaced before sale?",
          "Does it heat, pump and jet correctly, and for how long was it run?",
          "Is there any warranty or service backing, and what does it cover?",
          "Who delivers it, and what does delivery include?",
        ],
      },
      {
        heading: "Will it fit and plug in?",
        body: "Measure the spot, the path to it and the clearance for lifting. Ask what electrical the tub needs. Some small tubs run on a standard 120-volt outlet, while most full-size tubs need a dedicated 240-volt circuit installed by an electrician. Ask before you buy so there are no surprises on delivery day.",
      },
      {
        heading: "What to look at in person",
        body: "See it filled and running if you can. Check the cabinet and cover for damage, run every jet, listen to the pump, and look under the skirt for leaks or rust. A clean tub that has been looked after tells you a lot.",
      },
    ],
    closing: {
      title: "Come see what is on the floor.",
      body: "Book a visit and tell us what you are after. We will tell you what is in the shop and what is coming.",
      cta: "Ask about a spa",
    },
    todoConfirm: [
      "The 48-hour head-start promise (Plan v4.1): confirm Cam & Susan will actually hold new arrivals back that long",
      "Whether to call these 'certified' pre-owned, and what the shop inspection includes",
      "Warranty or service terms on pre-owned spas, and delivery terms",
    ],
    seo: { title: "First look at pre-owned spa arrivals", description: "Get a heads-up when pre-owned spas arrive at Seasonally Living in Wenatchee, plus a checklist for buying any used hot tub." },
  },
  {
    slug: "spring-2027-pool-planning",
    interest: "pool",
    kicker: "Swimming pools",
    title: "The spring 2027 pool planning guide",
    summary: "What to decide, check and ask this winter so a pool can go in when the ground thaws: site, permits, budget drivers and the questions for any builder.",
    gives: ["A winter-to-spring planning timeline", "What drives the cost of a pool", "Questions to ask every pool builder"],
    readMinutes: 6,
    intro:
      "Spring is when pools get built, and the planning happens in winter. Builders' calendars fill, permits take time and the site needs to be understood before anyone digs. This guide is the general shape of that process. Your site, your city or county and your builder will change the details.",
    sections: [
      {
        heading: "Why plan now",
        body: "A pool you want to swim in next summer needs a design, a permit and a place on a crew's schedule before the ground thaws. People who start in March often find the best dates are already spoken for. Starting in winter does not commit you to anything. It gives you time to choose well.",
      },
      {
        heading: "The usual order of things",
        body: "Every project is different, but most follow this order.",
        bullets: ["Consult: goals, site, budget and timing", "Design and written estimate", "Permits and any HOA or setback approvals", "Excavation and construction when the ground and weather allow", "Equipment, surround and finishing", "Fill, start-up and a walk-through on how to run it"],
      },
      {
        heading: "Look at the site first",
        body: "Before you fall in love with a shape, check the practical things. Where does the sun fall in the afternoon? Which way does the wind blow? Where are the underground utilities? In Washington you must call 811 before any digging so utilities can be marked. Is there room for equipment to reach the yard? Are there HOA rules, setbacks or easements?",
      },
      {
        heading: "What drives the cost",
        body: "Pool size and depth matter, but they are rarely the biggest swings. Access for equipment, rock or difficult soil, electrical work, gas or heating for the water, the fence or barrier your city requires, the deck and surround, and the equipment you choose all move the total. Ask for an estimate that lists these separately so you can compare builders fairly.",
      },
      {
        heading: "Permits and safety barriers",
        body: "Most cities and counties require a permit and a safety barrier such as a fence with a self-closing, self-latching gate. Rules vary by jurisdiction, so ask your city or county building department what applies to your address before you finalize a design.",
      },
      {
        heading: "Questions for any builder",
        body: "You are entitled to clear answers to these.",
        bullets: [
          "Are you registered as a contractor with Washington's Department of Labor & Industries, and are you bonded and insured? (You can look this up on L&I's website.)",
          "Who does the work: your own crew or subcontractors?",
          "What is included in the estimate and what is not?",
          "What is the payment schedule?",
          "What does the warranty cover, and who do I call after the first summer?",
          "What is the schedule, and what happens if weather delays it?",
        ],
      },
    ],
    closing: {
      title: "Get on the spring install list.",
      body: "Tell us about your site and we will set up a design consult as the season opens. No commitment.",
      cta: "Join the spring install list",
    },
    todoConfirm: [
      "Typical lead times and the number of spring 2027 install slots (do not publish numbers until confirmed)",
      "Pool types and sizes the crew builds, and any ballpark budget ranges the owners are comfortable sharing",
      "Which permit offices (City of Wenatchee, Chelan County, Douglas County) and any local rules worth naming",
      "Whether the crew is registered/bonded (we should state it) and warranty terms",
    ],
    seo: { title: "Spring 2027 pool planning guide", description: "Plan a swimming pool this winter for spring: site checks, permits, cost drivers and the questions to ask any builder." },
  },
];

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);
