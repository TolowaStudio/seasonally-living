import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import LeadForm from "@/components/LeadForm";
import PreOwnedAlertForm from "@/components/PreOwnedAlertForm";
import PreOwnedPhotos from "@/components/PreOwnedPhotos";
import ShareLinks from "@/components/ShareLinks";
import { CLOUDINARY_BASE } from "@/lib/cloudinary-loader";
import { seatBandOf, specLine, statusLabel } from "@/lib/pre-owned-ui";
import { getPreOwnedSpa, getSettings } from "@/lib/sanity";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

const imageUrl = (id: string) => `${CLOUDINARY_BASE}/f_auto,q_auto,c_limit,w_1200/${id}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const spa = await getPreOwnedSpa(slug);
  if (!spa) return { title: "Pre-owned spa" };
  const description = `${spa.title}${spa.seats ? `, ${spa.seats}-seat` : ""} pre-owned hot tub from the Seasonally Living shop in Wenatchee. Call for price.`;
  const photo = spa.photos?.[0];
  return {
    title: spa.title,
    description,
    alternates: { canonical: `/pre-owned/${spa.slug}` },
    openGraph: { title: spa.title, description, type: "website", url: `/pre-owned/${spa.slug}`, images: photo ? [{ url: imageUrl(photo.image), alt: photo.alt || spa.title }] : undefined },
  };
}

export default async function PreOwnedSpaPage({ params }: Props) {
  const { slug } = await params;
  const [spa, settings] = await Promise.all([getPreOwnedSpa(slug), getSettings()]);
  if (!spa) notFound();

  const base = getSiteUrl();
  const pageUrl = `${base}/pre-owned/${spa.slug}`;
  const reserved = spa.status === "reserved";

  const specs: [string, string | number | undefined][] = [
    ["Brand", spa.brand],
    ["Model", spa.model],
    ["Year", spa.year],
    ["Seats", spa.seats],
    ["Size", spa.size],
    ["Electrical", spa.electrical],
    ["Features", spa.features?.join(", ")],
  ];

  // Product + Offer without a price (prices are "Call for price"). itemCondition is used; no review or rating is invented.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: spa.title,
        url: pageUrl,
        ...(spa.photos?.length ? { image: spa.photos.map((p) => imageUrl(p.image)) } : {}),
        ...(spa.brand ? { brand: { "@type": "Brand", name: spa.brand } } : {}),
        ...(spa.model ? { model: spa.model } : {}),
        ...(spa.year ? { productionDate: String(spa.year) } : {}),
        category: "Hot tubs and spas",
        description: [specLine(spa), spa.condition].filter(Boolean).join(". ").slice(0, 500) || spa.title,
        offers: {
          "@type": "Offer",
          url: pageUrl,
          itemCondition: "https://schema.org/UsedCondition",
          availability: reserved ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
          seller: { "@type": "LocalBusiness", name: settings.legalName, telephone: settings.phoneTel, url: base },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Pre-owned spas", item: `${base}/pre-owned` },
          { "@type": "ListItem", position: 2, name: spa.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="section-sm">
        <div className="wrap">
          <Link href="/pre-owned#floor" className="small body-muted">&larr; Back to the floor</Link>
          <div className="po-detail">
            <PreOwnedPhotos photos={spa.photos ?? []} title={spa.title} />
            <div className="po-detail-info">
              <span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {spa.justArrived && <span className="po-badge po-new po-badge-inline">Just arrived</span>}
                <span className={`po-badge po-${spa.status} po-badge-inline`}>{statusLabel(spa.status)}</span>
              </span>
              <h1 className="h-xl" style={{ marginTop: 16 }}>{spa.title}</h1>
              <p className="po-facts">
                {[spa.seats ? `${spa.seats} seats` : "", spa.year ? String(spa.year) : "", spa.size ?? "", spa.electrical ?? ""].filter(Boolean).map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </p>
              <p className="lead" style={{ marginTop: 18 }}>
                Call for price: <a href={`tel:${settings.phoneTel}`} style={{ color: "var(--clay)" }}>{settings.phoneDisplay}</a>
              </p>
              {reserved && <p className="body-muted" style={{ marginTop: 8 }}>This one is reserved. Ask us anyway, or tell us what you want and we&apos;ll watch for a match.</p>}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
                <a href={reserved ? "#alert" : "#inquire"} className="btn btn-primary btn-lg">
                  {reserved ? "Tell me about one like it" : "Ask about this spa"} <Icon name="arrow" size={18} />
                </a>
                <a href={`tel:${settings.phoneTel}`} className="btn btn-outline btn-lg"><Icon name="phone" size={18} /> Call</a>
              </div>
              <ShareLinks url={pageUrl} title={spa.title} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-paper2">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <span className="kicker">The details</span>
            <table className="po-specs">
              <tbody>
                {specs.filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => (
                  <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>
                ))}
              </tbody>
            </table>
            {spa.highlights && spa.highlights.length > 0 && (
              <ul className="list-check" style={{ marginTop: 24 }}>
                {spa.highlights.map((h) => (
                  <li key={h}><Icon name="check" size={16} /> {h}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            {(spa.condition || (spa.checklist && spa.checklist.length > 0)) && (
              <>
                <span className="kicker">What our shop did</span>
                {spa.condition && <p className="lead" style={{ marginTop: 16, whiteSpace: "pre-line" }}>{spa.condition}</p>}
                {spa.checklist && spa.checklist.length > 0 && (
                  <>
                    <h2 className="h-md" style={{ marginTop: 26, fontSize: 20 }}>Our shop checklist</h2>
                    <ul className="list-check" style={{ marginTop: 14 }}>
                      {spa.checklist.map((c) => (
                        <li key={c}><Icon name="check" size={16} /> {c}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
            {/* TODO-confirm: Cam & Susan have not confirmed a standard pre-owned warranty. Only terms staff type in Sanity are shown. */}
            <div className="po-warranty">
              <strong>Warranty</strong>
              <p className="body-muted" style={{ marginTop: 6, whiteSpace: "pre-line" }}>
                {spa.warranty?.trim() || "Ask us about warranty coverage on this spa."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-bone" id={reserved ? "alert" : "inquire"} style={{ scrollMarginTop: "var(--nav-h)" }}>
        <div className="wrap" style={{ maxWidth: 760 }}>
          {reserved ? (
            <>
              <span className="kicker">Reserved</span>
              <h2 className="h-lg" style={{ marginTop: 16 }}>Want one like this?</h2>
              <p className="body-muted" style={{ margin: "12px 0 28px" }}>Tell us the size and what matters to you. When a similar tub arrives, we&apos;ll let you know.</p>
              <PreOwnedAlertForm defaultSeats={seatBandOf(spa.seats)} from={spa.title} />
            </>
          ) : (
            <>
              <span className="kicker">Interested?</span>
              <h2 className="h-lg" style={{ marginTop: 16 }}>Ask about this spa.</h2>
              <p className="body-muted" style={{ margin: "12px 0 28px" }}>We don&apos;t post prices. Send a note and we&apos;ll call you back, or ring {settings.phoneDisplay}.</p>
              <LeadForm unit={`${spa.title} (${spa.slug})`} unitLabel={spa.title} />
            </>
          )}
        </div>
      </section>

      <section className="section-sm">
        <div className="wrap" style={{ display: "flex", gap: 24, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <p className="body-muted" style={{ maxWidth: "52ch" }}>Have an older tub of your own? We&apos;ll look at it, and trade toward a new or pre-owned spa is on the table.</p>
          <Link href="/pre-owned/sell" className="btn btn-outline">Sell or trade in your tub <Icon name="arrow" size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
