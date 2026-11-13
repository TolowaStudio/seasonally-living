import type { Metadata } from "next";
import Image from "next/image";
import Icon from "@/components/Icon";
import FeedbackForm from "@/components/FeedbackForm";
import { getSettings } from "@/lib/sanity";
import { reviewUrlsOf } from "@/lib/seo";
import { IMG } from "@/content/pages";

// The QR card and the day-7 request both land here. Not for search: noindex, and not in the sitemap.
export const revalidate = 60;
export const metadata: Metadata = {
  title: { absolute: "Thank you | Seasonally Living" },
  description: "Thank you for choosing Seasonally Living in Wenatchee. Leave a Google review, or tell Cam directly how we did.",
  robots: { index: false, follow: false },
};

export default async function ReviewPage() {
  const s = await getSettings();
  const urls = reviewUrlsOf(s);
  // The Google button and the Facebook link are the same kind of ask for every customer, in the same order,
  // whatever their experience was. The private note below is an addition, never a substitute or a filter.
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section-sm">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <span className="kicker">Thank you</span>
            <h1 className="h-xl" style={{ marginTop: 18 }}>Thank you for trusting us with your home.</h1>
            <p className="lead" style={{ marginTop: 16, maxWidth: "46ch" }}>
              Cam, Susan and the crew are grateful you chose a local, family-run shop. If you have a minute, a Google review helps your
              neighbors find us, and it&rsquo;s the best way to tell us how we did, whatever the answer is.
            </p>

            <div style={{ display: "grid", gap: 14, marginTop: 32, maxWidth: 460 }}>
              <a href={urls.google} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg" style={{ justifyContent: "center", fontSize: 18, padding: "22px 34px" }}>
                {urls.googleIsPlaceholder ? "Find us on Google" : "Leave a Google review"} <Icon name="arrow" size={20} />
              </a>
              {urls.facebook && (
                <a href={urls.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg" style={{ justifyContent: "center" }}>
                  Or recommend us on Facebook <Icon name="arrow" size={18} />
                </a>
              )}
            </div>
            <p className="small body-muted" style={{ marginTop: 16, maxWidth: "46ch" }}>
              {urls.googleIsPlaceholder ? "On the Google page that opens, tap Reviews, then Write a review. " : ""}It takes about a minute. Good, bad or in between, we read every one. We don&rsquo;t offer anything in return for a review, and we
              never ask anyone to leave only the good ones.
            </p>
          </div>

          <div className="photo" style={{ aspectRatio: "4 / 5" }}>
            <Image src={IMG.mcneillFamily} alt="Cam and Susan McNeill with their family" fill priority sizes="(max-width: 940px) 100vw, 45vw" style={{ objectPosition: "center 30%" }} />
          </div>
        </div>
      </section>

      <section className="section-sm bg-paper2">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <span className="kicker">Tell Cam directly</span>
            <h2 className="h-lg" style={{ marginTop: 16 }}>Want Cam to hear it too?</h2>
            <p className="body-muted" style={{ marginTop: 12, maxWidth: "44ch" }}>
              If something could have gone better, or you have a question, this note goes straight to Cam, not to a review site. It&rsquo;s in
              addition to a public review, never instead of one. You&rsquo;re welcome to post either way.
            </p>
          </div>
          <div className="card" style={{ padding: "clamp(22px, 4vw, 36px)" }}>
            <FeedbackForm phoneDisplay={s.phoneDisplay} />
          </div>
        </div>
      </section>
    </main>
  );
}
