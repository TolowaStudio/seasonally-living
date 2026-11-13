import type { Metadata } from "next";
import LinePage from "@/components/LinePage";
import { PHOTOS } from "@/lib/images";

export const metadata: Metadata = {
  title: "For Builders & Remodelers",
  description: "Fireplaces, venting, hot tubs and saunas for builders, remodelers and property managers in North Central Washington. One local supplier and install crew.",
};

export default function Page() {
  return (
    <LinePage
      interest="builder"
      path="/builders"
      hero={{ kicker: "For builders & remodelers", title: <>One call for the <em style={{ fontStyle: "italic", color: "var(--clay-soft)" }}>hearth and the backyard.</em></>, lead: "Spec the fireplace, the venting and the hot tub with one local team that supplies, installs and services it, from Wenatchee to Chelan and Leavenworth.", image: PHOTOS.framing, alt: "A builder working on a house frame", cta: "Talk trade with us", position: "center 30%" }}
      points={{ kicker: "Why builders use us", title: "Less coordination, fewer callbacks.", lead: "We've been installing fireplaces and venting in this valley since 1979.", items: [
        { title: "Supply and install", body: "Fireplaces, inserts, Stûv stoves and the venting, installed by our crew on your schedule." },
        { title: "Parts on the shelf", body: "One of the largest chimney venting selections in the region, so jobs don't wait on parts." },
        { title: "Backyard packages", body: "Hot tubs, swim spas, saunas and Cal Flame outdoor kitchens for spec homes and rentals." },
      ] }}
      feature={{ kicker: "Trade program", title: "A dedicated contact for your projects.", body: "Tell us about your builds and we'll set you up with a contact, our trade terms, and a quarterly update on new products.", bullets: ["Ask about trade terms", "Project scheduling with our install crew", "Showroom visits with your clients"], image: PHOTOS.framingInterior, alt: "Interior wood framing of a house under construction" }}
      magnet={{ title: "Get the quarterly builder update.", body: "New products, lead times and what's working on jobs around the valley. Four emails a year." }}
      closing={{ title: "Let's talk about your next build.", body: "Bring your plans by the showroom or give us a call.", cta: "Talk trade with us" }}
    />
  );
}
