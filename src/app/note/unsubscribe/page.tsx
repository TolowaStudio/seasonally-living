import type { Metadata } from "next";
import Link from "next/link";
import { verifyToken } from "@/lib/tokens";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false, follow: false } };

// Unsubscribing takes one click on the button, so mail scanners that pre-fetch links can't unsubscribe anyone.
export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ t?: string; done?: string; error?: string }> }) {
  const { t, done, error } = await searchParams;
  const valid = t ? verifyToken(t, "unsub") : null;
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section">
        <div className="wrap-narrow">
          <span className="kicker">The Seasonally Living note</span>
          {done ? (
            <>
              <h1 className="h-xl" style={{ marginTop: 18 }}>You&apos;re unsubscribed.</h1>
              <p className="lead" style={{ marginTop: 16 }}>We won&apos;t send the note again. Changed your mind? You can always sign up again.</p>
              <Link href="/note" className="btn btn-outline" style={{ marginTop: 26 }}>Back to the note</Link>
            </>
          ) : valid ? (
            <>
              <h1 className="h-xl" style={{ marginTop: 18 }}>Unsubscribe from the note?</h1>
              <p className="lead" style={{ marginTop: 16 }}>One click and we stop sending it.</p>
              <form method="post" action="/api/note/unsubscribe" style={{ marginTop: 26 }}>
                <input type="hidden" name="t" value={t} />
                <button type="submit" className="btn btn-primary btn-lg">Yes, unsubscribe me</button>
              </form>
            </>
          ) : (
            <>
              <h1 className="h-xl" style={{ marginTop: 18 }}>{error === "busy" ? "Please try again in a few minutes." : "That link didn’t work."}</h1>
              <p className="lead" style={{ marginTop: 16 }}>Reply to any note, email sales@seasonallyliving.com or call (509) 667-8833 and we&apos;ll take you off by hand.</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
