import type { Metadata } from "next";
import LinePage from "@/components/LinePage";
import { PHOTOS } from "@/lib/images";

export const metadata: Metadata = {
  title: "Gas & Electric Fireplaces",
  description: "Gas and electric fireplaces and inserts in Wenatchee: instant heat, no ash, and warmth on burn-ban days. Installed and vented by Seasonally Living.",
};

export default function Page() {
  return (
    <LinePage
      interest="hearth"
      path="/fireplaces/gas-electric"
      hero={{ kicker: "Fire · Gas & electric", title: <>Flame at the <em style={{ fontStyle: "italic", color: "var(--clay-soft)" }}>touch of a button.</em></>, lead: "Not every night is a wood night. Gas and electric fireplaces give you instant warmth with no ash, no wood storage and no worry when the valley calls a burn ban.", image: PHOTOS.gasLinear, alt: "A modern linear fireplace in a bright room with big windows", cta: "Book a fireplace consult" }}
      points={{ kicker: "Why gas or electric", title: "Warmth without the work.", lead: "The look of a real hearth, with heat that's ready the moment you want it.", items: [
        { title: "Instant heat", body: "Realistic flames and glowing embers at the touch of a button, with settings you control." },
        { title: "Clean and simple", body: "No ash, no wood to haul and stack. Zone heating where you actually spend your evenings." },
        { title: "Burn-ban friendly", body: "When air quality bans stop wood burning, gas and electric keep the room warm." },
      ] }}
      models={{ kicker: "Options", title: "Find your fit.", items: [
        { tag: "Gas", name: "Gas fireplaces", body: "Built-in fireplaces for a new wall, remodel or feature wall, with realistic flames and real heat." },
        { tag: "Gas", name: "Gas inserts", body: "Turn an old wood fireplace into a clean, efficient gas fire. We fit the insert and the venting." },
        { tag: "Electric", name: "Electric fireplaces", body: "Plug-in and built-in models, modern to traditional, with no venting needed. Heat and ambiance anywhere." },
      ] }}
      feature={{ kicker: "Installed by our crew", title: "Venting and gas lines done right.", body: "Gas fireplaces need proper venting and a clean install. That's been our trade since 1979.", bullets: ["Venting designed for the appliance", "Inserts fitted to existing masonry", "Mantels and surrounds from our hearth shop"], image: PHOTOS.electricMantel, alt: "A fireplace insert set in a white mantel" }}
      magnet={{ title: "Get the burn-ban-ready fireplace guide.", body: "Wood, gas or electric: what works on which days, and what it costs to run." }}
      closing={{ title: "See them burning.", body: "Compare gas, electric and Stûv wood side by side in the showroom.", cta: "Book a fireplace consult" }}
    />
  );
}
