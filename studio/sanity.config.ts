import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

const SINGLETONS = [
  { id: "siteSettings", type: "siteSettings", title: "Site settings" },
  { id: "page-home", type: "homePageV2", title: "Home page" },
  { id: "page-fireplaces", type: "fireplacesPage", title: "Fireplaces (Stûv)" },
  { id: "page-service", type: "servicePage", title: "Venting & service" },
  { id: "page-about", type: "aboutPage", title: "Our story" },
];

// Paid-ad landing pages: one fixed document per campaign (the site reads "landingPage-<slug>").
const LANDING = [
  ["hot-tubs-wenatchee", "Hot tubs (Wenatchee)"],
  ["pre-owned-hot-tubs", "Pre-owned hot tubs"],
  ["gas-inserts-burn-ban", "Gas inserts (burn ban)"],
  ["stuv-wood-stoves", "Stûv wood stoves"],
  ["pool-planning-2027", "Pool planning 2027 (waitlist)"],
  ["swim-spas", "Swim spas"],
].map(([slug, title]) => ({ id: `landingPage-${slug}`, type: "landingPage", title }));

export default defineConfig({
  name: "seasonally-living",
  title: "Seasonally Living",
  projectId: "83r23z7t",
  dataset: "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            ...SINGLETONS.map((s) => S.listItem().title(s.title).id(s.id).child(S.document().schemaType(s.type).documentId(s.id))),
            S.divider(),
            S.listItem()
              .title("Campaign landing pages")
              .id("landing-pages")
              .child(S.list().title("Campaign landing pages (/lp/…)").items(LANDING.map((l) => S.listItem().title(l.title).id(l.id).child(S.document().schemaType(l.type).documentId(l.id))))),
            S.documentTypeListItem("linePage").title("Product line pages"),
            S.documentTypeListItem("hearthBrand").title("Hearth brands"),
            S.documentTypeListItem("preOwnedSpa").title("Pre-owned spas"),
            S.documentTypeListItem("simplePage").title("Visit & note pages"),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // Singletons can't be created again from the "new document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.some((s) => s.type === schemaType) && schemaType !== "landingPage"),
  },
});
