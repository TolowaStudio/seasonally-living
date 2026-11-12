import type { Metadata } from "next";
import LinePage from "@/components/LinePage";
import { PHOTOS } from "@/lib/images";

export const metadata: Metadata = {
  title: "Swim Spas",
  description: "Swim spas in Wenatchee: year-round swimming, exercise and hydrotherapy. Book a dry consult now; wet tests open in spring.",
};

export default function Page() {
  return (
    <LinePage
      interest="swim-spa"
      hero={{ kicker: "Swim spas", title: <>Swim all year. <em style={{ fontStyle: "italic", color: "var(--clay-soft)" }}>In the backyard.</em></>, lead: "A swim spa gives you a current to swim against, a place to train and a place to soak, at a fraction of a pool's cost and footprint.", image: PHOTOS.swimmer, alt: "A swimmer underwater", cta: "Book a swim spa consult" }}
      points={{ kicker: "Is it right for you?", title: "Pool fitness, hot tub warmth.", lead: "We'll help you size it, place it and plan the install before spring.", items: [
        { title: "Train in any weather", body: "Adjustable current for swimming, water walking and low-impact workouts." },
        { title: "Therapy built in", body: "Jets and warm water for recovery after Mission Ridge or a long day." },
        { title: "Fits where a pool won't", body: "A fraction of the space, the permit work and the upkeep of an in-ground pool." },
      ] }}
      feature={{ kicker: "How we sell swim spas", title: "Dry consult now. Wet test in spring.", body: "Over the winter we do dry consults: sizing, placement, electrical and delivery. Wet tests run April through September, and the waitlist opens in February.", bullets: ["Site and access check", "Electrical and base planning", "Spring wet-test waitlist"], image: PHOTOS.pool, alt: "Modern home with a lap pool at blue hour" }}
      magnet={{ title: "Swim spa vs. pool: the honest comparison.", body: "Cost, space, upkeep and what each is actually good for. No sales pitch." }}
      closing={{ title: "Plan it this winter, swim this spring.", body: "Book a dry consult and you'll be first on the wet-test list.", cta: "Book a swim spa consult" }}
    />
  );
}
