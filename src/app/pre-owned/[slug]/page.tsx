import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import LeadForm from "@/components/LeadForm";
import PreOwnedPhotos from "@/components/PreOwnedPhotos";
import { statusLabel } from "@/components/PreOwnedGallery";
import { getPreOwnedSpa, getSettings } from "@/lib/sanity";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const spa = await getPreOwnedSpa(slug);
  if (!spa) return { title: "Pre-owned spa" };
  return {
    title: spa.title,
    description: `${spa.title}, a pre-owned hot tub inspected by the Seasonally Living shop in Spokane. Call for price.`,
  };
}

export default async function PreOwnedSpaPage({ params }: Props) {
  const { slug } = await params;
  const [spa, settings] = await Promise.all([getPreOwnedSpa(slug), getSettings()]);
  if (!spa || spa.status === "sold") notFound();

  const specs: [string, string | number | undefined][] = [
    ["Brand", spa.brand],
    ["Model", spa.model],
    ["Year", spa.year],
    ["Seats", spa.seats],
    ["Size", spa.size],
    ["Electrical", spa.electrical],
  ];

  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section-sm">
        <div className="wrap">
          <Link href="/pre-owned#floor" className="small body-muted">&larr; Back to the floor</Link>
          <div className="split" style={{ alignItems: "start", marginTop: 20 }}>
            <PreOwnedPhotos photos={spa.photos ?? []} title={spa.title} />
            <div>
              <span className={`po-badge po-${spa.status} po-badge-inline`}>{statusLabel(spa.status)}</span>
              <h1 className="h-xl" style={{ marginTop: 16 }}>{spa.title}</h1>
              <p className="lead" style={{ marginTop: 14 }}>
                Call for price: <a href={`tel:${settings.phoneTel}`} style={{ color: "var(--clay)" }}>{settings.phoneDisplay}</a>
              </p>
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
          </div>
        </div>
      </section>

      {spa.condition && (
        <section className="section-sm bg-paper2">
          <div className="wrap" style={{ maxWidth: 760 }}>
            <span className="kicker">What our shop did</span>
            <p className="lead" style={{ marginTop: 16, whiteSpace: "pre-line" }}>{spa.condition}</p>
          </div>
        </section>
      )}

      <section className="section-sm bg-bone" id="inquire">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <span className="kicker">Interested?</span>
          <h2 className="h-lg" style={{ marginTop: 16 }}>Ask about this spa.</h2>
          <p className="body-muted" style={{ margin: "12px 0 28px" }}>We don&apos;t post prices. Send a note and we&apos;ll call you back, or ring {settings.phoneDisplay}.</p>
          <LeadForm unit={`${spa.title} (${spa.slug})`} unitLabel={spa.title} />
        </div>
      </section>
    </main>
  );
}
