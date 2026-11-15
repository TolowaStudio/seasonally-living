import type { Hero } from "./types";
import { IMG } from "./pages";

// Service-area pages (/areas/[town]). Written to be useful to someone in that town: what is different about
// living or building there, which of our lines it points to, and what to ask. Not templated doorway pages;
// each town's copy, FAQs and emphasis are its own. Facts are limited to public geography and what the shop
// already says elsewhere on the site. Delivery and service radius is TODO-confirm with Cam (see PR).

export type AreaFaq = { q: string; a: string };
export type AreaContent = {
  slug: string;
  /** Short name used in links: "Leavenworth" */
  name: string;
  /** Names in page copy and titles: "Chelan & Manson" */
  label: string;
  /** Title for <title>, before the site template adds "| Seasonally Living, Wenatchee". */
  title: string;
  description: string;
  hero: Pick<Hero, "kicker" | "image" | "alt" | "position"> & { title: { before: string; emphasis: string }; lead: string };
  /** Relationship to the showroom, one honest sentence */
  distance: string;
  paragraphs: string[];
  /** What this town tends to ask us about, linked to the lines */
  lines: { href: string; title: string; body: string }[];
  faqs: AreaFaq[];
  interest: string;
  /** Names that count as this area in settings.serviceArea */
  serves: string[];
};

export const AREAS: AreaContent[] = [
  {
    slug: "wenatchee",
    name: "Wenatchee",
    label: "Wenatchee",
    title: "Hot Tubs, Fireplaces & Pools in Wenatchee",
    description:
      "Seasonally Living, 1407 Maiden Ln next to Home Depot: Cal Spas hot tubs and swim spas, pools, Stûv fireplaces and venting in Wenatchee since 1979.",
    hero: {
      kicker: "Serving Wenatchee",
      title: { before: "Your neighbors in ", emphasis: "Wenatchee." },
      lead: "The showroom is on Maiden Lane, next to Home Depot. Family-owned by Cam and Susan McNeill, and in this valley since 1979, first as Chim Chimney Fireplace & Masonry.",
      image: IMG.localValley,
      alt: "The Wenatchee Valley seen from above on a clear day",
      position: "center 60%",
    },
    distance: "We're in Wenatchee, so there's nothing to drive for: the showroom is the shop, the service desk and the place to try a tub.",
    paragraphs: [
      "If you live in Wenatchee, you are about as close to us as anyone gets. That matters more than it sounds. A hot tub, a stove or a pool is a ten-year relationship, and the people who sold it to you should be a short drive away in year eight.",
      "Our winters are cold and dry, which is exactly why a hot tub earns its keep here and why a good wood stove is worth having. It also means burn bans get called when the air is bad, so many Wenatchee homeowners look at a gas or electric insert alongside a wood stove, to keep a fire on the days wood is off the table.",
      "Start in the showroom. We keep Cal Spas tubs filled and running, wood stoves and inserts on the floor, and a venting counter that has served builders and homeowners in the valley for decades. Bring your questions, your measurements or a photo of the spot you have in mind.",
    ],
    lines: [
      { href: "/hot-tubs", title: "Hot tubs", body: "Try a running Cal Spas tub before you decide, then let us deliver, set up and show you how it works." },
      { href: "/fireplaces", title: "Fireplaces & stoves", body: "Stûv, Kuma, Morsø and Napoleon, with the venting designed and installed by the same crew." },
      { href: "/pools", title: "Swimming pools", body: "Installed by our own crew. Plan over winter so the work can start when the ground thaws." },
      { href: "/spa-care", title: "Pool & spa care", body: "Chemicals, filters and answers for cloudy water, at the counter on Maiden Lane." },
    ],
    faqs: [
      { q: "Where is the Seasonally Living showroom in Wenatchee?", a: "1407 Maiden Ln, Wenatchee, WA 98801, next to Home Depot. We're open Tuesday to Saturday, 10am to 4pm, and appointments are welcome on Sunday and Monday." },
      { q: "Can I try a hot tub before I buy it?", a: "Yes. We keep Cal Spas models filled and running in the showroom, so you can sit in one. Booking a try-out ahead lets us have the right models ready." },
      { q: "I want a fireplace but I'm worried about burn bans. What are my options?", a: "A gas or electric insert gives you a fire on days when wood burning is restricted, and many people pair one with a wood stove. Current burn-ban status comes from the county and state, so check there before lighting wood on a restricted day." },
    ],
    interest: "hearth",
    serves: ["Wenatchee"],
  },
  {
    slug: "east-wenatchee",
    name: "East Wenatchee",
    label: "East Wenatchee",
    title: "Hot Tubs, Fireplaces & Pools for East Wenatchee",
    description:
      "Hot tubs, swim spas, pools and Stûv fireplaces for East Wenatchee homes, from Seasonally Living a few minutes across the river.",
    hero: {
      kicker: "Serving East Wenatchee",
      title: { before: "Just across the river, ", emphasis: "East Wenatchee." },
      lead: "Our showroom is a few minutes from the Douglas County side of the Columbia. We deliver, install and service for East Wenatchee homes.",
      image: IMG.localRiver,
      alt: "The Columbia River below mountains near Wenatchee",
    },
    distance: "East Wenatchee is a short drive from the showroom on the other side of the Columbia River.",
    paragraphs: [
      "East Wenatchee sits in Douglas County, across the river from our Chelan County showroom. For most things that makes no difference, but for permits it can: the office that handles a gas line, a chimney or a pool in East Wenatchee isn't the same one that handles Wenatchee. We'll tell you which one to ask before you buy, so the permit doesn't surprise you after.",
      "Many East Wenatchee homes are newer builds with open yards, which suits a swim spa or a pool, and a clean modern stove or a linear gas fireplace in a great room. Newer homes often have no chimney at all, which is where our venting design work comes in: we plan the pipe route before the appliance is chosen.",
      "Bring a photo or a measurement of the spot you're picturing, whether that's a corner of the deck, a living-room wall or a back yard. We'll tell you what fits and what it would take.",
    ],
    lines: [
      { href: "/fireplaces/gas-electric", title: "Gas & electric fireplaces", body: "A good fit for newer homes without a chimney, with the venting planned from the start." },
      { href: "/swim-spas", title: "Swim spas", body: "Swim all year in a footprint a fraction of a pool's." },
      { href: "/pools", title: "Swimming pools", body: "In-ground pools installed by our own crew." },
      { href: "/service", title: "Venting & service", body: "Design, installation and inspections for stoves, inserts and fireplaces." },
    ],
    faqs: [
      { q: "Do you deliver hot tubs and swim spas to East Wenatchee?", a: "Yes, East Wenatchee is part of our regular service area. Delivery and setup are scheduled when you buy; call us at (509) 667-8833 for timing." },
      { q: "Who issues permits in East Wenatchee for a stove, pool or gas line?", a: "East Wenatchee is in Douglas County, so the office can differ from Wenatchee's. We'll point you to the right one for your address before work starts." },
      { q: "My East Wenatchee house has no chimney. Can I still have a fireplace?", a: "Usually, yes. Gas and electric fireplaces and many stoves can be vented through a wall or roof. We design the venting around your room and your appliance." },
    ],
    interest: "hearth",
    serves: ["East Wenatchee"],
  },
  {
    slug: "leavenworth",
    name: "Leavenworth",
    label: "Leavenworth",
    title: "Hot Tubs & Stoves for Leavenworth Homes and Cabins",
    description:
      "Hot tubs, swim spas and wood stoves for Leavenworth homes, cabins and second homes, from the Seasonally Living showroom in Wenatchee.",
    hero: {
      kicker: "Serving Leavenworth",
      title: { before: "For cabins, second homes and ", emphasis: "snowy Leavenworth winters." },
      lead: "About 22 miles up the valley from our showroom. Hot tubs for the deck, stoves for the cabin, and a crew that has been installing and venting stoves in this valley since 1979.",
      image: IMG.localSnowPeaks,
      alt: "Snow-covered peaks above a mountain valley near Leavenworth",
    },
    distance: "Leavenworth is about 22 miles up the valley from the Wenatchee showroom.",
    paragraphs: [
      "Leavenworth is a different winter than Wenatchee. There is more snow, the nights are colder, and many of the homes are cabins and second homes that aren't lived in all week. That changes what we recommend.",
      "A hot tub on a Leavenworth deck is a winter tub: you want it easy to get to in the snow and to keep warm. If the house sits empty between trips, tell us how often you're there. A tub that's used on weekends needs a plan for keeping the water clean and the equipment protected from freezing between visits, and we'll walk you through it. We also plan around the delivery: the route, the access and where the tub will be placed on a sloped or snowy lot.",
      "For heat, a wood stove is the classic cabin fire, and it's our heritage: we started in 1979 as a chimney and fireplace business. We design the venting so the stove draws properly and meets code in a house that might sit through a hard winter. A gas or electric insert is worth a look if you want instant heat the moment you arrive, or if wood is off limits when a burn ban is called.",
    ],
    lines: [
      { href: "/hot-tubs", title: "Hot tubs", body: "Winter soaking for the deck, with delivery and setup planned for snow and slope." },
      { href: "/fireplaces", title: "Wood stoves & inserts", body: "The cabin fire, vented properly. Stûv, Kuma, Morsø and Napoleon." },
      { href: "/fireplaces/gas-electric", title: "Gas & electric inserts", body: "Instant heat when you walk in, and a fire on burn-ban days." },
      { href: "/pre-owned", title: "Pre-owned spas", body: "Inspected trade-ins, a good way into a tub for a second home." },
    ],
    faqs: [
      { q: "Do you deliver hot tubs to Leavenworth?", a: "Yes, Leavenworth is part of our service area. Because access and snow vary a lot by lot, we look at the route and the placement with you when you buy." },
      { q: "Can a hot tub work at a second home I'm not at all week?", a: "Often, yes. It takes a plan for water care and freeze protection between visits. Tell us how often you're there and we'll go through what works." },
      { q: "What stove is right for a Leavenworth cabin?", a: "That depends on the size of the space and the existing chimney or wall. We start with the room and the venting, then match the appliance, whether that's a Stûv, Kuma, Morsø or a gas or electric option." },
    ],
    interest: "hot-tub",
    serves: ["Leavenworth"],
  },
  {
    slug: "chelan",
    name: "Chelan",
    label: "Chelan & Manson",
    title: "Hot Tubs, Swim Spas & Stoves in Chelan and Manson",
    description:
      "Hot tubs, swim spas, pools and Stûv wood stoves for Chelan and Manson lake homes, from Seasonally Living in Wenatchee.",
    hero: {
      kicker: "Serving Chelan & Manson",
      title: { before: "Lake-country homes, ", emphasis: "all four seasons." },
      lead: "From our showroom in Wenatchee up to Lake Chelan: hot tubs and swim spas for the deck, stoves for the cold months, pools built by our crew.",
      image: IMG.localLupine,
      alt: "Lupine wildflowers in front of mountains in North Central Washington",
    },
    distance: "Chelan is about 37 miles from the Wenatchee showroom, with Manson a little farther up the lake.",
    paragraphs: [
      "Around Lake Chelan and Manson, a lot of homes are lived in for part of the year. Summers are busy, and the same house can be quiet in January. We think about hot tubs, swim spas and stoves differently for a home like that.",
      "A swim spa is a natural fit for a lake-country property: swim against the current on a day the lake is too rough or too cold, then soak. It takes much less room than a pool, which helps on a lot that was shaped around a view. If you do want a pool, our own crew installs them, and winter is the time to plan one for spring.",
      "For the cold months, a wood stove or a gas insert can make a second home feel like a home the minute you walk in. We design the venting for the house you have and the way you use it, and we're glad to talk through burn bans before you choose a fuel.",
    ],
    lines: [
      { href: "/swim-spas", title: "Swim spas", body: "Year-round swimming and soaking without a pool's footprint." },
      { href: "/hot-tubs", title: "Hot tubs", body: "Cal Spas tubs for the deck, with delivery and setup." },
      { href: "/pools", title: "Swimming pools", body: "Installed by our own crew. Plan over winter for spring." },
      { href: "/fireplaces", title: "Wood stoves & inserts", body: "Heat for the cold months, vented to code." },
    ],
    faqs: [
      { q: "Do you serve Chelan and Manson?", a: "Yes. Chelan and Manson are in our service area. Call (509) 667-8833 and we'll go through delivery and scheduling for your address." },
      { q: "I only use my lake house part of the year. What should I buy?", a: "We'd start with how often you're there and what you want from it. A swim spa or hot tub can work with the right water-care and winter plan, and a stove or insert can make arrival easy." },
      { q: "Can your crew build a pool near Chelan?", a: "We install swimming pools with our own crew in North Central Washington. A site visit is the way to know what your lot allows; start with a consult over the winter." },
    ],
    interest: "swim-spa",
    serves: ["Chelan", "Manson"],
  },
  {
    slug: "cashmere",
    name: "Cashmere",
    label: "Cashmere",
    title: "Fireplace Inserts, Venting & Hot Tubs in Cashmere",
    description:
      "Fireplace inserts, wood stoves, venting inspections and Cal Spas hot tubs for Cashmere homes, from Seasonally Living in Wenatchee.",
    hero: {
      kicker: "Serving Cashmere",
      title: { before: "Old houses, orchard country, ", emphasis: "good fires." },
      lead: "Cashmere is about 10 miles up the valley from our showroom. If your home has an older fireplace, or you want a hot tub among the trees, we'd be glad to help.",
      image: IMG.localBalsamroot,
      alt: "Balsamroot wildflowers on a hillside in North Central Washington",
    },
    distance: "Cashmere is about 10 miles up the valley from the Wenatchee showroom.",
    paragraphs: [
      "Cashmere has a lot of older houses, and older houses often have older fireplaces. A masonry fireplace that looked fine for years can be drafty, smoky or just not worth the wood. An insert is often the answer: it turns the old opening into an efficient fire, using the chimney you already have.",
      "That's where our history helps. We started in 1979 as Chim Chimney Fireplace & Masonry, and venting is still the heart of the business. Before we recommend an insert, we look at the venting that's already in your house. A venting inspection is also a good idea before you buy or sell, or before the first fire of the season.",
      "Out in the orchards and on the larger lots around town, a hot tub on the patio is hard to beat in winter. Try one in the showroom and bring us a photo of your patio. We'll talk about where it fits and what the delivery will look like.",
    ],
    lines: [
      { href: "/service", title: "Venting & inspections", body: "A clear look at the venting you have before you add an insert or light the first fire." },
      { href: "/fireplaces", title: "Inserts & wood stoves", body: "Turn an old masonry fireplace into an efficient fire." },
      { href: "/hot-tubs", title: "Hot tubs", body: "A winter soak on the patio, delivered and set up." },
      { href: "/hearth-supplies", title: "Hearth & venting supplies", body: "Pipe, parts, mantels and the maintenance essentials." },
    ],
    faqs: [
      { q: "Can I put an insert in my old Cashmere fireplace?", a: "Often you can. We start by looking at the fireplace and the venting that's already there, then recommend an insert that fits the opening and the flue." },
      { q: "Do you do venting inspections in Cashmere?", a: "Yes. A venting inspection gives you a clear look at the system before you buy, sell, add an insert or light the first fire. Call (509) 667-8833 to set one up." },
      { q: "How far is the showroom from Cashmere?", a: "About 10 miles down the valley, in Wenatchee at 1407 Maiden Ln next to Home Depot." },
    ],
    interest: "venting",
    serves: ["Cashmere"],
  },
];

export const getArea = (slug: string) => AREAS.find((a) => a.slug === slug);
