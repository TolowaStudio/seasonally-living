import type { Metadata } from "next";
import LinePage from "@/components/LinePage";
import { PHOTOS } from "@/lib/images";

export const metadata: Metadata = {
  title: "Cal Spas Hot Tubs",
  description: "Try a Cal Spas hot tub in our Wenatchee showroom. Delivery, setup, orientation and service from Seasonally Living.",
};

export default function Page() {
  return (
    <LinePage
      interest="hot-tub"
      hero={{ kicker: "Hot tubs · Cal Spas", title: <>The winter soak, <em style={{ fontStyle: "italic", color: "var(--clay-soft)" }}>every night.</em></>, lead: "January in the valley is made for this. Sit in a running Cal Spas tub at the showroom before you decide, then let us deliver, set up and show you how to care for it.", image: PHOTOS.hotTubPeople, alt: "Two people in a steaming hot tub above a snowy forest", cta: "Book a try-out" }}
      points={{ kicker: "Why buy here", title: "The tub is half of it. The rest is us.", lead: "A hot tub is a ten-year decision. Buy it from people who'll still pick up the phone in year eight.", items: [
        { title: "Try before you buy", body: "Models filled and running in the showroom. Bring a swimsuit if you like." },
        { title: "Delivered and set up", body: "Site prep advice, delivery, placement and start-up by our crew." },
        { title: "Orientation for every buyer", body: "We walk you through water care, filters and settings so it stays easy." },
      ] }}
      feature={{ kicker: "Pre-owned", title: "Pre-owned, inspected and ready.", body: "Trade-ins come back through our shop. When a good one is ready, subscribers to the note hear about it first.", bullets: ["Inspected and repaired by our techs", "Cleaned and sanitized", "Delivered like a new tub"], image: PHOTOS.hotTubGarden, alt: "Hot tub on a wooden deck in a garden" }}
      magnet={{ title: "Get the winter hot tub care guide.", body: "Freeze protection, water care in the cold, and when to call us. Pick pre-owned too and you'll see arrivals first." }}
      closing={{ title: "Come sit in one.", body: "The fastest way to choose a tub is to try a few. Book a time and we'll have them warm.", cta: "Book a try-out" }}
    />
  );
}
