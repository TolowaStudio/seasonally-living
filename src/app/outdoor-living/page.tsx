import type { Metadata } from "next";
import LinePage from "@/components/LinePage";
import { PHOTOS } from "@/lib/images";

export const metadata: Metadata = {
  title: "Outdoor Kitchens & Backyard Projects",
  description: "Cal Flame outdoor kitchens and grill islands, concrete patios, hot tub pads and gazebos from Seasonally Living in Wenatchee.",
};

export default function Page() {
  return (
    <LinePage
      interest="outdoor"
      path="/outdoor-living"
      hero={{ kicker: "Outdoor living · Cal Flame", title: <>The backyard, <em style={{ fontStyle: "italic", color: "var(--clay-soft)" }}>finished.</em></>, lead: "Cal Flame outdoor kitchens and grill islands, plus the patios, pads and gazebos that pull the whole home resort together.", image: PHOTOS.outdoorKitchen, alt: "An outdoor kitchen island with bar stools", cta: "Plan a backyard project" }}
      points={{ kicker: "What we build", title: "Small to mid-sized projects, done right.", lead: "No oversized crews or big-contract pressure. Just the help you need to get the most out of your backyard.", items: [
        { title: "Outdoor kitchens", body: "Cal Flame barbecue islands, built-in grills and outdoor fireplaces, built to last outside." },
        { title: "Patios and pads", body: "Concrete patios and hot tub or swim spa pads, prepped properly before delivery day." },
        { title: "Gazebos and shelter", body: "Gazebos and covers so you use the tub, the sauna and the grill in any weather." },
      ] }}
      feature={{ kicker: "One team", title: "Plan it all together.", body: "Because we sell the tubs, saunas and fireplaces too, we can plan the whole backyard at once: power, paths, pads and where everything goes.", bullets: ["Layout and planning", "Hot tub, swim spa and sauna prep", "Grill islands and outdoor fireplaces"], image: PHOTOS.outdoorKitchenPool, alt: "Modern outdoor kitchen beside a pool" }}
      magnet={{ title: "Get the backyard project planner.", body: "A simple checklist for laying out a hot tub, sauna and outdoor kitchen that work together." }}
      closing={{ title: "Let's plan your backyard.", body: "Bring a photo or a rough sketch and we'll talk through what fits.", cta: "Plan a backyard project" }}
    />
  );
}
