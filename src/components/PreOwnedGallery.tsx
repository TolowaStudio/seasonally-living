import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";
import { getPreOwnedSpas } from "@/lib/sanity";
import type { PreOwnedSpa } from "@/content/types";

export function statusLabel(s: PreOwnedSpa["status"]) {
  return s === "pending" ? "Sale pending" : "Available";
}

export function specLine(s: PreOwnedSpa) {
  return [s.seats ? `${s.seats} seats` : "", s.year ? String(s.year) : "", s.size ?? ""].filter(Boolean).join(" · ");
}

/** "On the floor" grid of pre-owned spas. Rendered after the /pre-owned hero. */
export default async function PreOwnedGallery() {
  const spas = await getPreOwnedSpas();
  return (
    <section className="section-sm" id="floor" style={{ scrollMarginTop: "var(--nav-h)" }}>
      <div className="wrap">
        <span className="kicker">On the floor</span>
        <h2 className="h-xl" style={{ marginTop: 18 }}>What&apos;s here right now.</h2>
        {spas.length === 0 ? (
          <div className="card" style={{ padding: 32, marginTop: 36, maxWidth: 640 }}>
            <p className="lead">Nothing on the floor this week. Trade-ins come through the shop often. Get on the list and you&apos;ll hear first.</p>
            <Link href="/note?interest=pre-owned" className="btn btn-primary" style={{ marginTop: 22 }}>
              Get on the list <Icon name="arrow" size={16} />
            </Link>
          </div>
        ) : (
          <div className="po-grid">
            {spas.map((s) => {
              const photo = s.photos?.[0];
              return (
                <Link key={s.slug} href={`/pre-owned/${s.slug}`} className="card hoverable po-card">
                  <div className="photo po-photo">
                    {photo && <Image src={photo.image} alt={photo.alt || s.title} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />}
                    <span className={`po-badge po-${s.status}`}>{statusLabel(s.status)}</span>
                  </div>
                  <div className="po-body">
                    <h3 className="h-md" style={{ fontSize: 22 }}>{s.title}</h3>
                    <p className="body-muted small" style={{ marginTop: 6 }}>{specLine(s)}</p>
                    <span className="po-cta">Ask for price <Icon name="arrow" size={16} /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
