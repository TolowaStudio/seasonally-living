import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import NoteForm from "@/components/NoteForm";
import { getGuide } from "@/lib/sanity";
import { verifyToken } from "@/lib/tokens";

// Private to people who confirmed: needs the signed link from the confirmation page or email. Never indexed.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function GuideRead({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ t?: string; welcome?: string }> }) {
  const [{ slug }, { t, welcome }] = await Promise.all([params, searchParams]);
  const g = await getGuide(slug);
  if (!g) notFound();
  const access = verifyToken(t, "guide");
  if (!access || access.g !== g.slug) {
    return (
      <main style={{ paddingTop: "var(--nav-h)" }}>
        <section className="section">
          <div className="wrap split" style={{ alignItems: "start" }}>
            <div>
              <span className="kicker">{g.kicker}</span>
              <h1 className="h-xl" style={{ marginTop: 18 }}>This guide is one step away.</h1>
              <p className="lead" style={{ marginTop: 16 }}>
                Your link may have expired or been copied incompletely. Enter your email and we&apos;ll send a fresh one. Or go back to the{" "}
                <Link href={`/guides/${g.slug}`} className="ul-link" style={{ color: "var(--clay)" }}>guide page</Link>.
              </p>
            </div>
            <div className="card" style={{ padding: "clamp(24px, 4vw, 40px)" }}>
              <NoteForm compact guide={g.slug} guideTitle={g.title} submitLabel="Send me the guide" />
            </div>
          </div>
        </section>
      </main>
    );
  }
  const book = `/visit?interest=${g.interest}&utm_source=site&utm_medium=guide&utm_campaign=${g.slug}#book`;
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <article className="section-sm">
        <div className="wrap-narrow">
          {welcome && (
            <p className="form-status small" role="status" style={{ marginBottom: 28 }}>
              You&apos;re confirmed. Thanks! Bookmark this page, and we&apos;ve emailed you the link too.
            </p>
          )}
          <span className="kicker">{g.kicker} · {g.readMinutes} min read</span>
          <h1 className="h-xl" style={{ marginTop: 18 }}>{g.title}</h1>
          <p className="lead" style={{ marginTop: 16 }}>{g.intro}</p>
          {g.sections.map((s) => (
            <section key={s.heading} style={{ marginTop: 44 }}>
              <h2 className="h-lg">{s.heading}</h2>
              {s.body.split(/\n{2,}/).filter(Boolean).map((p, i) => (
                <p key={i} className="body-muted" style={{ marginTop: 14 }}>{p}</p>
              ))}
              {s.bullets && s.bullets.length > 0 && (
                <ul className="list-check" style={{ marginTop: 18 }}>
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
      <CtaBand title={g.closing.title} body={g.closing.body} cta={g.closing.cta} href={book} />
    </main>
  );
}
