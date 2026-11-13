import Link from "next/link";
import Icon from "./Icon";
import PreOwnedAlertForm from "./PreOwnedAlertForm";
import PreOwnedBrowser from "./PreOwnedBrowser";
import PreOwnedSold from "./PreOwnedSold";
import { getPreOwnedSpas } from "@/lib/sanity";

/** The /pre-owned floor: filterable gallery, recently found homes, arrival alerts and the sell/trade-in prompt. */
export default async function PreOwnedGallery() {
  const spas = await getPreOwnedSpas();
  return (
    <>
      <section className="section-sm" id="floor" style={{ scrollMarginTop: "var(--nav-h)" }}>
        <div className="wrap">
          <span className="kicker">On the floor</span>
          <h2 className="h-xl" style={{ marginTop: 18 }}>What&apos;s here right now.</h2>
          <p className="body-muted" style={{ marginTop: 12, maxWidth: "56ch" }}>
            We don&apos;t post prices. Open any spa for photos and details, then call or send a note and we&apos;ll give you the number.
          </p>
          {spas.length === 0 ? (
            <div className="card" style={{ padding: 32, marginTop: 36, maxWidth: 640 }}>
              <p className="lead">Nothing on the floor this week. Trade-ins come through the shop often. Tell us what you&apos;re after and we&apos;ll let you know.</p>
              <a href="#alert" className="btn btn-primary" style={{ marginTop: 22 }}>
                Tell me when one arrives <Icon name="arrow" size={16} />
              </a>
            </div>
          ) : (
            <div style={{ marginTop: 28 }}>
              <PreOwnedBrowser spas={spas} />
            </div>
          )}
        </div>
      </section>

      <PreOwnedSold />

      <section className="section-sm bg-bone" id="alert" style={{ scrollMarginTop: "var(--nav-h)" }}>
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <span className="kicker">Don&apos;t see the right one?</span>
            <h2 className="h-lg" style={{ marginTop: 16 }}>Tell us what you&apos;re after.</h2>
            <p className="body-muted" style={{ marginTop: 12, maxWidth: "46ch" }}>
              Tubs come through the shop all the time and the good ones go quickly. Tell us the size you want and we&apos;ll reach out when one like it arrives.
            </p>
            <p className="body-muted" style={{ marginTop: 22, maxWidth: "46ch" }}>
              Got an old tub of your own?{" "}
              <Link href="/pre-owned/sell" style={{ color: "var(--clay)", fontWeight: 600 }}>Sell or trade it in</Link>.
            </p>
          </div>
          <div className="card" style={{ padding: "clamp(24px, 4vw, 40px)" }}>
            <PreOwnedAlertForm />
          </div>
        </div>
      </section>
    </>
  );
}
