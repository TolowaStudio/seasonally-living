import Image from "next/image";
import { getRecentlySold } from "@/lib/sanity";
import { monthYear, specLine } from "@/lib/pre-owned-ui";

/** "Recently found homes": sold spas as social proof. Renders nothing when there are none. */
export default async function PreOwnedSold() {
  const sold = await getRecentlySold();
  if (!sold.length) return null;
  return (
    <section className="section-sm bg-paper2" aria-labelledby="po-sold-h">
      <div className="wrap">
        <span className="kicker">Recently found homes</span>
        <h2 id="po-sold-h" className="h-lg" style={{ marginTop: 16 }}>These tubs didn&apos;t stay long.</h2>
        <div className="po-sold-row">
          {sold.map((s) => (
            <figure key={s.slug} className="po-sold-card">
              <div className="photo po-sold-photo">
                {s.photos?.[0] && <Image src={s.photos[0].image} alt={s.photos[0].alt || s.title} fill sizes="(max-width: 700px) 70vw, 260px" />}
                <span className="po-badge po-sold">Found a home</span>
              </div>
              <figcaption>
                <strong>{s.title}</strong>
                <span className="small body-muted">{[specLine(s), monthYear(s.soldDate)].filter(Boolean).join(" · ")}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
