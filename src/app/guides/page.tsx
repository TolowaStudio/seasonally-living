import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import { getGuides } from "@/lib/sanity";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Free guides",
  description: "Plain, useful guides from Seasonally Living in Wenatchee: winter hot tub care, burn-ban-ready fireplaces, pre-owned spa shopping and spring pool planning.",
};

export default async function GuidesIndex() {
  const guides = await getGuides();
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section">
        <div className="wrap">
          <span className="kicker">Free guides</span>
          <h1 className="h-xl" style={{ marginTop: 18, maxWidth: "20ch" }}>Useful before you ever visit.</h1>
          <p className="lead" style={{ marginTop: 16, maxWidth: "52ch" }}>Short, plain guides from the people in the showroom. Each one is free for your email.</p>
          <div className="grid-2" style={{ marginTop: 48 }}>
            {guides.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="card hoverable" style={{ padding: 30, display: "block" }}>
                <span className="eyebrow">{g.kicker} · {g.readMinutes} min read</span>
                <h2 className="h-md" style={{ marginTop: 10 }}>{g.title}</h2>
                <p className="body-muted" style={{ marginTop: 10 }}>{g.summary}</p>
                <span className="small ul-link" style={{ display: "inline-flex", gap: 8, alignItems: "center", marginTop: 16, color: "var(--clay)" }}>Get the guide <Icon name="arrow" size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
