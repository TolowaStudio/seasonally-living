import { createHash } from "node:crypto";

// Meta Conversions API (server side). Sends a hashed Lead event so conversions survive ad blockers and
// consent denials on the pixel. Does nothing unless BOTH are set: NEXT_PUBLIC_META_PIXEL_ID and META_CAPI_TOKEN
// (a system-user token from Events Manager > Settings > Conversions API; keep it in GCP Secret Manager).
//
// Not called from anywhere yet. The owner of src/app/api/lead/route.ts (TOL-2922) calls it after a lead is
// accepted and before returning, without awaiting it past the response if they prefer:
//
//   void sendMetaLead({ eventId: d.eventId, email, phone, sourceUrl, userAgent, clientIp, fbp: d.fbp, fbc: d.fbc, interest });
//
// The client sends `eventId`, `fbp`, `fbc` from trackConversion() / getMetaBrowserIds() in lib/track.ts. The
// same eventId on the pixel Lead event and here lets Meta count it once.

const GRAPH_VERSION = "v21.0";
const TIMEOUT_MS = 3000;

export const metaCapiEnabled = () => !!(process.env.META_CAPI_TOKEN?.trim() && process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim());

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

/** Lowercase and trim, then SHA-256 (Meta's required normalisation for email). */
export const hashEmail = (email: string) => sha256(email.trim().toLowerCase());

/** Digits only with a country code (assumes US/Canada for 10 digits), then SHA-256. Undefined if too short. */
export function hashPhone(phone: string): string | undefined {
  let d = phone.replace(/\D/g, "");
  if (d.length === 10) d = "1" + d;
  return d.length >= 11 ? sha256(d) : undefined;
}

export type MetaLeadInput = {
  /** Same id the browser pixel used (from trackConversion). Required for de-duplication. */
  eventId?: string;
  email?: string;
  phone?: string;
  /** Page the lead came from, e.g. the full URL including UTMs. */
  sourceUrl?: string;
  userAgent?: string;
  clientIp?: string;
  fbp?: string;
  fbc?: string;
  /** Interest id from lib/interests.ts, sent as content_category. */
  interest?: string;
  /** "Lead" for visit requests and pre-owned inquiries, "Subscribe" for the note. */
  eventName?: "Lead" | "Subscribe";
};

export type MetaCapiResult = { sent: boolean; reason?: string; status?: number };

/** Never throws and never blocks longer than 3s, so a Meta outage can't fail a lead. */
export async function sendMetaLead(input: MetaLeadInput): Promise<MetaCapiResult> {
  const token = process.env.META_CAPI_TOKEN?.trim();
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  if (!token || !pixelId) return { sent: false, reason: "not configured" };

  const userData: Record<string, unknown> = {};
  if (input.email) userData.em = [hashEmail(input.email)];
  const ph = input.phone ? hashPhone(input.phone) : undefined;
  if (ph) userData.ph = [ph];
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;
  if (!userData.em && !userData.ph) return { sent: false, reason: "no email or phone" };

  // Token goes in the POST body (Graph API accepts it there), never the URL, so it stays out of access logs.
  const body: Record<string, unknown> = {
    access_token: token,
    data: [
      {
        event_name: input.eventName ?? "Lead",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        ...(input.eventId ? { event_id: input.eventId } : {}),
        ...(input.sourceUrl ? { event_source_url: input.sourceUrl } : {}),
        user_data: userData,
        ...(input.interest ? { custom_data: { content_category: input.interest } } : {}),
      },
    ],
  };
  const test = process.env.META_CAPI_TEST_EVENT_CODE?.trim();
  if (test) body.test_event_code = test;

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(pixelId)}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error("meta-capi: error", res.status, (await res.text()).slice(0, 300));
      return { sent: false, reason: "meta error", status: res.status };
    }
    return { sent: true, status: res.status };
  } catch (err) {
    console.error("meta-capi: failed", err instanceof Error ? err.message : err);
    return { sent: false, reason: "network" };
  }
}
