// Local-SEO helpers: LocalBusiness / BreadcrumbList / FAQPage JSON-LD built from siteSettings,
// the review links, and the OG image URL convention. Pure functions, no I/O.
import { BRANDS } from "@/content/brands";
import type { SiteSettings } from "@/content/types";
import { getSiteUrl, mapsUrlOf } from "@/lib/site";

const CLOUDINARY = "https://res.cloudinary.com/tolowa-studio/image/upload";

/** Absolute URL for a site path ("/hot-tubs" -> "https://seasonallyliving.com/hot-tubs"). */
export const absoluteUrl = (path: string) => `${getSiteUrl()}${path === "/" ? "" : path}`;

/** Serialises JSON-LD for a <script> tag; "<" is escaped so no string can close the tag (Next JSON-LD guide). */
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

/** Cloudinary public ID -> a plain delivery URL (for schema.org image fields). */
export const cloudinaryUrl = (id: string, transform = "f_auto,q_auto,w_1200") => `${CLOUDINARY}/${transform}/${id}`;

// ---- Reviews ----

export type ReviewUrls = {
  google: string;
  /** True while no real Business Profile link is configured: the button falls back to the Maps listing search. */
  googleIsPlaceholder: boolean;
  facebook?: string;
};

/**
 * Where the /review buttons point. Order: Sanity siteSettings.googleReviewUrl, then the GOOGLE_REVIEW_URL env var
 * (runtime, so Cloud Run can set it without a rebuild), then the Maps listing search as a stop-gap until the
 * Business Profile is claimed (TOL-2908). Facebook is shown only when a URL is configured.
 */
export function reviewUrlsOf(s: SiteSettings): ReviewUrls {
  const configured = s.googleReviewUrl?.trim() || process.env.GOOGLE_REVIEW_URL?.trim() || "";
  const facebook = s.facebookReviewUrl?.trim() || process.env.FACEBOOK_REVIEW_URL?.trim() || (s.facebookUrl?.trim() ? `${s.facebookUrl.trim().replace(/\/$/, "")}/reviews` : "");
  return {
    google: configured || mapsUrlOf(s),
    googleIsPlaceholder: !configured,
    facebook: facebook || undefined,
  };
}

// ---- Hours ----

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "Tuesday – Saturday" -> ["Tuesday", ..., "Saturday"]; "Saturday" -> ["Saturday"]; unparseable -> []. */
function expandDays(label: string): string[] {
  const parts = label.split(/\s*[–—-]\s*|\s+to\s+/i).map((p) => DAYS.find((d) => d.toLowerCase() === p.trim().toLowerCase()));
  if (parts.length === 1 && parts[0]) return [parts[0]];
  if (parts.length === 2 && parts[0] && parts[1]) {
    const out: string[] = [];
    for (let i = DAYS.indexOf(parts[0]); ; i = (i + 1) % 7) {
      out.push(DAYS[i]);
      if (DAYS[i] === parts[1]) break;
    }
    return out;
  }
  return [];
}

/** "10am – 4pm" -> ["10:00", "16:00"]; anything else (e.g. "Closed (appointments welcome)") -> null. */
function parseTimes(label: string): [string, string] | null {
  const m = label.match(/^\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*[–—-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*$/i);
  if (!m) return null;
  const to24 = (h: string, min: string | undefined, ap: string) => {
    let hour = Number(h) % 12;
    if (ap.toLowerCase() === "pm") hour += 12;
    return `${String(hour).padStart(2, "0")}:${min ?? "00"}`;
  };
  return [to24(m[1], m[2], m[3]), to24(m[4], m[5], m[6])];
}

export function openingHoursOf(hours: SiteSettings["hours"]) {
  return hours.flatMap((h) => {
    const dayOfWeek = expandDays(h.days);
    const times = parseTimes(h.time);
    return dayOfWeek.length && times
      ? [{ "@type": "OpeningHoursSpecification", dayOfWeek, opens: times[0], closes: times[1] }]
      : [];
  });
}

// ---- LocalBusiness ----

/** Site-wide business entity. Rendered once in the root layout; pages reference it by @id. */
export function localBusinessJsonLd(s: SiteSettings, image?: string) {
  const sameAs = [...(s.sameAs ?? []), s.facebookUrl].filter((u): u is string => !!u && /^https?:\/\//.test(u));
  return {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "Store"],
    "@id": `${absoluteUrl("/")}/#business`,
    name: s.legalName,
    alternateName: s.name,
    url: absoluteUrl("/"),
    description: s.description,
    telephone: s.phoneTel,
    email: s.email,
    foundingDate: String(s.founded),
    logo: cloudinaryUrl(s.logo, "f_png,q_auto,h_300"),
    image: image ? [image] : undefined,
    hasMap: mapsUrlOf(s),
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address.line1,
      addressLocality: s.address.city,
      addressRegion: s.address.state,
      postalCode: s.address.zip,
      addressCountry: "US",
    },
    geo: s.geo ? { "@type": "GeoCoordinates", latitude: s.geo.lat, longitude: s.geo.lng } : undefined,
    openingHoursSpecification: openingHoursOf(s.hours),
    areaServed: s.serviceArea.map((name) => ({ "@type": "City", name: `${name}, WA` })),
    brand: ["Cal Spas", ...BRANDS.map((b) => b.name)].map((name) => ({ "@type": "Brand", name })),
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

// ---- Breadcrumbs / FAQ ----

export type Crumb = { name: string; path: string };

/** Home is added for you. The last crumb is the current page. */
export function breadcrumbJsonLd(trail: Crumb[]) {
  const all: Crumb[] = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

// ---- Open Graph images ----

/** Path of the generated share image for a page key ("home", "hot-tubs", "brand-stuv", "area-leavenworth"). */
export const ogImagePath = (key: string) => `/og/${key}`;

export const ogImageMeta = (key: string, alt: string) => ({ url: ogImagePath(key), width: 1200, height: 630, alt });

/**
 * Canonical + Open Graph + Twitter for a page. Passing `openGraph` on a page replaces the layout's whole openGraph
 * object (Next merges metadata shallowly), so this restates siteName / locale / type with the page's own image.
 */
export function socialMeta(o: { fullTitle: string; description: string; path: string; ogKey: string; ogAlt: string }) {
  return {
    alternates: { canonical: o.path },
    openGraph: {
      type: "website" as const,
      siteName: "Seasonally Living",
      locale: "en_US",
      title: o.fullTitle,
      description: o.description,
      url: o.path,
      images: [ogImageMeta(o.ogKey, o.ogAlt)],
    },
    twitter: { card: "summary_large_image" as const, title: o.fullTitle, description: o.description, images: [ogImagePath(o.ogKey)] },
  };
}

export const SITE_TITLE_SUFFIX = "Seasonally Living, Wenatchee";
