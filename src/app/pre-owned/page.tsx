import type { Metadata } from "next";
import LinePage from "@/components/LinePage";
import { PHOTOS } from "@/lib/images";

export const metadata: Metadata = {
  title: "Pre-owned Hot Tubs",
  description: "Pre-owned hot tubs in Wenatchee, inspected and repaired by the Seasonally Living shop. Get on the list to see arrivals first.",
};

export default function Page() {
  return (
    <LinePage
      interest="pre-owned"
      path="/pre-owned"
      hero={{ kicker: "Pre-owned spas", title: <>A great tub, <em style={{ fontStyle: "italic", color: "var(--clay-soft)" }}>for less.</em></>, lead: "Trade-ins come back through our own shop. When one is ready, it's inspected, repaired and cleaned before it goes back on the floor.", image: PHOTOS.hotTubDeck, alt: "An acrylic hot tub on a deck by the water", cta: "Ask about pre-owned" }}
      points={{ kicker: "How it works", title: "From trade-in to your backyard.", lead: "Pre-owned units move fast, especially in winter. The list is the best way to see them first.", items: [
        { title: "Inspected", body: "Our techs check pumps, heater, controls, jets and shell before anything is listed." },
        { title: "Repaired and cleaned", body: "Worn parts replaced, lines flushed and the tub cleaned and sanitized." },
        { title: "Delivered", body: "We deliver and set it up the same way we do a new tub." },
      ] }}
      feature={{ kicker: "Trading up?", title: "Your old tub is worth something.", body: "If your tub is getting older, ask about trading it in toward a new Cal Spas tub or a pre-owned unit. We'll take a look and give you a straight number.", bullets: ["Trade-in toward new or pre-owned", "We haul the old one away", "Straight answers on repair vs. replace"], image: PHOTOS.hotTubGarden, alt: "Hot tub on a wooden deck in a garden" }}
      magnet={{ title: "See pre-owned arrivals first.", body: "Subscribers to the note hear about pre-owned tubs before they're posted anywhere else." }}
      closing={{ title: "Ask what's in the shop.", body: "Inventory changes week to week. Tell us what you're after and we'll tell you what's coming.", cta: "Ask about pre-owned" }}
    />
  );
}
