// Shared helpers for the content scripts (draft-week.ts, draft-from-transcript.ts, import-drafts.ts).
// Draft-only: nothing in here writes to Sanity or posts anywhere. Run with Node (type stripping):
//   node --experimental-strip-types scripts/content/draft-week.ts --help
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { SETTINGS } from "../../src/content/settings.ts";
import type { GbpCta, JournalSeason } from "../../src/content/journal.ts";
import { JOURNAL_TAG_IDS } from "../../src/content/journal.ts";
import { heroFor, type Line } from "../../src/content/calendar.ts";

export const DEFAULT_MODEL = "claude-haiku-5-5";
export const GBP_CTAS: GbpCta[] = ["LEARN_MORE", "CALL", "BOOK", "ORDER", "SHOP", "SIGN_UP"];

/** The API key comes from the environment only; it is never printed or written anywhere. */
export function apiKey(): string {
  const direct = process.env.ANTHROPIC_API_KEY?.trim();
  if (direct) return direct;
  const file = process.env.ANTHROPIC_API_KEY_FILE;
  if (file) return readFileSync(file, "utf8").trim();
  throw new Error(
    "No Anthropic key. Set ANTHROPIC_API_KEY, or ANTHROPIC_API_KEY_FILE=<path to a file holding it>.\n" +
      "Find the secret name with: motion-credential-probe anthropic (GCP Secret Manager, project tolowa-studio).",
  );
}

// ---------- The writer's brief (shared by every script) ----------

const s = SETTINGS;
export const HOUSE_RULES = `You write social posts and short articles for ${s.name} (${s.legalName}), a family-owned home-resort showroom in ${s.address.city}, ${s.address.state}. Owners: ${s.owners}. Showroom: ${s.address.line1}, ${s.address.city}. Hours: ${s.hours.map((h) => `${h.days} ${h.time}`).join("; ")}. Phone ${s.phoneDisplay}.

WHAT THE SHOP SELLS AND DOES (the only product claims you may make):
- Cal Spas hot tubs and swim spas; pre-owned spas inspected by the shop (no prices posted: "call for price"); swimming pool installation by the shop's own crew; pool and spa chemicals and care.
- Hearth: Stûv, Kuma, Morsø and Napoleon (wood stoves, inserts, gas and electric fireplaces); venting design and install, venting inspections, a venting parts counter.
- The shop does NOT offer: saunas, outdoor kitchens or fire features, patios or gazebos, general contracting, chimney sweeping, chimney liners.

VOICE: plain, warm, local and true. Short sentences. Talk like the person on the showroom floor, not a marketing team. No hype words (amazing, stunning, ultimate, luxurious). At most one emoji per post, and none is better. Never use em dashes.

TRUTH RULES (a person proofs every draft, but you are the first line):
- Never invent facts: no prices, discounts, sales, stock levels, specs, model names, years, warranty terms, certifications, statistics, customer stories, quotes, event dates or times.
- Shop-specific claims come only from the list above or from the INPUT section. General, widely known advice (safety, care, how things work) is fine.
- If you need a fact you were not given, write a placeholder like [[ADD: model, seats and year of the spa]] and list it in needs_confirm. Never guess.
- If you state anything about the shop's own process, warranty, or services beyond the list above, list it in needs_confirm.
- needs_confirm is only for placeholders and for shop-specific claims you were not given. Do not list the hours, phone number or address above (they are checked elsewhere), and do not mention links or scheduling.
- When the INPUT says "none supplied", you are writing a TEMPLATE. Do not say anything has arrived, is on the floor, or is shown in a video. Start the Facebook text, the Instagram caption and the Google text each with a placeholder line like [[ADD: ...]] saying what the person must supply, and keep the rest short and generic.
- Safety topics (electrical, fire, freezing): keep to well-known, conservative advice and point people to the manufacturer's instructions and local rules.

CHANNEL RULES:
- Facebook: 300-600 characters, conversational, can use short paragraphs. Do not include a URL; the article link is added automatically when there is one.
- Instagram caption: up to 1200 characters, no URLs (say "link in bio" if there is an article). Separately give 5-7 hashtags, always including #wenatchee and #seasonallyliving.
- Google Business Profile: 150-700 characters, factual and useful, NO phone numbers, NO emoji, no hashtags. Pick the call-to-action button that fits.
- Article (when asked): 300-500 words, headed sections written as "## Heading" lines, bullets as "- ", paragraphs separated by a blank line. End with one plain sentence inviting people to call or visit.`;

export type Draft = {
  title: string;
  excerpt: string;
  tags: string[];
  body_markdown: string;
  facebook: string;
  instagram_caption: string;
  instagram_hashtags: string[];
  gbp_text: string;
  gbp_cta: GbpCta;
  video_hook?: string;
  needs_confirm: string[];
};

export const DRAFT_TOOL = {
  name: "submit_draft",
  description: "Submit the finished draft. Every field is required except video_hook.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["title", "excerpt", "tags", "body_markdown", "facebook", "instagram_caption", "instagram_hashtags", "gbp_text", "gbp_cta", "needs_confirm"],
    properties: {
      title: { type: "string", description: "Article or post title, under 90 characters" },
      excerpt: { type: "string", description: "One or two plain sentences, under 280 characters" },
      tags: { type: "array", items: { type: "string", enum: [...JOURNAL_TAG_IDS] }, description: "1-3 lines this is about" },
      body_markdown: { type: "string", description: "The article in the simple markdown described, or an empty string when no article was asked for" },
      facebook: { type: "string" },
      instagram_caption: { type: "string" },
      instagram_hashtags: { type: "array", items: { type: "string" } },
      gbp_text: { type: "string" },
      gbp_cta: { type: "string", enum: GBP_CTAS },
      video_hook: { type: "string", description: "Video posts only: one line for the first three seconds" },
      needs_confirm: { type: "array", items: { type: "string" }, description: "Placeholders and any shop-specific claim a person must check" },
    },
  },
} as const;

/** One Messages API call forced through the submit_draft tool. Retries once on 429/5xx. */
export async function callWriter(opts: { model: string; user: string; maxTokens?: number }): Promise<{ draft: Draft; usage: { input: number; output: number } }> {
  const body = JSON.stringify({
    model: opts.model,
    max_tokens: opts.maxTokens ?? 4000,
    system: HOUSE_RULES,
    messages: [{ role: "user", content: opts.user }],
    tools: [DRAFT_TOOL],
    tool_choice: { type: "tool", name: DRAFT_TOOL.name },
  });
  for (let attempt = 0; ; attempt++) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey(), "anthropic-version": "2023-06-01" },
      body,
      signal: AbortSignal.timeout(120_000),
    });
    if (res.ok) {
      const j = (await res.json()) as { content: { type: string; input?: unknown }[]; usage?: { input_tokens?: number; output_tokens?: number } };
      const tool = j.content.find((c) => c.type === "tool_use");
      if (!tool?.input) throw new Error("The model returned no draft");
      return { draft: normalise(tool.input as Partial<Draft>), usage: { input: j.usage?.input_tokens ?? 0, output: j.usage?.output_tokens ?? 0 } };
    }
    const text = (await res.text()).slice(0, 300); // error bodies never contain the key
    if (attempt === 0 && (res.status === 429 || res.status >= 500)) {
      await new Promise((r) => setTimeout(r, 4000));
      continue;
    }
    throw new Error(`Anthropic API ${res.status}: ${text}`);
  }
}

function normalise(d: Partial<Draft>): Draft {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const arr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "").map((x) => x.trim()) : []);
  return {
    title: str(d.title),
    excerpt: str(d.excerpt),
    tags: arr(d.tags).filter((t) => JOURNAL_TAG_IDS.includes(t)),
    body_markdown: str(d.body_markdown),
    facebook: str(d.facebook),
    instagram_caption: str(d.instagram_caption),
    instagram_hashtags: arr(d.instagram_hashtags).map((h) => (h.startsWith("#") ? h : `#${h}`)),
    gbp_text: str(d.gbp_text),
    gbp_cta: GBP_CTAS.includes(d.gbp_cta as GbpCta) ? (d.gbp_cta as GbpCta) : "LEARN_MORE",
    video_hook: str(d.video_hook) || undefined,
    needs_confirm: arr(d.needs_confirm),
  };
}

// ---------- Checks that run on every draft ----------

/** Things that must not slip out unreviewed. Returned as notes the human sees first. */
export function lint(d: Draft): string[] {
  const all = [d.title, d.excerpt, d.body_markdown, d.facebook, d.instagram_caption, d.gbp_text, d.video_hook ?? ""].join("\n");
  const notes: string[] = [];
  for (const m of all.matchAll(/\[\[([^\]]+)\]\]/g)) notes.push(`Fill in: ${m[1].replace(/^ADD:\s*/i, "")}`);
  if (/\$\s?\d|\b\d+\s?(dollars|bucks)\b/i.test(all)) notes.push("Mentions a price. The shop does not post prices; remove or confirm.");
  if (/\b\d{1,2}\s?%\s?(off|discount)|\b(sale|discount|financing|free (install|delivery|shipping)|guarantee[ds]?|lifetime|warranty|warrant(y|ies))\b/i.test(all)) notes.push("Mentions a sale, financing, guarantee or warranty. Confirm it is true before approving.");
  if (/\b(certified|licensed|insured|bonded)\b/i.test(all)) notes.push("Uses certified / licensed / insured. Confirm it is accurate.");
  if (/—/.test(all)) notes.push("Contains an em dash; house style avoids them.");
  if (d.gbp_text.length > 1500) notes.push(`Google post is ${d.gbp_text.length} characters; the limit is 1500.`);
  if (/\+?\(?\d{3}\)?[ -.]?\d{3}[ -.]?\d{4}/.test(d.gbp_text)) notes.push("Google post contains a phone number; Google's post policy disallows it. Use the Call button.");
  if (d.instagram_caption.length > 2200) notes.push(`Instagram caption is ${d.instagram_caption.length} characters; the limit is 2200.`);
  if (/https?:\/\//i.test(d.instagram_caption)) notes.push("Instagram caption contains a link; links aren't clickable there.");
  if (!d.tags.length) notes.push("No line tags chosen.");
  return [...new Set([...d.needs_confirm, ...notes])];
}

// ---------- Markdown-lite -> Sanity portable text ----------

let k = 0;
const key = () => `g${Date.now().toString(36)}${(k++).toString(36)}`;

function spans(text: string): { _type: "span"; _key: string; text: string; marks: string[] }[] {
  const out: { _type: "span"; _key: string; text: string; marks: string[] }[] = [];
  const clean = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // drop links; add real ones in the Studio
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  for (const m of clean.matchAll(re)) {
    if (m.index! > last) out.push({ _type: "span", _key: key(), text: clean.slice(last, m.index), marks: [] });
    const strong = m[0].startsWith("**");
    out.push({ _type: "span", _key: key(), text: m[0].slice(strong ? 2 : 1, strong ? -2 : -1), marks: [strong ? "strong" : "em"] });
    last = m.index! + m[0].length;
  }
  if (last < clean.length) out.push({ _type: "span", _key: key(), text: clean.slice(last), marks: [] });
  return out.length ? out : [{ _type: "span", _key: key(), text: "", marks: [] }];
}

export function markdownToBlocks(md: string) {
  const blocks: Record<string, unknown>[] = [];
  for (const raw of md.split(/\n{2,}/)) {
    const lines = raw.split("\n").map((l) => l.trimEnd()).filter(Boolean);
    if (!lines.length) continue;
    if (lines.every((l) => /^(-|\*|\d+\.)\s+/.test(l))) {
      for (const l of lines) {
        blocks.push({ _type: "block", _key: key(), style: "normal", listItem: /^\d+\./.test(l) ? "number" : "bullet", level: 1, markDefs: [], children: spans(l.replace(/^(-|\*|\d+\.)\s+/, "")) });
      }
      continue;
    }
    const head = /^(#{2,3})\s+(.*)$/.exec(lines[0]);
    if (head) {
      blocks.push({ _type: "block", _key: key(), style: head[1].length === 2 ? "h2" : "h3", markDefs: [], children: spans(head[2]) });
      lines.shift();
      if (!lines.length) continue;
      blocks.push(...markdownToBlocks(lines.join("\n")));
      continue;
    }
    blocks.push({ _type: "block", _key: key(), style: "normal", markDefs: [], children: spans(lines.join(" ")) });
  }
  return blocks;
}

export const slugify = (t: string) =>
  t.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70).replace(/-+$/, "") || "post";

/** UTC offset of Pacific time on a calendar date, e.g. "-08:00" in winter, "-07:00" in summer. */
export function pacificOffset(isoDate: string): string {
  const part = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", timeZoneName: "longOffset" }).formatToParts(new Date(`${isoDate}T12:00:00Z`)).find((p) => p.type === "timeZoneName")?.value ?? "GMT-08:00";
  return part.replace("GMT", "") || "+00:00";
}

export type PostDoc = {
  _type: "post";
  title: string;
  slug: { _type: "slug"; current: string };
  tags: string[];
  season: JournalSeason;
  heroImage: string;
  heroAlt: string;
  excerpt: string;
  body: Record<string, unknown>[];
  social: {
    facebook: string;
    instagram: { caption: string; hashtags: string[] };
    gbp: { text: string; cta: GbpCta };
  };
  channels: string[];
  needsConfirm: string[];
  status: "draft";
  publishAt: string;
  _draftMeta: Record<string, unknown>;
};

/** Builds a Sanity-shaped post document (always status "draft"). `_draftMeta` is stripped on import. */
export function toPostDoc(d: Draft, ctx: { season: JournalSeason; publishAt: string; hero?: { id: string; alt: string }; meta: Record<string, unknown>; article: boolean; notes?: string[] }): PostDoc {
  const hero = ctx.hero ?? heroFor(d.tags as Line[], ctx.season);
  return {
    _type: "post",
    title: d.title,
    slug: { _type: "slug", current: slugify(d.title) },
    tags: d.tags,
    season: ctx.season,
    heroImage: hero.id,
    heroAlt: hero.alt,
    excerpt: d.excerpt,
    body: ctx.article ? markdownToBlocks(d.body_markdown) : [],
    social: {
      facebook: d.facebook,
      instagram: { caption: d.instagram_caption, hashtags: d.instagram_hashtags },
      gbp: { text: d.gbp_text, cta: d.gbp_cta },
    },
    channels: ["facebook", "instagram", "gbp"],
    needsConfirm: [...(ctx.notes ?? []), ...lint(d)],
    status: "draft",
    publishAt: ctx.publishAt,
    _draftMeta: ctx.meta,
  };
}

export function writeJson(path: string, value: unknown) {
  mkdirSync(path.slice(0, path.lastIndexOf("/")), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
}

export function previewMarkdown(doc: PostDoc, header: string): string {
  const needs = doc.needsConfirm.length ? doc.needsConfirm.map((n) => `- ${n}`).join("\n") : "- (none)";
  return `## ${header}: ${doc.title}\n\n**Check before approving**\n${needs}\n\n**Facebook**\n\n${doc.social.facebook}\n\n**Instagram**\n\n${doc.social.instagram.caption}\n\n${doc.social.instagram.hashtags.join(" ")}\n\n**Google (button: ${doc.social.gbp.cta})**\n\n${doc.social.gbp.text}\n\n---\n`;
}
