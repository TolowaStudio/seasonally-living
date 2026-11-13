import type { Metadata } from "next";
import Icon from "@/components/Icon";
import NoteForm from "@/components/NoteForm";
import { PICKABLE_INTERESTS } from "@/lib/interests";
import { getPage } from "@/lib/sanity";
import type { SimpleContent } from "@/content/types";

// Content: Sanity document "page-note" (fallback: src/content/pages.ts).
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPage<SimpleContent>("/note");
  return { title: c.seo.title, description: c.seo.description };
}

export default async function NotePage() {
  const c = await getPage<SimpleContent>("/note");
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <span className="kicker">{c.kicker}</span>
            <h1 className="h-xl" style={{ marginTop: 18 }}>{c.title}</h1>
            <p className="lead" style={{ marginTop: 16 }}>{c.lead}</p>
            <ul className="list-check" style={{ marginTop: 26 }}>
              {PICKABLE_INTERESTS.map((i) => (
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
