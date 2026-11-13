import type { Metadata } from "next";
import LinePage from "@/components/LinePage";
import { PHOTOS } from "@/lib/images";

export const metadata: Metadata = {
  title: "Hearth Products & Venting Supplies",
  description: "Mantels, screens, chimney venting and parts, stove paint, gaskets and cleaners in Wenatchee, with chimney system design from the Chim Chimney crew.",
};

export default function Page() {
  return (
    <LinePage
      interest="venting"
      path="/hearth-supplies"
      hero={{ kicker: "Fire · Hearth & venting supplies", title: <>The region&apos;s <em style={{ fontStyle: "italic", color: "var(--clay-soft)" }}>venting counter.</em></>, lead: "One of the largest selections of chimney venting and parts in the region, plus mantels, screens and the maintenance essentials that keep a fireplace looking and working right.", image: PHOTOS.mantelBrick, alt: "A white brick fireplace with a mantel", cta: "Get help with venting" }}
      points={{ kicker: "On the shelves", title: "Parts, finish and know-how.", lead: "Whether you're a homeowner or a contractor, come in with a question and leave with the right part.", items: [
        { title: "Chimney venting & parts", body: "Pipe, liners, caps and fittings, with help designing the system for your appliance." },
        { title: "Mantels & screens", body: "Non-combustible and handcrafted wood mantels, and decorative screens to finish the hearth." },
        { title: "Maintenance essentials", body: "High-temp stove paint, gaskets, glass cleaner and the accessories that keep a stove in shape." },
      ] }}
      feature={{ kicker: "System design", title: "We'll design the venting with you.", body: "Bring the appliance make and model and a photo of the space. We'll work out the flue, liner and clearances, and install it if you want.", bullets: ["Venting sized to the appliance", "Parts in stock", "Installation by our crew"], image: PHOTOS.chimneyBrick, alt: "A brick chimney among trees" }}
      closing={{ title: "Need a part or a plan?", body: "Call ahead with the make and model and we'll have answers ready.", cta: "Get help with venting" }}
    />
  );
}
