import type { Metadata } from "next";
import Icon from "@/components/Icon";
import NoteForm from "@/components/NoteForm";
import { INTERESTS } from "@/lib/interests";

export const metadata: Metadata = {
  title: "The Seasonally Living Note",
  description: "One useful note a month from Seasonally Living in Wenatchee: fireplace and hot tub care, pre-owned arrivals and pool planning.",
};

export default function NotePage() {
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <span className="kicker">The Seasonally Living note</span>
            <h1 className="h-xl" style={{ marginTop: 18 }}>One useful note a month.</h1>
            <p className="lead" style={{ marginTop: 16 }}>Pick what you care about and we&apos;ll send the matching guide right away.</p>
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
