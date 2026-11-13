import type { Metadata } from "next";
import LinePage from "@/components/LinePage";
import { PHOTOS } from "@/lib/images";

export const metadata: Metadata = {
  title: "Cal Saunas: Traditional & Infrared",
  description: "Cal Saunas traditional and infrared saunas in Wenatchee. See the woodwork in our showroom and plan placement, power and install with us.",
};

export default function Page() {
  return (
    <LinePage
      interest="sauna"
      path="/saunas"
      hero={{ kicker: "Saunas · Cal Saunas", title: <>Sweat it out. <em style={{ fontStyle: "italic", color: "var(--clay-soft)" }}>Every season.</em></>, lead: "Cal Saunas builds premium saunas with careful woodwork, in traditional and infrared models. Pair one with a hot tub or a cold plunge and you have the whole home-resort circuit.", image: PHOTOS.saunaDark, alt: "Sauna stones, a wooden bucket and benches in low light", cta: "Book a sauna consult" }}
      points={{ kicker: "Why a sauna", title: "Heat therapy, at home.", lead: "Recovery after a ski day, a warm-up before a cold soak, or twenty quiet minutes in January.", items: [
        { title: "Real woodwork", body: "Cal Saunas are built with attention to joinery and finish. Come feel the wood in the showroom." },
        { title: "Indoor or outdoor", body: "Models for a spare room, a basement or the backyard next to the hot tub." },
        { title: "Planned and installed", body: "We plan placement, power and ventilation, then install it right." },
      ] }}
      models={{ kicker: "Two ways to heat", title: "Traditional or infrared?", items: [
        { tag: "Steam and stones", name: "Traditional sauna", body: "A heater warms stones and air to classic sauna temperatures. Ladle water for a burst of steam.", bullets: ["High heat, classic feel", "Steam on demand", "Best for the full sauna ritual"] },
        { tag: "Gentle, direct heat", name: "Infrared sauna", body: "Infrared panels warm you directly at lower air temperatures, so sessions feel easier and heat-up is quick.", bullets: ["Lower air temperature", "Quick to warm up", "Easy fit for indoor spaces"] },
      ] }}
      feature={{ kicker: "The home-resort circuit", title: "Sauna, soak, repeat.", body: "Many of our customers put a sauna next to the hot tub. We'll help you lay out the whole backyard so it works in the snow.", bullets: ["Placement with the hot tub in mind", "Electrical planning", "Pads, paths and lighting through our outdoor projects team"], image: PHOTOS.saunaModern, alt: "A modern sauna with tiered wooden benches" }}
      magnet={{ title: "Traditional vs. infrared: the plain-English guide.", body: "What each feels like, what each needs for power and space, and how to choose." }}
      closing={{ title: "Come feel the heat.", body: "See the Cal Saunas woodwork in person and talk through where yours would go.", cta: "Book a sauna consult" }}
    />
  );
}
