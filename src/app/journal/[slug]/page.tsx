import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBand from "@/components/CtaBand";
import Icon from "@/components/Icon";
import PortableBody from "@/components/PortableBody";
import { tagLabel } from "@/content/journal";
import { getPost, getPosts, imageUrl, postUrl, readingMinutes } from "@/lib/journal";
import { getSettings } from "@/lib/sanity";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" }) : "");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Journal" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: postUrl(post.slug),
      publishedTime: post.publishAt,
      images: [{ url: imageUrl(post.heroImage, 1200), alt: post.heroAlt }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, all, settings] = await Promise.all([getPost(slug), getPosts(), getSettings()]);
  if (!post) notFound();

  const base = getSiteUrl();
  const related = all.filter((p) => p.slug !== post.slug).sort((a, b) => Number(b.tags.some((t) => post.tags.includes(t))) - Number(a.tags.some((t) => post.tags.includes(t)))).slice(0, 2);
  const org = { "@type": "Organization", name: settings.name, url: base, logo: { "@type": "ImageObject", url: imageUrl(settings.logo, 400) } };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [imageUrl(post.heroImage, 1200)],
    datePublished: post.publishAt,
    dateModified: post.updatedAt ?? post.publishAt,
    mainEntityOfPage: postUrl(post.slug),
    author: org,
    publisher: org,
  };

  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      {/* JSON-LD: "<" escaped so a post can never close the script tag. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article className="section-sm">
        <div className="wrap-narrow">
          <Link href="/journal" className="small body-muted">&larr; All posts</Link>
          <p className="jr-meta" style={{ marginTop: 28 }}>
            {[post.tags[0] ? tagLabel(post.tags[0]) : "", fmt(post.publishAt), `${readingMinutes(post.body)} min read`].filter(Boolean).join(" · ")}
          </p>
          <h1 className="h-xl" style={{ marginTop: 14 }}>{post.title}</h1>
          <p className="lead" style={{ marginTop: 18 }}>{post.excerpt}</p>
          <div className="photo" style={{ aspectRatio: "16 / 9", marginTop: 36 }}>
            <Image src={post.heroImage} alt={post.heroAlt} fill priority sizes="(max-width: 900px) 100vw, 860px" />
          </div>
          <div style={{ marginTop: 40 }}>
            <PortableBody blocks={post.body} />
          </div>
          {post.tags.length > 0 && (
            <div className="jr-filters" style={{ marginTop: 40 }}>
              {post.tags.map((t) => <Link key={t} href={`/journal?tag=${t}`} className="chip">{tagLabel(t)}</Link>)}
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="section-sm bg-paper2">
          <div className="wrap-narrow">
            <span className="kicker">More from the journal</span>
            <div style={{ marginTop: 20, display: "grid" }}>
              {related.map((p) => (
                <Link key={p.slug} href={`/journal/${p.slug}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "18px 4px", borderTop: "1px solid var(--line)" }}>
                  <span style={{ fontWeight: 600 }}>{p.title}</span>
                  <Icon name="arrow" size={16} style={{ color: "var(--clay)", flex: "0 0 auto" }} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand title="Questions about your own place?" body="Bring a photo, or just call. We're happy to talk it through." />
    </main>
  );
}
