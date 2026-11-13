import type { Metadata } from "next";
import LinePage from "@/components/LinePage";
import { PHOTOS } from "@/lib/images";

export const metadata: Metadata = {
  title: "Pool & Spa Care",
  description: "Pool and spa water care, filters, cover lifters, steps and handrails at the Seasonally Living showroom in Wenatchee, plus hot tub service.",
};

export default function Page() {
  return (
    <LinePage
      interest="hot-tub"
      path="/spa-care"
      hero={{ kicker: "Pool & spa care", title: <>Clear water, <em style={{ fontStyle: "italic", color: "var(--clay-soft)" }}>all season.</em></>, lead: "Water treatment, filters and the accessories that make a tub easier to live with, plus people who can answer your questions.", image: PHOTOS.water, alt: "Sunlight on clear rippling water", cta: "Ask a water question" }}
      points={{ kicker: "In the showroom", title: "Everything your tub needs.", lead: "Stop by for supplies, or bring your questions about cloudy water, foam or a filter that won't stay clean.", items: [
        { title: "Water treatment", body: "Sanitizers, balancers and clarifiers to keep pool and spa water clear and balanced." },
        { title: "Filters", body: "Replacement filters for the tubs we sell and many we don't." },
        { title: "Accessories", body: "Entry steps, cover lifters, handrails and more to make the tub easier to use every day." },
      ] }}
      feature={{ kicker: "Need a hand?", title: "Service from the people who installed it.", body: "Start-ups, repairs, winterizing and seasonal open and close for second homes around Chelan and Leavenworth.", bullets: ["Hot tub start-ups and repairs", "Winterizing", "Seasonal open & close"], image: PHOTOS.hotTubSnow, alt: "A hot tub in a snowy forest" }}
      magnet={{ title: "Get the winter hot tub care guide.", body: "Freeze protection, water care in the cold and when to call us." }}
      closing={{ title: "Questions about your water?", body: "Call or stop in. We'll help you sort it out.", cta: "Ask a water question" }}
    />
  );
}
