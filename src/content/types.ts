// Content shapes shared by the site, the Sanity Studio schema and the seed script.
// Images are Cloudinary public IDs (cloud: tolowa-studio), e.g. "seasonally-living/brand/calspas/swim-pro-garden".

export type RichTitle = { before?: string; emphasis?: string; after?: string };
export type Seo = { title: string; description: string };
export type Item = { title: string; body: string };

export type Hero = {
  kicker: string;
  title: RichTitle;
  lead: string;
  image: string;
  alt: string;
  position?: string;
  cta: string;
};

export type LineContent = {
  _type: "linePage";
  pageId: string; // route path, e.g. "/hot-tubs"
  seo: Seo;
  interest: string;
  hero: Hero;
  points: { kicker: string; title: string; lead: string; items: Item[] };
  models?: { kicker: string; title: string; lead?: string; items: { tag?: string; name: string; body: string; bullets?: string[] }[] };
  feature: { kicker: string; title: string; body: string; bullets: string[]; image: string; alt: string };
  magnet?: { title: string; body: string };
  closing: { title: string; body: string; cta: string };
  quickLinks?: { label: string; href: string }[];
};

export type HomeContent = {
  _type: "homePageV2";
  pageId: "/";
  seo: Seo;
  hero: Hero & { credential: string; caption: string; secondaryCta: string; secondaryHref: string };
  stuv: { kicker: string; title: string; body: string; models: { name: string; body: string }[]; image: string; alt: string; cta: string; secondaryCta: string };
  venting: { kicker: string; title: string; body: string; cta: string; cards: { icon: string; title: string; body: string }[] };
  lines: { kicker: string; title: string; lead: string; items: { href: string; kicker: string; title: string; body: string; image: string }[] };
  seasons: { kicker: string; title: string; credit?: string; items: { name: string; lead: string; note: string; image?: string; alt?: string }[] };
  showroom: { kicker: string; title: string; body: string; image: string; alt: string; cta: string };
};

export type FireplacesContent = {
  _type: "fireplacesPage";
  pageId: "/fireplaces";
  seo: Seo;
  hero: Hero & { secondaryCta: string };
  collection: { kicker: string; title: string; lead: string; note: string; families: { kicker: string; title: string; body: string; models: string[] }[] };
  burnBan: { kicker: string; title: string; body: string; bullets: string[]; image: string; alt: string };
  steps: { kicker: string; title: string; items: Item[] };
  magnet: { title: string; body: string };
  closing: { title: string; body: string; cta: string };
};

export type ServiceContent = {
  _type: "servicePage";
  pageId: "/service";
  seo: Seo;
  hero: Hero & { secondaryCta: string };
  services: { kicker: string; title: string; items: { icon: string; title: string; body: string }[] };
  closing: { title: string; body: string; cta: string };
};

export type AboutContent = {
  _type: "aboutPage";
  pageId: "/about";
  seo: Seo;
  hero: Hero;
  owners?: { kicker: string; title: string; paragraphs: string[]; image: string; alt: string; caption?: string };
  timeline: { kicker: string; title: string; items: { year: string; title: string; body: string }[] };
  values: { kicker: string; title: string; body: string; bullets: string[]; image: string; alt: string };
  closing: { title: string; body: string };
};

export type SimpleContent = {
  _type: "simplePage";
  pageId: "/visit" | "/note";
  seo: Seo;
  kicker: string;
  title: string;
  lead: string;
  image?: string;
  alt?: string;
};

export type NavLink = { href: string; label: string; note?: string };
export type NavGroup = { label: string; href: string; items: NavLink[] };

export type SiteSettings = {
  _type: "siteSettings";
  name: string;
  legalName: string;
  description: string;
  founded: number;
  showroomOpened: number;
  owners: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  address: { line1: string; city: string; state: string; zip: string; note: string };
  hours: { days: string; time: string }[];
  serviceArea: string[];
  logo: string;
  /** Google Business Profile "write a review" link. Empty until the profile is claimed (TOL-2908); see reviewUrlsOf(). */
  googleReviewUrl?: string;
  /** The business Facebook page, e.g. https://www.facebook.com/<page>. Empty until confirmed. */
  facebookUrl?: string;
  /** Where Facebook recommendations are written (usually <facebookUrl>/reviews). */
  facebookReviewUrl?: string;
  /** Other listings (BBB, Yelp, the Google profile) for the LocalBusiness sameAs list. */
  sameAs?: string[];
  /** Showroom coordinates for LocalBusiness geo. */
  geo?: { lat: number; lng: number };
  navGroups: NavGroup[];
  navLinks: NavLink[];
};

export type PageContent = LineContent | HomeContent | FireplacesContent | ServiceContent | AboutContent | SimpleContent;

/** Public status of a pre-owned spa. Intake and reconditioning stages exist in Sanity but never reach the site. */
export type PreOwnedStatus = "listed" | "reserved" | "sold";

/** Public view of a pre-owned spa. Internal intake fields (source, costs, notes) are never selected into this type. */
export type PreOwnedSpa = {
  _id?: string;
  title: string;
  slug: string;
  status: PreOwnedStatus;
  brand?: string;
  model?: string;
  year?: number;
  seats?: number;
  size?: string;
  electrical?: string;
  /** Filterable feature tags (fixed list in the Studio). */
  features?: string[];
  highlights?: string[];
  /** "What our shop did" free text. */
  condition?: string;
  /** Labels of the shop checklist items staff ticked for this unit. */
  checklist?: string[];
  /** Warranty terms for this unit, as written by staff. Blank = not shown as a promise. */
  warranty?: string;
  /** ISO date (YYYY-MM-DD) the spa went on the floor. */
  listedDate?: string;
  soldDate?: string;
  /** Listed within the last few weeks (computed on the server). */
  justArrived?: boolean;
  photos?: { image: string; alt?: string }[];
  featured?: boolean;
  sortOrder?: number;
};

// Hearth brand pages (/fireplaces/[brand]). Content lives in code (src/content/brands.ts) for now.
// Images are Cloudinary public IDs under seasonally-living/brands/<slug>/ (manufacturer imagery, dealer use).
export type BrandModel = {
  name: string;
  type?: string; // e.g. "Wood stove", "Gas insert"
  description: string;
  facts: string[];
  image?: string;
  alt?: string;
  url?: string; // maker's product page
  inShowroom?: boolean;
};
export type BrandSection = { name: string; summary: string; image?: string; alt?: string; models: BrandModel[] };
export type BrandContent = {
  slug: string; // route segment, e.g. "stuv"
  name: string; // display name, e.g. "Stûv"
  origin: string; // e.g. "Belgium"
  categories: string[]; // e.g. ["Wood stoves", "Wood inserts"]
  tagline: { before?: string; emphasis?: string; after?: string };
  summary: string;
  heroImage: string;
  heroAlt: string;
  heroPosition?: string;
  points: { title: string; body: string }[];
  sections: BrandSection[];
  makerUrl: string;
  sourceNote: string; // credit line for manufacturer imagery
};
