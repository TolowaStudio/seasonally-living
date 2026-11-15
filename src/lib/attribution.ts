// First-touch / last-touch attribution, kept in a first-party cookie for 90 days.
//
// Client: captureAttribution() runs once per page load (see AttributionCapture in the layout) and
// getAttribution() is read by LeadForm / NoteForm at submit time.
// Server: cleanAttribution() whitelists and clips whatever the client sent before it is emailed or logged.
//
// No third-party tags live here. trackConversion() is the single hook the ads session wires to
// GA4 / Meta / PostHog (see the bottom of this file).

export type Touch = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  landing?: string; // path only, never the query string
  referrer?: string; // host + path of an outside referrer
  ts?: number; // ms since epoch
};
export type Attribution = { first?: Touch; last?: Touch };

export const ATTRIBUTION_COOKIE = "sl_attr";
export const ATTRIBUTION_DAYS = 90;

const PARAM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;
const CTRL = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]+/g;
const tidy = (v: unknown, max: number) => (typeof v === "string" ? v.replace(CTRL, " ").trim().slice(0, max) : "");

/** Whitelist + clip one touch. Safe to call on untrusted input. */
export function cleanTouch(raw: unknown): Touch | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const r = raw as Record<string, unknown>;
  const out: Touch = {};
  for (const k of PARAM_KEYS) {
    const v = tidy(r[k], k === "gclid" || k === "fbclid" ? 200 : 100);
    if (v) out[k] = v;
  }
  const landing = tidy(r.landing, 200);
  if (landing) out.landing = landing;
  const referrer = tidy(r.referrer, 200);
  if (referrer) out.referrer = referrer;
  if (typeof r.ts === "number" && Number.isFinite(r.ts)) out.ts = Math.round(r.ts);
  return Object.keys(out).length ? out : undefined;
}

export function cleanAttribution(raw: unknown): Attribution {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const r = raw as Record<string, unknown>;
  const out: Attribution = {};
  const first = cleanTouch(r.first);
  const last = cleanTouch(r.last);
  if (first) out.first = first;
  if (last) out.last = last;
  return out;
}

/** One line per touch for the staff email. */
export function describeTouch(t?: Touch): string {
  if (!t) return "-";
  const campaign = PARAM_KEYS.filter((k) => t[k] && k !== "gclid" && k !== "fbclid").map((k) => `${k.replace("utm_", "")}=${t[k]}`);
  if (t.gclid) campaign.push("gclid=yes");
  if (t.fbclid) campaign.push("fbclid=yes");
  const parts = [
    campaign.join(" ") || "no campaign tags",
    t.landing ? `landed on ${t.landing}` : "",
    t.referrer ? `from ${t.referrer}` : t.landing ? "direct" : "",
    t.ts ? new Date(t.ts).toISOString().slice(0, 10) : "",
  ].filter(Boolean);
  return parts.join(" | ");
}

// ---------------------------------------------------------------- browser side

function readCookie(): Attribution {
  try {
    const m = document.cookie.split("; ").find((c) => c.startsWith(ATTRIBUTION_COOKIE + "="));
    if (!m) return {};
    return cleanAttribution(JSON.parse(decodeURIComponent(m.slice(ATTRIBUTION_COOKIE.length + 1))));
  } catch {
    return {};
  }
}

function writeCookie(a: Attribution) {
  try {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${ATTRIBUTION_COOKIE}=${encodeURIComponent(JSON.stringify(a))}; Max-Age=${ATTRIBUTION_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
  } catch {
    /* cookies blocked: attribution simply isn't kept */
  }
}

function currentTouch(): { touch: Touch; hasCampaign: boolean; externalReferrer: boolean } {
  const params = new URLSearchParams(location.search);
  const touch: Touch = { ts: Date.now(), landing: location.pathname };
  let hasCampaign = false;
  for (const k of PARAM_KEYS) {
    const v = tidy(params.get(k), k === "gclid" || k === "fbclid" ? 200 : 100);
    if (v) {
      touch[k] = v;
      hasCampaign = true;
    }
  }
  let externalReferrer = false;
  try {
    if (document.referrer) {
      const ref = new URL(document.referrer);
      if (ref.host !== location.host) {
        touch.referrer = tidy(ref.host + ref.pathname, 200);
        externalReferrer = true;
      }
    }
  } catch {
    /* unparsable referrer */
  }
  return { touch, hasCampaign, externalReferrer };
}

/** Call once per page load. First touch is set once; last touch moves when a visit brings campaign tags or an outside referrer. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const saved = readCookie();
  const { touch, hasCampaign, externalReferrer } = currentTouch();
  const next: Attribution = {
    first: saved.first ?? touch,
    last: !saved.last || hasCampaign || externalReferrer ? touch : saved.last,
  };
  writeCookie(next);
  return next;
}

/** What forms send with a lead or signup. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const saved = readCookie();
  return saved.first || saved.last ? saved : captureAttribution();
}

// ---------------------------------------------------------------- conversion hook

export type ConversionProps = Record<string, string | number | boolean | undefined>;
export type ConversionHandler = (name: string, props: ConversionProps) => void;

const handlers = new Set<ConversionHandler>();

/**
 * Wiring point for the ads session (TOL-3346). Either call registerConversionHandler(fn) from client
 * code, or listen for the `sl:conversion` window event (detail: { name, props }). Both are no-ops when
 * nothing is listening, and a throwing handler can never break a form.
 *
 * Event names fired today (same names as lib/tracking-config.ts ConversionName): lead_submitted (visit request),
 * preowned_inquiry (visit request about a specific spa), newsletter_signup (note / guide signup).
 *
 * TOL-3346 note: components/Tracking.tsx currently fires the ad tags from a DOM success observer. Do NOT also
 * register a handler that calls lib/track.ts until that observer is removed, or every conversion counts twice.
 */
export function registerConversionHandler(fn: ConversionHandler): () => void {
  handlers.add(fn);
  return () => handlers.delete(fn);
}

export function trackConversion(name: string, props: ConversionProps = {}): void {
  if (typeof window === "undefined") return;
  try {
    const detail = { name, props: { ...props, attribution_last_source: getAttribution().last?.utm_source } };
    for (const h of handlers) {
      try {
        h(name, detail.props);
      } catch {
        /* a bad handler must not break the page */
      }
    }
    window.dispatchEvent(new CustomEvent("sl:conversion", { detail }));
  } catch {
    /* never throw from tracking */
  }
}
