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

// Staff pipeline for pre-owned spas: intake -> reconditioning -> listed -> reserved -> sold.
const PRE_OWNED_STAGES = [
  { value: "intake", title: "1. Intake" },
  { value: "reconditioning", title: "2. Reconditioning" },
  { value: "listed", title: "3. Listed" },
  { value: "reserved", title: "4. Reserved" },
  { value: "sold", title: "5. Sold" },
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
            S.documentTypeListItem("hearthBrand").title("Hearth brands"),
            S.listItem()
              .title("Pre-owned spas")
              .id("preOwnedSpas")
              .child(
                S.list()
                  .title("Pre-owned spas")
                  .items([
                    ...PRE_OWNED_STAGES.map((st) =>
                      S.listItem()
                        .title(st.title)
                        .id("preOwned-" + st.value)
                        .child(S.documentList().title(st.title).schemaType("preOwnedSpa").filter('_type == "preOwnedSpa" && status == $status').params({ status: st.value })),
                    ),
                    S.divider(),
                    S.documentTypeListItem("preOwnedSpa").title("All pre-owned spas"),
                  ]),
              ),
            S.documentTypeListItem("simplePage").title("Visit & note pages"),
            S.divider(),
            S.documentTypeListItem("post").title("Journal & social posts"),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // Singletons can't be created again from the "new document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.some((s) => s.type === schemaType)),
  },
});
