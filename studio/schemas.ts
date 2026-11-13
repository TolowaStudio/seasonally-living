import { defineArrayMember, defineField, defineType } from "sanity";

// Mirrors src/content/types.ts. Images are Cloudinary public IDs in the tolowa-studio cloud.
const IMAGE_HELP =
  "Cloudinary public ID (cloud: tolowa-studio), e.g. seasonally-living/brand/calspas/swim-pro-garden. Upload to Cloudinary under seasonally-living/brand/ first.";

const str = (name: string, title?: string, opts: Record<string, unknown> = {}) => defineField({ name, title, type: "string", ...opts });
/** Required string. */
const req = (name: string, title?: string) => defineField({ name, title, type: "string", validation: (r) => r.required() });
const href = (name = "href", title = "Link (path like /hot-tubs)") =>
  defineField({ name, title, type: "string", validation: (r) => r.required().regex(/^(\/[a-z0-9/#?=&-]*|https:\/\/.+)$/i, { name: "path or https URL" }) });
const txt = (name: string, title?: string) => defineField({ name, title, type: "text", rows: 3 });
const img = (name = "image", title = "Image") =>
  defineField({ name, title, type: "string", description: IMAGE_HELP, validation: (r) => r.required().regex(/^[a-z0-9][a-z0-9/_-]*$/i, { name: "Cloudinary public ID" }) });
const strings = (name: string, title?: string) => defineField({ name, title, type: "array", of: [defineArrayMember({ type: "string" })] });
const obj = (name: string, title: string, fields: ReturnType<typeof defineField>[], opts: Record<string, unknown> = {}) =>
  defineField({ name, title, type: "object", fields, options: { collapsible: true, collapsed: true }, ...opts });
const list = (name: string, title: string, fields: ReturnType<typeof defineField>[], preview = "title") =>
  defineField({
    name,
    title,
    type: "array",
    of: [defineArrayMember({ type: "object", fields, preview: { select: { title: preview } } })],
  });

const richTitle = defineType({
  name: "richTitle",
  title: "Headline",
  type: "object",
  description: "Rendered as: before + *emphasis (italic, accent colour)* + after.",
  fields: [str("before"), str("emphasis"), str("after")],
});

const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [str("title", "Page title"), txt("description", "Meta description")],
});

const heroFields = [
  str("kicker"),
  defineField({ name: "title", type: "richTitle" }),
  txt("lead"),
  img(),
  str("alt", "Image description (alt text)"),
  str("position", "Image focus (CSS object-position, e.g. 'center 40%')"),
  str("cta", "Button label"),
];

const pageId = (readOnly = true) =>
  defineField({ name: "pageId", title: "Page path", type: "string", readOnly, description: "Route on the site, e.g. /hot-tubs" });

const itemFields = [req("title"), txt("body")];

export const schemaTypes = [
  richTitle,
  seo,
  defineType({
    name: "siteSettings",
    title: "Site settings",
    type: "document",
    fields: [
      str("name"),
      str("legalName", "Legal name"),
      txt("description", "Default meta description"),
      defineField({ name: "founded", type: "number" }),
      defineField({ name: "showroomOpened", title: "Showroom opened", type: "number" }),
      str("owners"),
      str("phoneDisplay", "Phone (display)"),
      str("phoneTel", "Phone (E.164, e.g. +15096678833)"),
      str("email"),
      obj("address", "Address", [str("line1"), str("city"), str("state"), str("zip"), str("note")]),
      list("hours", "Hours", [str("days"), str("time")], "days"),
      strings("serviceArea", "Service area"),
      img("logo", "Logo"),
      defineField({
        name: "navGroups",
        title: "Navigation groups (first group leads the menu)",
        type: "array",
        of: [
          defineArrayMember({
            type: "object",
            fields: [req("label"), href(), defineField({ ...list("items", "Links", [req("label"), href(), str("note")], "label"), validation: (r) => r.required().min(1) })],
            preview: { select: { title: "label" } },
          }),
        ],
      }),
      list("navLinks", "Top-level links", [req("label"), href()], "label"),
    ],
    preview: { prepare: () => ({ title: "Site settings" }) },
  }),
  defineType({
    name: "homePageV2",
    title: "Home page",
    type: "document",
    fields: [
      pageId(),
      defineField({ name: "seo", type: "seo" }),
      obj("hero", "Hero", [...heroFields, str("credential"), str("caption", "Photo caption"), str("secondaryCta", "Second button label"), href("secondaryHref", "Second button link")]),
      obj("lines", "Product lines", [str("kicker"), str("title"), txt("lead"), list("items", "Cards", [href(), str("kicker"), req("title"), txt("body"), img()])]),
      obj("stuv", "Stûv feature", [str("kicker"), str("title"), txt("body"), list("models", "Models", [str("name"), str("body")], "name"), img(), str("alt"), str("cta"), str("secondaryCta")]),
      obj("venting", "Venting band", [str("kicker"), str("title"), txt("body"), str("cta"), list("cards", "Cards", [str("icon"), str("title"), txt("body")])]),
      obj("seasons", "Four seasons", [str("kicker"), str("title"), str("credit", "Photo credit line"), list("items", "Seasons", [str("name"), str("lead"), txt("note"), str("image", "Image (Cloudinary public ID)"), str("alt", "Image description (alt text)")], "name")]),
      obj("showroom", "Showroom", [str("kicker"), str("title"), txt("body"), img(), str("alt"), str("cta")]),
    ],
    preview: { prepare: () => ({ title: "Home page" }) },
  }),
  defineType({
    name: "linePage",
    title: "Product line pages",
    type: "document",
    fields: [
      pageId(),
      defineField({ name: "seo", type: "seo" }),
      str("interest", "Lead-form interest tag", { readOnly: true }),
      obj("hero", "Hero", heroFields),
      obj("points", "Why / how (3 points)", [str("kicker"), str("title"), txt("lead"), list("items", "Points", itemFields)]),
      obj("models", "Models / options", [str("kicker"), str("title"), txt("lead"), list("items", "Models", [str("tag"), req("name"), txt("body"), strings("bullets")], "name")]),
      obj("feature", "Feature", [str("kicker"), str("title"), txt("body"), strings("bullets"), img(), str("alt")]),
      obj("magnet", "Lead magnet", [str("title"), txt("body")]),
      obj("closing", "Closing call to action", [str("title"), txt("body"), str("cta")]),
      list("quickLinks", "Quick links", [req("label"), href()], "label"),
    ],
    preview: { select: { title: "seo.title", subtitle: "pageId" } },
  }),
  defineType({
    name: "fireplacesPage",
    title: "Fireplaces hub page",
    type: "document",
    fields: [
      pageId(),
      defineField({ name: "seo", type: "seo" }),
      obj("hero", "Hero", [...heroFields, str("secondaryCta", "Second button label")]),
      obj("collection", "Collection by kind of fire", [str("kicker"), str("title"), txt("lead"), txt("note"), list("families", "Families", [str("kicker"), str("title"), txt("body"), strings("models")])]),
      obj("burnBan", "Burn-ban section", [str("kicker"), str("title"), txt("body"), strings("bullets"), img(), str("alt")]),
      obj("steps", "Steps", [str("kicker"), str("title"), list("items", "Steps", itemFields)]),
      obj("magnet", "Lead magnet", [str("title"), txt("body")]),
      obj("closing", "Closing call to action", [str("title"), txt("body"), str("cta")]),
    ],
    preview: { prepare: () => ({ title: "Fireplaces hub" }) },
  }),
  defineType({
    name: "servicePage",
    title: "Venting & service page",
    type: "document",
    fields: [
      pageId(),
      defineField({ name: "seo", type: "seo" }),
      obj("hero", "Hero", [...heroFields, str("secondaryCta", "Second button label")]),
      obj("services", "Services", [str("kicker"), str("title"), list("items", "Services", [str("icon"), str("title"), txt("body")])]),
      obj("closing", "Closing call to action", [str("title"), txt("body"), str("cta")]),
    ],
    preview: { prepare: () => ({ title: "Venting & service" }) },
  }),
  defineType({
    name: "aboutPage",
    title: "Our story page",
    type: "document",
    fields: [
      pageId(),
      defineField({ name: "seo", type: "seo" }),
      obj("hero", "Hero", heroFields),
      obj("owners", "Cam & Susan (owners)", [str("kicker"), str("title"), strings("paragraphs", "Paragraphs"), img(), str("alt"), str("caption")]),
      obj("timeline", "Timeline", [str("kicker"), str("title"), list("items", "Milestones", [str("year"), str("title"), txt("body")])]),
      obj("values", "Values", [str("kicker"), str("title"), txt("body"), strings("bullets"), img(), str("alt")]),
      obj("closing", "Closing", [str("title"), txt("body")]),
    ],
    preview: { prepare: () => ({ title: "Our story" }) },
  }),
  defineType({
    name: "simplePage",
    title: "Visit & note pages",
    type: "document",
    fields: [pageId(), defineField({ name: "seo", type: "seo" }), str("kicker"), str("title"), txt("lead"), img(), str("alt")],
    preview: { select: { title: "title", subtitle: "pageId" } },
  }),
  defineType({
    name: "preOwnedSpa",
    title: "Pre-owned spa",
    type: "document",
    fields: [
      defineField({ name: "title", type: "string", description: 'e.g. "2019 Cal Spas Escape"', validation: (r) => r.required() }),
      defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
      defineField({
        name: "status",
        type: "string",
        initialValue: "available",
        options: { list: [{ title: "Available", value: "available" }, { title: "Sale pending", value: "pending" }, { title: "Sold (hidden from the site)", value: "sold" }], layout: "radio" },
      }),
      str("brand"),
      str("model"),
      defineField({ name: "year", type: "number" }),
      defineField({ name: "seats", type: "number" }),
      str("size", "Size", { description: 'e.g. 84" x 84" x 36"' }),
      str("electrical", "Electrical", { description: "e.g. 240V / 50A" }),
      strings("highlights", "Highlights"),
      defineField({ name: "condition", title: "What our shop did", type: "text", rows: 4, description: "What the shop inspected, tested or replaced." }),
      defineField({
        name: "photos",
        type: "array",
        of: [defineArrayMember({ type: "object", fields: [img(), str("alt", "Image description (alt text)")], preview: { select: { title: "alt", subtitle: "image" } } })],
      }),
      defineField({ name: "featured", type: "boolean", initialValue: false, description: "Show first on the floor." }),
      defineField({ name: "sortOrder", type: "number", description: "Lower numbers show first." }),
    ],
    preview: { select: { title: "title", subtitle: "status" } },
  }),
];
