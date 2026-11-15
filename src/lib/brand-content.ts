// Turns a hearthBrand document from Sanity into BrandContent the pages can render.
// Pure (type-only imports), so it can be checked under plain node.
//
// Unlike mergeContent, list items (points, sections, models) are never merged by position over the
// code defaults: if staff delete or reorder a model, the next model must not inherit the deleted
// one's photo or "In our showroom" badge. A list from Sanity replaces the code list whole; a blank
// top-level field (hero image, summary...) falls back to the code default for the same brand.
import type { BrandContent, BrandModel, BrandSection } from "@/content/types";

type Raw = Record<string, unknown>;

const isObj = (v: unknown): v is Raw => !!v && typeof v === "object" && !Array.isArray(v);
// Blank means unset; otherwise keep the value exactly (headline parts carry their own spaces, e.g. "Stûv: ").
const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v : undefined);
const strList = (v: unknown): string[] => (Array.isArray(v) ? v.map(str).filter((x): x is string => !!x) : []);
const objList = (v: unknown): Raw[] => (Array.isArray(v) ? v.filter(isObj) : []);

function model(m: Raw): BrandModel | null {
  const name = str(m.name);
  if (!name) return null;
  return {
    name,
    type: str(m.type),
    description: str(m.description) ?? "",
    facts: strList(m.facts),
    image: str(m.image),
    alt: str(m.alt),
    url: str(m.url),
    inShowroom: m.inShowroom === true,
  };
}

function section(s: Raw): BrandSection | null {
  const name = str(s.name);
  if (!name) return null;
  return {
    name,
    summary: str(s.summary) ?? "",
    image: str(s.image),
    alt: str(s.alt),
    models: objList(s.models).map(model).filter((x): x is BrandModel => !!x),
  };
}

/** Returns null when the document can't render a page (no slug, name or hero image, here or in code). */
export function brandFromSanity(raw: unknown, fallback?: BrandContent): BrandContent | null {
  if (!isObj(raw)) return null;
  const slug = str(raw.slug) ?? fallback?.slug;
  const name = str(raw.name) ?? fallback?.name;
  const heroImage = str(raw.heroImage) ?? fallback?.heroImage;
  if (!slug || !name || !heroImage) return null;

  const tagline = isObj(raw.tagline) ? raw.tagline : {};
  const hasTagline = !!(str(tagline.before) || str(tagline.emphasis) || str(tagline.after));
  const points = objList(raw.points)
    .map((p) => ({ title: str(p.title) ?? "", body: str(p.body) ?? "" }))
    .filter((p) => p.title);
  const sections = objList(raw.sections).map(section).filter((x): x is BrandSection => !!x);
  const categories = strList(raw.categories);

  return {
    slug,
    name,
    origin: str(raw.origin) ?? fallback?.origin ?? "",
    categories: categories.length ? categories : (fallback?.categories ?? []),
    tagline: hasTagline
      ? { before: str(tagline.before), emphasis: str(tagline.emphasis), after: str(tagline.after) }
      : (fallback?.tagline ?? { emphasis: name }),
    summary: str(raw.summary) ?? fallback?.summary ?? "",
    heroImage,
    heroAlt: str(raw.heroAlt) ?? fallback?.heroAlt ?? name,
    heroPosition: str(raw.heroPosition) ?? fallback?.heroPosition,
    points: points.length ? points : (fallback?.points ?? []),
    sections: sections.length ? sections : (fallback?.sections ?? []),
    makerUrl: str(raw.makerUrl) ?? fallback?.makerUrl ?? "",
    sourceNote: str(raw.sourceNote) ?? fallback?.sourceNote ?? "",
  };
}
