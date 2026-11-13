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
  seasons: { kicker: string; title: string; items: { name: string; lead: string; note: string }[] };
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
  navGroups: NavGroup[];
  navLinks: NavLink[];
};

export type PageContent = LineContent | HomeContent | FireplacesContent | ServiceContent | AboutContent | SimpleContent;
