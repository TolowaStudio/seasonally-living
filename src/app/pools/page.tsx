import type { Metadata } from "next";
import LinePage from "@/components/LinePage";
import { PHOTOS } from "@/lib/images";

export const metadata: Metadata = {
  title: "Pools: Spring 2027 Planning",
  description: "Plan an in-ground pool with Seasonally Living in Wenatchee. Design consults over the winter for spring 2027 builds.",
};

export default function Page() {
  return (
    <LinePage
      interest="pool"
      hero={{ kicker: "Pools · Spring 2027", title: <>Pools are projects, <em style={{ fontStyle: "italic", color: "var(--clay-soft)" }}>not products.</em></>, lead: "A pool is designed around your land, your budget and your summers. Winter is when the planning happens, so the build can start when the ground thaws.", image: PHOTOS.pool, alt: "Modern home with a pool at blue hour", cta: "Join the spring build list" }}
      points={{ kicker: "How a build works", title: "Plan in winter. Build in spring.", lead: "Spring 2027 build slots are limited. Getting on the list now holds your place in the design queue.", items: [
        { title: "Design consult", body: "We talk budget, site, timeline and how you'll use it, with the people who'll build it." },
        { title: "Plan and permit", body: "Layout, equipment and permits handled over the winter." },
        { title: "Build", body: "Construction runs spring into summer, with a clear schedule from day one." },
      ] }}
      feature={{ kicker: "Who it's for", title: "Built for valley summers.", body: "Most of our pool clients own their land, plan to build within the year and want one team from design to the first swim.", bullets: ["Own the site", "Building within 12 months", "Want one accountable team"], image: PHOTOS.poolNight, alt: "Pool lit at night" }}
      magnet={{ title: "Get the spring 2027 pool planning guide.", body: "Budget ranges, timelines, permits and the questions to ask any builder." }}
      closing={{ title: "Get on the spring build list.", body: "Tell us about the site and we'll set up a design consult as the season opens.", cta: "Join the spring build list" }}
    />
  );
}
