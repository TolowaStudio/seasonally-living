import type { Metadata } from "next";
import Link from "next/link";
import { verifyToken } from "@/lib/tokens";

export const metadata: Metadata = { title: "Confirm your email", robots: { index: false, follow: false } };

// The email link lands here. Confirming takes one click on the button, which posts to /api/note/confirm.
export default async function ConfirmPage({ searchParams }: { searchParams: Promise<{ t?: string; done?: string; error?: string }> }) {
  const { t, done, error } = await searchParams;
  const valid = t ? verifyToken(t, "confirm") : null;
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section">
        <div className="wrap-narrow">
          {done ? (
            <>
              <span className="kicker">The Seasonally Living note</span>
              <h1 className="h-xl" style={{ marginTop: 18 }}>You&apos;re confirmed.</h1>
              <p className="lead" style={{ marginTop: 16 }}>Thanks. We send at most one note a month, and every one has an unsubscribe link.</p>
              <Link href="/visit#book" className="btn btn-primary" style={{ marginTop: 26 }}>Book a visit</Link>
            </>
          ) : valid ? (
            <>
              <span className="kicker">One last step</span>
              <h1 className="h-xl" style={{ marginTop: 18 }}>Confirm your email.</h1>
              <p className="lead" style={{ marginTop: 16 }}>Click the button and you&apos;re on the Seasonally Living note list. Not you? Close this page and nothing happens.</p>
              <form method="post" action="/api/note/confirm" style={{ marginTop: 26 }}>
                <input type="hidden" name="t" value={t} />
                <button type="submit" className="btn btn-primary btn-lg">Yes, confirm my email</button>
              </form>
            </>
          ) : (
            <>
              <span className="kicker">The Seasonally Living note</span>
              <h1 className="h-xl" style={{ marginTop: 18 }}>{error === "busy" ? "Please try again in a few minutes." : "That link didn’t work."}</h1>
              <p className="lead" style={{ marginTop: 16 }}>
                {error === "store"
                  ? "We couldn’t save your signup just now. Please try the link again, or call (509) 667-8833."
                  : "It may have expired (links last 7 days) or been copied incompletely. Sign up again and we’ll send a fresh one."}
              </p>
              <Link href="/note" className="btn btn-primary" style={{ marginTop: 26 }}>Sign up again</Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
