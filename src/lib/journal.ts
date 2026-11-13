import { cache } from "react";
import { createClient } from "@sanity/client";
import { DEFAULT_POSTS, JOURNAL_TAG_IDS, type JournalPost, type JournalSeason, type JournalStatus, type PortableBlock } from "@/content/journal";
import { SANITY_DATASET, SANITY_PROJECT_ID, REVALIDATE_SECONDS } from "@/lib/sanity";
import { getSiteUrl } from "@/lib/site";

// Journal posts: Sanity documents of type "post", merged over the code defaults in src/content/journal.ts.
// A post is visible when its status is approved, scheduled or published AND its publishAt (if any) has passed.
// "approved" counts so a Facebook post that links to the article never points at a 404.
// A Sanity post with the same slug as a default replaces it (status "draft" retires the default).

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: true,
  perspective: "published",
});

const FIELDS = `_id, title, "slug": slug.current, tags, season, heroImage, heroAlt, excerpt, body, status, publishAt, "updatedAt": _updatedAt, "posted": defined(results.facebookUrl) || defined(results.instagramUrl) || defined(results.gbpUrl)`;
const VISIBLE: JournalStatus[] = ["approved", "scheduled", "published"];
const STATUSES: JournalStatus[] = ["draft", "approved", "scheduled", "published"];
const SEASONS: JournalSeason[] = ["winter", "spring", "summer", "fall", "year-round"];

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Validates one Sanity row into a JournalPost, or null when it can't be shown. Pure, so it is unit-testable. */
export function postFromSanity(row: unknown): JournalPost | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const slug = str(r.slug);
  const title = str(r.title);
  const status = STATUSES.find((s) => s === r.status) ?? "draft";
  if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || !title) return null;
  const body = Array.isArray(r.body) ? (r.body.filter((b) => b && typeof b === "object" && (b as { _type?: unknown })._type === "block") as PortableBlock[]) : [];
  const publishAt = str(r.publishAt);
  return {
    _id: str(r._id) || `post-${slug}`,
    title,
    slug,
    tags: Array.isArray(r.tags) ? r.tags.filter((t): t is string => typeof t === "string" && JOURNAL_TAG_IDS.includes(t)) : [],
    season: SEASONS.find((s) => s === r.season),
    heroImage: str(r.heroImage) || "seasonally-living/brand/local/valley-overview",
    heroAlt: str(r.heroAlt) || title,
    excerpt: str(r.excerpt),
    body,
    status,
    posted: r.posted === true,
    publishAt: publishAt && !Number.isNaN(Date.parse(publishAt)) ? publishAt : undefined,
    updatedAt: str(r.updatedAt) || undefined,
  };
}

/** True when the post should be on the public site right now. */
export function isVisible(p: Pick<JournalPost, "status" | "publishAt" | "posted">, now = Date.now()): boolean {
  if (p.posted) return true; // already linked from Facebook / Instagram / Google
  if (!VISIBLE.includes(p.status)) return false;
  return !p.publishAt || Date.parse(p.publishAt) <= now;
}

/** Newest first. Posts without a date sort last, by title, so the order is stable. */
export function sortPosts(posts: JournalPost[]): JournalPost[] {
  const t = (p: JournalPost) => (p.publishAt ? Date.parse(p.publishAt) : 0);
  return [...posts].sort((a, b) => t(b) - t(a) || a.title.localeCompare(b.title));
}

const fetchRows = cache(async (): Promise<unknown[] | null> => {
  try {
    return await client.fetch<unknown[]>(`*[_type == "post" && defined(slug.current)]{${FIELDS}}`, {}, {
      signal: AbortSignal.timeout(4000),
      next: { revalidate: REVALIDATE_SECONDS, tags: ["post"] },
    });
  } catch (err) {
    console.error("sanity: post fetch failed", err instanceof Error ? err.message : err);
    return null;
  }
});

/** Every visible post, newest first (Sanity posts over code defaults). */
export const getPosts = cache(async (): Promise<JournalPost[]> => {
  const fromSanity = ((await fetchRows()) ?? []).map(postFromSanity).filter((p): p is JournalPost => !!p);
  const taken = new Set(fromSanity.map((p) => p.slug));
  const merged = [...fromSanity, ...DEFAULT_POSTS.filter((p) => !taken.has(p.slug))];
  const now = Date.now();
  // Social-only posts (no article body, e.g. a pre-owned arrival) go out to Facebook, Instagram and Google but get no page here.
  return sortPosts(merged.filter((p) => p.body.length > 0 && isVisible(p, now)));
});

export async function getPost(slug: string): Promise<JournalPost | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Simple HTML for feeds (headings, paragraphs, lists; marks dropped). All text is escaped. */
export function bodyHtml(body: PortableBlock[]): string {
  let out = "";
  let open: "ul" | "ol" | null = null;
  const close = () => {
    if (open) out += `</${open}>`;
    open = null;
  };
  for (const b of body) {
    const text = esc(b.children.map((c) => c.text).join(""));
    if (b.listItem) {
      const tag = b.listItem === "number" ? "ol" : "ul";
      if (open !== tag) {
        close();
        out += `<${tag}>`;
        open = tag;
      }
      out += `<li>${text}</li>`;
      continue;
    }
    close();
    out += b.style === "h2" ? `<h2>${text}</h2>` : b.style === "h3" ? `<h3>${text}</h3>` : b.style === "blockquote" ? `<blockquote>${text}</blockquote>` : `<p>${text}</p>`;
  }
  close();
  return out;
}

/** Plain text of a body, for reading time and feeds. */
export function bodyText(body: PortableBlock[]): string {
  return body.map((b) => b.children.map((c) => c.text).join("")).join("\n\n");
}

export const readingMinutes = (body: PortableBlock[]) => Math.max(1, Math.round(bodyText(body).split(/\s+/).filter(Boolean).length / 220));

export const postUrl = (slug: string) => `${getSiteUrl()}/journal/${slug}`;
/** Absolute Cloudinary URL for feeds and structured data. */
// (Not imported from cloudinary-loader.ts: that file is "use client", so its exports are unusable on the server.)
export const imageUrl = (id: string, width = 1200) => `https://res.cloudinary.com/tolowa-studio/image/upload/f_auto,q_auto,c_limit,w_${width}/${id}`;
