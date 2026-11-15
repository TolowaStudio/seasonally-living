import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import NoteForm from "@/components/NoteForm";
import { getGuide } from "@/lib/sanity";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = await getGuide((await params).slug);
  if (!g) return {};
  return { title: g.seo?.title || g.title, description: g.seo?.description || g.summary };
}

// The landing page shows what the guide covers; the full guide sits behind the email confirmation.
export default async function GuideLanding({ params }: { params: Promise<{ slug: string }> }) {
  const g = await getGuide((await params).slug);
  if (!g) notFound();
  const book = `/visit?interest=${g.interest}&utm_source=site&utm_medium=guide&utm_campaign=${g.slug}#book`;
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <span className="kicker">{g.kicker} · Free guide</span>
            <h1 className="h-xl" style={{ marginTop: 18 }}>{g.title}</h1>
            <p className="lead" style={{ marginTop: 16 }}>{g.summary}</p>
            <ul className="list-check" style={{ marginTop: 26 }}>
              {g.gives.map((x) => (
                <li key={x}><Icon name="check" size={16} /> {x}</li>
              ))}
            </ul>
            <p className="small body-muted" style={{ marginTop: 22 }}>About {g.readMinutes} minutes to read.</p>
          </div>
          <div>
            <div className="card" style={{ padding: "clamp(24px, 4vw, 40px)" }}>
              <h2 className="h-md" style={{ marginBottom: 16 }}>Where should we send it?</h2>
              <NoteForm compact guide={g.slug} guideTitle={g.title} submitLabel="Send me the guide" />
            </div>
            <p className="body-muted" style={{ marginTop: 22 }}>
              Rather talk to a person?{" "}
              <Link href={book} className="ul-link" style={{ color: "var(--clay)" }}>Book a visit</Link> or call (509) 667-8833.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
