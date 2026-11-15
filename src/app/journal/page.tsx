import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import { JOURNAL_TAGS, tagLabel } from "@/content/journal";
import { getPosts, readingMinutes } from "@/lib/journal";

// Content: Sanity "post" documents (fallback: src/content/journal.ts). Filter with ?tag=<line>.
export const revalidate = 60;

type Props = { searchParams: Promise<{ tag?: string | string[] }> };

export const metadata: Metadata = {
  title: "Journal: tips from the Wenatchee shop",
  description: "Hot tub winter care, burn-ban basics, pre-owned spa buying advice and venting know-how, from the Seasonally Living shop in Wenatchee.",
  alternates: { canonical: "/journal", types: { "application/rss+xml": "/journal/rss.xml" } },
};

const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" }) : "");

export default async function JournalPage({ searchParams }: Props) {
  const raw = (await searchParams).tag;
  const tag = JOURNAL_TAGS.find((t) => t.id === (Array.isArray(raw) ? raw[0] : raw))?.id;
  const all = await getPosts();
  const used = JOURNAL_TAGS.filter((t) => all.some((p) => p.tags.includes(t.id)));
  const posts = tag ? all.filter((p) => p.tags.includes(tag)) : all;

  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section-sm">
        <div className="wrap">
          <span className="kicker">The journal</span>
          <h1 className="h-xl" style={{ marginTop: 18, maxWidth: "18ch" }}>Straight answers from the shop.</h1>
          <p className="lead" style={{ marginTop: 16, maxWidth: "52ch" }}>
            Winter hot tub care, burn-ban basics, what to ask about a pre-owned spa, and why we think about venting first. Written by the people who do the work.
          </p>

          <nav className="jr-filters" aria-label="Filter by line">
            <Link href="/journal" className={`chip${tag ? "" : " active"}`} aria-current={tag ? undefined : "page"}>All</Link>
            {used.map((t) => (
              <Link key={t.id} href={`/journal?tag=${t.id}`} className={`chip${tag === t.id ? " active" : ""}`} aria-current={tag === t.id ? "page" : undefined}>
                {t.label}
              </Link>
            ))}
          </nav>

          {posts.length === 0 ? (
            <div className="card" style={{ padding: 32, marginTop: 40, maxWidth: 640 }}>
              <p className="lead">Nothing here yet. Check back soon, or get the monthly note and we&apos;ll send the useful ones to you.</p>
              <Link href="/note" className="btn btn-primary" style={{ marginTop: 22 }}>The monthly note <Icon name="arrow" size={16} /></Link>
            </div>
          ) : (
            <div className="jr-grid">
              {posts.map((p, i) => (
                <Link key={p.slug} href={`/journal/${p.slug}`} className="card hoverable jr-card">
                  <div className="photo jr-photo">
                    <Image src={p.heroImage} alt={p.heroAlt} fill priority={i < 3} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                  </div>
                  <div className="jr-body">
                    <p className="jr-meta">
                      {[p.tags[0] ? tagLabel(p.tags[0]) : "", fmt(p.publishAt)].filter(Boolean).join(" · ")}
                    </p>
                    <h2 className="h-md" style={{ fontSize: 22, marginTop: 10 }}>{p.title}</h2>
                    <p className="body-muted small" style={{ marginTop: 10 }}>{p.excerpt}</p>
                    <span className="po-cta">Read · {readingMinutes(p.body)} min <Icon name="arrow" size={16} /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <p className="small body-muted" style={{ marginTop: 40 }}>
            <a href="/journal/rss.xml" className="ul-link">Subscribe by RSS</a>
          </p>
        </div>
      </section>
    </main>
  );
}
