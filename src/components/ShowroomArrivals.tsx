import Image from "next/image";
import Link from "next/link";
import { getPreOwnedSpas } from "@/lib/sanity";

/** Pre-owned arrivals strip. Real listings only; with none posted it says so plainly and points to the list. Prices are never shown. */
export default async function ShowroomArrivals({ title = "Just arrived", lead = "Trade-ins, inspected and repaired in our own shop. Call for price." }: { title?: string; lead?: string }) {
  const spas = (await getPreOwnedSpas()).slice(0, 4);
  return (
    <section className="section" aria-labelledby="arrivals-h">
      <div className="wrap">
        <div className="sh-head">
          <div>
            <span className="kicker">Pre-owned</span>
            <h2 id="arrivals-h" className="h-xl" style={{ marginTop: 18 }}>{title}</h2>
            <p className="lead" style={{ marginTop: 16 }}>{lead}</p>
          </div>
          <Link href="/pre-owned" className="btn btn-outline">See every pre-owned spa</Link>
        </div>
        {spas.length > 0 ? (
          <ul className="sh-strip" tabIndex={0} aria-label="Pre-owned arrivals">
            {spas.map((s) => (
              <li key={s.slug}>
                <Link href={`/pre-owned/${s.slug}`} className="sh-spa" style={{ display: "block" }}>
                  <div className="sh-spa-ph">{s.photos?.[0] && <Image src={s.photos[0].image} alt={s.photos[0].alt || s.title} fill sizes="(max-width: 620px) 74vw, (max-width: 1000px) 50vw, 25vw" />}</div>
                  <p className="sh-spa-t">{s.title}</p>
                  <p className="sh-spa-s">{[s.seats && `${s.seats} seats`, "Call for price"].filter(Boolean).join(" · ")}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="sh-split" style={{ border: "1px solid var(--line-strong)" }}>
            <div>
              <h3 className="h-md">Spas are posted the day they clear inspection.</h3>
              <p className="body-muted" style={{ marginTop: 12, maxWidth: "46ch" }}>Pre-owned tubs move fast, especially in winter. Join the note and you&apos;ll see new arrivals before they&apos;re posted anywhere else.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, alignItems: "flex-start" }}>
              <Link href="/note" className="btn btn-primary">Get the note</Link>
              <Link href="/pre-owned" className="btn btn-outline">Ask what&apos;s in the shop</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
