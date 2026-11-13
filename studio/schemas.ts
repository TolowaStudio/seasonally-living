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

/** Optional Cloudinary image: blank is fine, but a value must look like a public ID. */
const optImg = (name = "image", title = "Image") =>
  defineField({ name, title, type: "string", description: IMAGE_HELP, validation: (r) => r.regex(/^[a-z0-9][a-z0-9/_-]*$/i, { name: "Cloudinary public ID" }) });
const url = (name: string, title: string) => defineField({ name, title, type: "url", validation: (r) => r.uri({ scheme: ["https"] }) });

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
    name: "landingPage",
    title: "Campaign landing pages",
    type: "document",
    description: "Paid-ad landing pages at /lp/<slug>. Never indexed. Document id must be landingPage-<slug>.",
    fields: [
      defineField({ name: "slug", title: "Campaign slug", type: "string", readOnly: true, description: "Route: /lp/<slug>" }),
      defineField({ name: "seo", type: "seo" }),
      str("interest", "Lead-form interest tag", { readOnly: true }),
      obj("hero", "Hero", heroFields),
      obj("points", "Three points", [str("title"), list("items", "Points", itemFields)]),
      obj("feature", "Photo feature", [str("kicker"), str("title"), txt("body"), strings("bullets"), img(), str("alt")]),
      obj("form", "Form heading", [str("title"), txt("lead")]),
    ],
    preview: { select: { title: "seo.title", subtitle: "slug" } },
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
    groups: [
      { name: "listing", title: "Listing (public)", default: true },
      { name: "intake", title: "Intake (staff only)" },
    ],
    fields: [
      defineField({ name: "title", group: "listing", type: "string", description: 'e.g. "2019 Cal Spas Escape"', validation: (r) => r.required() }),
      defineField({ name: "slug", group: "listing", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() }),
      defineField({
        name: "status",
        title: "Stage",
        group: "listing",
        type: "string",
        initialValue: "intake",
        description: "Only Listed, Reserved and Sold ever appear on the site. Sold shows in the Recently found homes strip (needs a sold date and a photo).",
        options: {
          list: [
            { title: "1. Intake (not on the site)", value: "intake" },
            { title: "2. Reconditioning (not on the site)", value: "reconditioning" },
            { title: "3. Listed (on the floor)", value: "listed" },
            { title: "4. Reserved (shown as Reserved)", value: "reserved" },
            { title: "5. Sold (Recently found homes)", value: "sold" },
          ],
          layout: "radio",
        },
        validation: (r) =>
          r.required().custom((v, ctx) => {
            const photos = (ctx.document as { photos?: unknown[] } | undefined)?.photos;
            if ((v === "listed" || v === "reserved") && !photos?.length) return "Add at least one photo before listing this spa.";
            return true;
          }),
      }),
      defineField({ ...str("brand"), group: "listing" }),
      defineField({ ...str("model"), group: "listing" }),
      defineField({ name: "year", group: "listing", type: "number" }),
      defineField({ name: "seats", group: "listing", type: "number" }),
      defineField({ ...str("size", "Size", { description: 'e.g. 84" x 84" x 36"' }), group: "listing" }),
      defineField({ ...str("electrical", "Electrical", { description: "e.g. 240V / 50A" }), group: "listing" }),
      defineField({
        name: "features",
        title: "Features (used by the gallery filter)",
        group: "listing",
        type: "array",
        of: [defineArrayMember({ type: "string" })],
        // Keep in sync with SPA_FEATURES in src/content/pre-owned-checklist.ts.
        options: { list: ["Lounger seat", "LED lighting", "Waterfall", "Bluetooth audio", "Cover included", "Swim / exercise"].map((v) => ({ title: v, value: v })) },
      }),
      defineField({ ...strings("highlights", "Highlights"), group: "listing", description: "Free-text bullets shown on the page." }),
      defineField({ name: "condition", group: "listing", title: "What our shop did", type: "text", rows: 4, description: "What the shop inspected, tested or replaced." }),
      defineField({
        name: "warranty",
        title: "Warranty terms for this spa",
        group: "listing",
        type: "text",
        rows: 3,
        description: "Write the exact terms (length, what is covered). Leave blank unless the terms are confirmed; the page then just says to ask us.",
      }),
      defineField({ name: "listedDate", title: "Listed date", group: "listing", type: "date", description: 'Set when it goes on the floor. Spas listed in the last few weeks get a "Just arrived" badge.' }),
      defineField({ name: "soldDate", title: "Sold date", group: "listing", type: "date", description: "Set when sold. Drives the Recently found homes strip." }),
      defineField({
        name: "photos",
        group: "listing",
        type: "array",
        of: [defineArrayMember({ type: "object", fields: [img(), str("alt", "Image description (alt text)")], preview: { select: { title: "alt", subtitle: "image" } } })],
      }),
      defineField({ name: "featured", group: "listing", type: "boolean", initialValue: false, description: "Show first on the floor." }),
      defineField({ name: "sortOrder", group: "listing", type: "number", description: "Lower numbers show first." }),

      // ---- Intake: INTERNAL. The site's queries never select these fields. ----
      // WARNING: the production dataset is public, so anyone can read these through the Sanity API.
      // Keep real costs out until the dataset is private (or intake moves to a private dataset).
      // Never enter customer names, phone numbers or addresses here.
      defineField({
        name: "source",
        title: "Where it came from",
        group: "intake",
        type: "string",
        options: { list: [{ title: "Free pickup", value: "free-pickup" }, { title: "Trade-in", value: "trade-in" }, { title: "Purchased", value: "purchased" }], layout: "radio" },
      }),
      defineField({ name: "receivedDate", title: "Date received", group: "intake", type: "date" }),
      defineField({ name: "acquisitionCost", title: "Acquisition cost ($)", group: "intake", type: "number", description: "0 for a free pickup.", validation: (r) => r.min(0) }),
      defineField({ name: "reconCost", title: "Reconditioning cost so far ($)", group: "intake", type: "number", validation: (r) => r.min(0) }),
      defineField({
        name: "reconChecklist",
        title: "Certified checklist (tick only what was actually done)",
        group: "intake",
        type: "object",
        description: "Ticked items show on the public page as the shop checklist. Do not tick anything that was not done on this unit.",
        // Keys match RECON_CHECKLIST in src/content/pre-owned-checklist.ts.
        fields: [
          defineField({ name: "inspected", title: "Full inspection by our shop techs", type: "boolean", initialValue: false }),
          defineField({ name: "plumbing", title: "Plumbing checked for leaks", type: "boolean", initialValue: false }),
          defineField({ name: "equipment", title: "Pumps, heater and controls tested", type: "boolean", initialValue: false }),
          defineField({ name: "filters", title: "Filters cleaned or replaced", type: "boolean", initialValue: false }),
          defineField({ name: "cabinet", title: "Shell and cabinet cleaned", type: "boolean", initialValue: false }),
          defineField({ name: "sanitized", title: "Sanitized and filled for a test run", type: "boolean", initialValue: false }),
          defineField({ name: "cover", title: "Cover checked", type: "boolean", initialValue: false }),
        ],
      }),
      defineField({ name: "intakeNotes", title: "Internal notes", group: "intake", type: "text", rows: 4, description: "Repairs needed, parts ordered, quirks. Not shown on the site." }),
    ],
    orderings: [
      { title: "Newest first", name: "newest", by: [{ field: "_createdAt", direction: "desc" }] },
      { title: "Listed date", name: "listed", by: [{ field: "listedDate", direction: "desc" }] },
    ],
    preview: {
      select: { title: "title", status: "status", seats: "seats", media: "photos.0.image" },
      prepare: ({ title, status, seats, media }: { title?: string; status?: string; seats?: number; media?: unknown }) => ({
        title,
        media: media as never,
        subtitle: [status, seats ? `${seats} seats` : null].filter(Boolean).join(" · "),
      }),
    },
  }),
  defineType({
    name: "hearthBrand",
    title: "Hearth brand",
    type: "document",
    description: "One page per maker at /fireplaces/<slug>. Deleting a brand removes its page.",
    groups: [
      { name: "range", title: "Models", default: true },
      { name: "page", title: "Page" },
    ],
    fields: [
      defineField({ name: "name", title: "Brand name", type: "string", group: "page", description: 'As shown, e.g. "Stûv"', validation: (r) => r.required() }),
      defineField({
        name: "slug",
        title: "Web address",
        type: "slug",
        group: "page",
        description: "The page lives at /fireplaces/<this>. Changing it breaks old links.",
        options: { source: "name", maxLength: 40 },
        validation: (r) =>
          r.required().custom((v) =>
            !v?.current || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v.current)
              ? v?.current === "gas-electric"
                ? "gas-electric is taken by the gas & electric page"
                : true
              : "Lowercase letters, numbers and dashes only, e.g. stuv",
          ),
      }),
      defineField({ name: "sortOrder", title: "Sort order", type: "number", group: "page", description: "Lower numbers show first on the fireplaces page." }),
      defineField({ ...str("origin", "Made in", { description: 'e.g. "Belgium"' }), group: "page" }),
      defineField({ ...strings("categories", "What they make"), group: "page", description: 'e.g. "Wood stoves", "Gas inserts"' }),
      defineField({ name: "tagline", title: "Headline", type: "richTitle", group: "page" }),
      defineField({ ...txt("summary", "Summary"), group: "page" }),
      defineField({ ...img("heroImage", "Hero image"), group: "page" }),
      defineField({ ...str("heroAlt", "Hero image description (alt text)"), group: "page" }),
      defineField({ ...str("heroPosition", "Hero image focus (CSS object-position, e.g. 'center 40%')"), group: "page" }),
      defineField({ ...list("points", "Three reasons (cards under the hero)", itemFields), group: "page" }),
      defineField({
        name: "sections",
        title: "Product families",
        type: "array",
        group: "range",
        of: [
          defineArrayMember({
            type: "object",
            name: "brandSection",
            fields: [
              req("name", "Family name"),
              txt("summary", "Summary"),
              optImg(),
              str("alt", "Image description (alt text)"),
              defineField({
                name: "models",
                title: "Models",
                type: "array",
                of: [
                  defineArrayMember({
                    type: "object",
                    name: "brandModel",
                    fields: [
                      req("name", "Model name"),
                      defineField({
                        name: "inShowroom",
                        title: "In our showroom",
                        type: "boolean",
                        initialValue: false,
                        description: 'Shows an "In our showroom" badge on the photo. Turn off when it leaves the floor.',
                      }),
                      str("type", "Kind", { description: 'e.g. "Wood stove", "Gas insert"' }),
                      txt("description", "Description"),
                      strings("facts", "Key facts"),
                      optImg(),
                      str("alt", "Image description (alt text)"),
                      url("url", "Maker's product page"),
                    ],
                    preview: {
                      select: { title: "name", type: "type", inShowroom: "inShowroom" },
                      prepare: ({ title, type, inShowroom }: { title?: string; type?: string; inShowroom?: boolean }) => ({
                        title,
                        subtitle: [inShowroom ? "In our showroom" : null, type].filter(Boolean).join(" · "),
                      }),
                    },
                  }),
                ],
              }),
            ],
            preview: { select: { title: "name", subtitle: "summary" } },
          }),
        ],
      }),
      defineField({ ...url("makerUrl", "Maker's website"), group: "page" }),
      defineField({ ...str("sourceNote", "Image credit line"), group: "page", description: 'e.g. "Product images and specifications courtesy of Napoleon."' }),
    ],
    orderings: [{ title: "Sort order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] }],
    preview: { select: { title: "name", subtitle: "origin" } },
  }),
];
