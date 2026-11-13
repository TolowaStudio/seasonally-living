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
            S.documentTypeListItem("linePage").title("Product line pages"),
            S.documentTypeListItem("simplePage").title("Visit & note pages"),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // Singletons can't be created again from the "new document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.some((s) => s.type === schemaType)),
  },
});
