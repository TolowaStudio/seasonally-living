import { defineArrayMember, defineField, defineType } from "sanity";

// Journal post: one document feeds the site (/journal), Facebook, Instagram, Google Business Profile
// and (later) the monthly note. Mirrors src/content/journal.ts. Lifecycle:
//   draft -> approved (Cam or Kimberly) -> [scheduled if publishAt is in the future] -> published (set by n8n after posting).
// See automation/README.md. The dataset is PUBLIC: never put anything private in a post.

const TAGS = [
  { title: "Hot tubs", value: "hot-tub" },
  { title: "Swim spas", value: "swim-spa" },
  { title: "Swimming pools", value: "pool" },
  { title: "Pre-owned spas", value: "pre-owned" },
  { title: "Pool & spa care", value: "spa-care" },
  { title: "Fireplaces & stoves", value: "hearth" },
  { title: "Venting", value: "venting" },
  { title: "Around Wenatchee", value: "local" },
];

const GBP_CTAS = [
  { title: "Learn more", value: "LEARN_MORE" },
  { title: "Call now", value: "CALL" },
  { title: "Book", value: "BOOK" },
  { title: "Order online", value: "ORDER" },
  { title: "Shop", value: "SHOP" },
  { title: "Sign up", value: "SIGN_UP" },
];

const CLOUDINARY_ID = /^[a-z0-9][a-z0-9/_-]*$/i;
const LIVE = ["approved", "scheduled", "published"];

const resultUrl = (name: string, title: string) =>
  defineField({ name, title, type: "url", readOnly: true, validation: (r) => r.uri({ scheme: ["https"] }) });

export const postType = defineType({
  name: "post",
  title: "Journal post",
  type: "document",
  description: "Shows on /journal and, once approved, goes out to Facebook, Instagram and Google. Nothing leaves the shop until a person sets it to Approved.",
  groups: [
    { name: "article", title: "Article", default: true },
    { name: "social", title: "Social posts" },
    { name: "queue", title: "Approval & results" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "article", validation: (r) => r.required().max(110) }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "article",
      description: "The post lives at /journal/<this>. Changing it breaks old links and Facebook links.",
      options: { source: "title", maxLength: 80 },
      validation: (r) => r.required().custom((v) => (!v?.current || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v.current) ? true : "Lowercase letters, numbers and dashes only")),
    }),
    defineField({
      name: "tags",
      title: "Lines",
      type: "array",
      group: "article",
      of: [defineArrayMember({ type: "string" })],
      options: { list: TAGS },
      description: "Which part of the shop this is about. Used for the filters on /journal.",
    }),
    defineField({
      name: "season",
      type: "string",
      group: "article",
      options: { list: ["winter", "spring", "summer", "fall", "year-round"], layout: "radio" },
    }),
    defineField({
      name: "heroImage",
      title: "Hero image (Cloudinary public ID)",
      type: "string",
      group: "article",
      description: "Cloud tolowa-studio, e.g. seasonally-living/brand/local/green-valley. Facebook and Instagram use this photo too.",
      validation: (r) => r.required().regex(CLOUDINARY_ID, { name: "Cloudinary public ID" }),
    }),
    defineField({ name: "heroAlt", title: "Hero image description (alt text)", type: "string", group: "article", validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3, group: "article", description: "One or two plain sentences. Used on the index, in search results and in the feed.", validation: (r) => r.required().max(300) }),
    defineField({
      name: "body",
      type: "array",
      group: "article",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }, { title: "Heading", value: "h2" }, { title: "Subheading", value: "h3" }, { title: "Quote", value: "blockquote" }],
          lists: [{ title: "Bullet", value: "bullet" }, { title: "Numbered", value: "number" }],
          marks: {
            decorators: [{ title: "Bold", value: "strong" }, { title: "Italic", value: "em" }],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [defineField({ name: "href", type: "string", title: "Link (path like /hot-tubs, or https://)", validation: (r) => r.required().regex(/^(\/[a-z0-9/#?=&-]*|https:\/\/.+|tel:\+?[0-9]+)$/i, { name: "path or https URL" }) })],
              },
            ],
          },
        }),
      ],
    }),

    defineField({
      name: "social",
      title: "Social versions",
      type: "object",
      group: "social",
      description: "Edit these before approving. What is written here is exactly what gets posted.",
      fields: [
        defineField({ name: "facebook", title: "Facebook post", type: "text", rows: 6, description: "The link to the article is added after this text." }),
        defineField({
          name: "instagram",
          title: "Instagram",
          type: "object",
          fields: [
            defineField({ name: "caption", type: "text", rows: 6, validation: (r) => r.max(2000) }),
            defineField({ name: "hashtags", type: "array", of: [defineArrayMember({ type: "string" })], validation: (r) => r.max(10), description: "Keep to about six. Include the # sign." }),
          ],
        }),
        defineField({
          name: "gbp",
          title: "Google Business Profile",
          type: "object",
          fields: [
            defineField({ name: "text", type: "text", rows: 6, validation: (r) => r.max(1500) }),
            defineField({ name: "cta", title: "Button", type: "string", options: { list: GBP_CTAS }, initialValue: "LEARN_MORE" }),
          ],
        }),
      ],
    }),

    defineField({
      name: "channels",
      title: "Post to",
      type: "array",
      group: "queue",
      of: [defineArrayMember({ type: "string" })],
      options: { list: [{ title: "Facebook Page", value: "facebook" }, { title: "Instagram", value: "instagram" }, { title: "Google Business Profile", value: "gbp" }] },
      initialValue: ["facebook", "instagram", "gbp"],
    }),
    defineField({
      name: "needsConfirm",
      title: "Check with Cam or Susan first",
      type: "array",
      group: "queue",
      of: [defineArrayMember({ type: "string" })],
      description: "Facts the writer was not sure of. A post can't be approved until this list is empty.",
    }),
    defineField({
      name: "status",
      type: "string",
      group: "queue",
      initialValue: "draft",
      options: {
        list: [
          { title: "Draft (not approved)", value: "draft" },
          { title: "Approved (goes out at the next check)", value: "approved" },
          { title: "Scheduled (approved, waiting for the date)", value: "scheduled" },
          { title: "Published (posted everywhere)", value: "published" },
        ],
        layout: "radio",
      },
      validation: (r) =>
        r.custom((value, ctx) => {
          const open = (ctx.document?.needsConfirm as string[] | undefined)?.length ?? 0;
          return open > 0 && typeof value === "string" && LIVE.includes(value) ? "Resolve the “Check with Cam or Susan first” items before approving." : true;
        }),
    }),
    defineField({ name: "publishAt", title: "Publish at", type: "datetime", group: "queue", description: "Optional. Leave blank to post at the next check after approval. Pick a time for a scheduled post." }),
    defineField({ name: "approvedBy", title: "Approved by", type: "string", group: "queue", readOnly: true }),
    defineField({ name: "approvedAt", title: "Approved at", type: "datetime", group: "queue", readOnly: true }),
    defineField({
      name: "results",
      title: "Where it went (filled in automatically)",
      type: "object",
      group: "queue",
      options: { collapsible: true, collapsed: false },
      fields: [
        resultUrl("facebookUrl", "Facebook post"),
        resultUrl("instagramUrl", "Instagram post"),
        resultUrl("gbpUrl", "Google post"),
        defineField({ name: "postedAt", type: "datetime", readOnly: true }),
        defineField({ name: "lastError", title: "Last problem", type: "text", rows: 3, readOnly: true }),
      ],
    }),
  ],
  orderings: [
    { title: "Publish date, newest first", name: "publishAtDesc", by: [{ field: "publishAt", direction: "desc" }] },
    { title: "Status", name: "status", by: [{ field: "status", direction: "asc" }, { field: "publishAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", status: "status", publishAt: "publishAt" },
    prepare: ({ title, status, publishAt }: { title?: string; status?: string; publishAt?: string }) => ({
      title,
      subtitle: [status ?? "draft", publishAt ? publishAt.slice(0, 10) : null].filter(Boolean).join(" · "),
    }),
  },
});
