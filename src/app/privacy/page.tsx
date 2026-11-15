import type { Metadata } from "next";
import Link from "next/link";
import Crumbs from "@/components/Crumbs";
import CookieSettingsLink from "@/components/CookieSettingsLink";
import { getSettings } from "@/lib/sanity";
import { addressOf } from "@/lib/site";
import { SITE_TITLE_SUFFIX, socialMeta } from "@/lib/seo";
import { PRIVACY_INTRO, PRIVACY_SECTIONS, PRIVACY_UPDATED } from "@/content/privacy";

export const revalidate = 3600;

const TITLE = "Privacy policy";
const DESCRIPTION = "What Seasonally Living collects on this website, why, and how to opt out of cookies and ad tracking.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  ...socialMeta({ fullTitle: `${TITLE} | ${SITE_TITLE_SUFFIX}`, description: DESCRIPTION, path: "/privacy", ogKey: "home", ogAlt: "Seasonally Living showroom in Wenatchee" }),
};

export default async function PrivacyPage() {
  const s = await getSettings();
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <Crumbs path="/privacy" leaf="Privacy policy" />
      <section className="section-sm">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <span className="kicker">Privacy</span>
          <h1 className="h-xl" style={{ marginTop: 18 }}>Privacy policy</h1>
          <p className="small body-muted" style={{ marginTop: 10 }}>Last updated {PRIVACY_UPDATED}</p>
          <p className="lead" style={{ marginTop: 20 }}>{PRIVACY_INTRO}</p>

          {PRIVACY_SECTIONS.map((sec) => (
            <section key={sec.title} style={{ marginTop: 36 }}>
              <h2 className="h-md">{sec.title}</h2>
              {sec.body.map((p, i) => (
                <p key={i} className="body-muted" style={{ marginTop: 12 }}>{p}</p>
              ))}
              {sec.title === "Cookies and similar tools" && (
                <p className="body-muted" style={{ marginTop: 12 }}>
                  <CookieSettingsLink className="ul-link" />
                </p>
              )}
            </section>
          ))}

          <section style={{ marginTop: 36 }}>
            <h2 className="h-md">Contact</h2>
            <p className="body-muted" style={{ marginTop: 12 }}>
              {s.legalName}, {addressOf(s)}.{" "}
              <a className="ul-link" href={`mailto:${s.email}`}>{s.email}</a> or <a className="ul-link" href={`tel:${s.phoneTel}`}>{s.phoneDisplay}</a>.
            </p>
            <p className="small body-muted" style={{ marginTop: 20 }}>
              <Link className="ul-link" href="/">Back to the home page</Link>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
