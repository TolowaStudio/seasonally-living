"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { CONSENT_KEY, isGranted, setConsent, useConsent } from "@/lib/consent";
import { INTERESTS } from "@/lib/interests";
import { trackConversion } from "@/lib/track";
import { anyTagEnabled, googleEnabled, metaEnabled, posthogEnabled, tracking } from "@/lib/tracking-config";

// Mounted once in the root layout. With no NEXT_PUBLIC_* tag env set it renders nothing and attaches nothing.
//  - Google (GA4 / Ads): loads right away in Consent Mode v2, defaulting to denied (no cookies) until the visitor accepts.
//  - Meta Pixel and PostHog: have no consent mode, so they load only after the visitor accepts.
//  - Listeners fire call_click, directions_click, booking_started and the form conversions.

const j = JSON.stringify;

// Runs before gtag.js. Stored choice wins over the default, so a returning visitor never flashes "denied".
const googleInit = () => `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
var c=${j(tracking.consentDefault)};try{var s=localStorage.getItem(${j(CONSENT_KEY)});if(s==='granted'||s==='denied')c=s}catch(e){}
gtag('consent','default',{ad_storage:c,ad_user_data:c,ad_personalization:c,analytics_storage:c,wait_for_update:500});
gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);
gtag('js',new Date());
${tracking.ga4Id ? `gtag('config',${j(tracking.ga4Id)});` : ""}
${tracking.adsId ? `gtag('config',${j(tracking.adsId)});` : ""}
`;

const metaInit = (id: string) => `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init',${j(id)});fbq('track','PageView');
`;

const posthogInit = (key: string, host: string) => `
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init(${j(key)},{api_host:${j(host)},defaults:'2025-05-24',person_profiles:'identified_only'});
`;

const MAP_HOSTS = /^(https?:)?\/\/(www\.google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.apple\.com|goo\.gl\/maps|maps\.app\.goo\.gl)/i;
const interestIdFor = (labelText: string) => INTERESTS.find((i) => i.label === labelText.trim())?.id;

/** Click, focus and form-success listeners. Only attached when a tag is enabled. */
function useConversionListeners() {
  const bookingFocused = useRef(false);
  const pathname = usePathname();
  // "Once per page view": a client-side navigation starts a new one.
  useEffect(() => {
    bookingFocused.current = false;
  }, [pathname]);
  useEffect(() => {
    if (!anyTagEnabled) return;

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const where = a.closest("[data-track-area]")?.getAttribute("data-track-area") ?? undefined;
      if (href.startsWith("tel:")) {
        trackConversion("call_click", { phone: href.slice(4), area: where });
      } else if (MAP_HOSTS.test(href)) {
        trackConversion("directions_click", { area: where });
      } else {
        // Booking CTA: the booking form on /visit, or a same-page #book anchor (campaign pages).
        const u = new URL(a.href, location.href);
        const sameOrigin = u.origin === location.origin;
        const toVisit = sameOrigin && u.pathname === "/visit" && (u.hash === "#book" || u.searchParams.has("interest"));
        const samePageBook = sameOrigin && u.hash === "#book" && u.pathname === location.pathname;
        if (toVisit || samePageBook) {
          trackConversion("booking_started", { via: "link", area: where, interest: u.searchParams.get("interest") ?? undefined });
        }
      }
    };

    // Starting to fill in the booking form counts once per page view.
    const onFocusIn = (e: FocusEvent) => {
      if (bookingFocused.current) return;
      const form = (e.target as Element | null)?.closest?.('form[aria-label="Book a visit"]');
      if (!form) return;
      bookingFocused.current = true;
      trackConversion("booking_started", { via: "form" });
    };

    // Form conversions. LeadForm / NoteForm (owned by TOL-2922) do not call trackConversion yet, so watch for
    // the "Thanks" state they render once /api/lead has accepted the submission. The form unmounting is the
    // signal; a failed submit leaves the form in place. TODO(TOL-3346): replace with direct calls after rebase.
    let pending: { form: HTMLFormElement; name: "lead_submitted" | "preowned_inquiry" | "newsletter_signup"; interest?: string } | null = null;
    const onSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement | null;
      const label = form?.getAttribute?.("aria-label") ?? "";
      if (!form) return;
      if (label === "Book a visit") {
        const unit = /Asking about:/.test(form.textContent ?? "");
        const picked = form.querySelector(".opt-tile.sel .ot-title")?.textContent ?? "";
        pending = { form, name: unit ? "preowned_inquiry" : "lead_submitted", interest: unit ? "pre-owned" : interestIdFor(picked) };
      } else if (label === "Sell or trade in your hot tub") {
        // Seller / trade-in lead (PreOwnedSellForm, TOL-2901): counts as a pre-owned inquiry, tagged as supply.
        pending = { form, name: "preowned_inquiry", interest: "pre-owned-supply" };
      } else if (label.startsWith("Get the Seasonally Living note")) {
        const picked = [...form.querySelectorAll(".chip.active")].map((c) => interestIdFor(c.textContent ?? "") ?? "").filter(Boolean);
        pending = { form, name: "newsletter_signup", interest: picked.join(",") || undefined };
      }
    };
    const observer = new MutationObserver(() => {
      // Success only: the form is gone AND the "Thanks" state is on the page. A navigation away also
      // unmounts the form, but renders no .form-status, so it must not count as a lead.
      if (!pending || pending.form.isConnected) return;
      if (!document.querySelector(".form-status")) {
        pending = null;
        return;
      }
      const { name, interest } = pending;
      pending = null;
      trackConversion(name, { interest });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("click", onClick, true);
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("submit", onSubmit, true);
      observer.disconnect();
    };
  }, []);
}

function ConsentBanner() {
  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      data-theme="showroom-dark"
      style={{
        position: "fixed", left: 16, bottom: 16, zIndex: 60, maxWidth: 340, padding: "14px 16px",
        background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--line-strong)",
        borderRadius: "var(--r-md)", boxShadow: "var(--shadow-md)", fontSize: 13.5, lineHeight: 1.5,
      }}
    >
      <p style={{ color: "var(--ink-soft)" }}>
        {tracking.consentDefault === "denied"
          ? "We use cookies to see which pages and ads bring people in. Nothing is shared until you say yes."
          : "We use cookies to see which pages and ads bring people in. Choose No thanks to opt out."}
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button type="button" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: 13.5 }} onClick={() => setConsent("granted")}>
          Accept
        </button>
        <button type="button" className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 13.5 }} onClick={() => setConsent("denied")}>
          No thanks
        </button>
      </div>
    </div>
  );
}

export default function Tracking() {
  const consent = useConsent();
  useConversionListeners();
  if (!anyTagEnabled) return null;
  const granted = isGranted(consent);
  return (
    <>
      {googleEnabled && (
        <>
          <Script id="gtag-init" strategy="afterInteractive">{googleInit()}</Script>
          <Script id="gtag-js" src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent((tracking.ga4Id ?? tracking.adsId)!)}`} strategy="afterInteractive" />
        </>
      )}
      {granted && metaEnabled && <Script id="meta-pixel" strategy="afterInteractive">{metaInit(tracking.metaPixelId!)}</Script>}
      {granted && posthogEnabled && <Script id="posthog-init" strategy="afterInteractive">{posthogInit(tracking.posthogKey!, tracking.posthogHost)}</Script>}
      {consent === "unset" ? <ConsentBanner /> : null}
    </>
  );
}
