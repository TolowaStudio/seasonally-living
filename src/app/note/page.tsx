import type { Metadata } from "next";
import Icon from "@/components/Icon";
import NoteForm from "@/components/NoteForm";
import { INTERESTS } from "@/lib/interests";
import Crumbs from "@/components/Crumbs";
import { getPage } from "@/lib/sanity";
import { SITE_TITLE_SUFFIX, socialMeta } from "@/lib/seo";
import type { SimpleContent } from "@/content/types";

// Content: Sanity document "page-note" (fallback: src/content/pages.ts).
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPage<SimpleContent>("/note");
  return { title: c.seo.title, description: c.seo.description, ...socialMeta({ fullTitle: `${c.seo.title} | ${SITE_TITLE_SUFFIX}`, description: c.seo.description, path: "/note", ogKey: "home", ogAlt: "The Seasonally Living note" }) };
}

export default async function NotePage() {
  const c = await getPage<SimpleContent>("/note");
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <Crumbs path="/note" />
      <section className="section">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <span className="kicker">{c.kicker}</span>
            <h1 className="h-xl" style={{ marginTop: 18 }}>{c.title}</h1>
            <p className="lead" style={{ marginTop: 16 }}>{c.lead}</p>
            <ul className="list-check" style={{ marginTop: 26 }}>
              {INTERESTS.map((i) => (
                <li key={i.id}><Icon name="arrow" size={16} /> <span><strong style={{ color: "var(--ink)" }}>{i.label}:</strong> {i.magnet}</span></li>
              ))}
            </ul>
          </div>
          <div className="card" style={{ padding: "clamp(24px, 4vw, 40px)" }}>
            <NoteForm />
          </div>
        </div>
      </section>
    </main>
  );
}
