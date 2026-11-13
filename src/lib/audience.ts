// Audience provider adapter: where confirmed note subscribers live.
//
//   AudienceProvider            the interface the rest of the site talks to
//   ResendAudience              Resend Audiences/Contacts, active when RESEND_API_KEY + RESEND_AUDIENCE_ID are set
//   LogOnlyAudience             default when those are unset: logs a structured line and stores nothing.
//                               The staff email still goes out, so nobody is lost.
//   GhostAudience (stub)        Ghost is a pending money decision (TOL-2896). Documented below, not wired.
//
// Subscribe is only ever called AFTER the person clicks the signed double opt-in link.

import { oneLine, tagOf } from "./text";

export type Subscriber = {
  email: string;
  name?: string;
  interests: string[]; // ids from lib/interests.ts
  source: string; // page path the signup came from
  guide?: string; // lead-magnet slug, if any
  consentText: string; // the exact wording shown at signup
  consentVersion: string;
  consentAt: string; // ISO time of the signup form submit
  confirmedAt: string; // ISO time of the opt-in link click
};

export type AudienceResult = { ok: boolean; provider: string; skipped?: boolean; error?: string };

export interface AudienceProvider {
  readonly name: string;
  subscribe(s: Subscriber): Promise<AudienceResult>;
  unsubscribe(email: string): Promise<AudienceResult>;
}

class LogOnlyAudience implements AudienceProvider {
  readonly name = "log-only";
  async subscribe(s: Subscriber): Promise<AudienceResult> {
    console.log(JSON.stringify({ event: "audience.subscribe", provider: this.name, stored: false, who: await tagOf(s.email), interests: s.interests, source: s.source, guide: s.guide, consentVersion: s.consentVersion, consentAt: s.consentAt, confirmedAt: s.confirmedAt }));
    return { ok: true, provider: this.name, skipped: true };
  }
  async unsubscribe(email: string): Promise<AudienceResult> {
    console.log(JSON.stringify({ event: "audience.unsubscribe", provider: this.name, stored: false, who: await tagOf(email) }));
    return { ok: true, provider: this.name, skipped: true };
  }
}

/**
 * Resend Audiences. The contact holds email, first name and the unsubscribed flag. Resend contacts
 * carry no interest tags in an audience, so interests, consent text and timestamps are recorded in the
 * structured log and the staff email. Per-interest sending needs either one audience per interest or
 * Resend global-contact properties (follow-up; do not create audiences before Jeramey's OK).
 */
class ResendAudience implements AudienceProvider {
  readonly name = "resend";
  constructor(private key: string, private audienceId: string) {}

  private async call(method: string, path: string, body: unknown): Promise<AudienceResult> {
    try {
      const res = await fetch(`https://api.resend.com/audiences/${encodeURIComponent(this.audienceId)}/contacts${path}`, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.key}` },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) {
        const error = oneLine(await res.text(), 200);
        console.error("audience: resend error", res.status, error);
        return { ok: false, provider: this.name, error: `resend ${res.status}` };
      }
      return { ok: true, provider: this.name };
    } catch (err) {
      return { ok: false, provider: this.name, error: err instanceof Error ? err.message : "request failed" };
    }
  }

  async subscribe(s: Subscriber) {
    const r = await this.call("POST", "", { email: s.email, first_name: s.name || undefined, unsubscribed: false });
    console.log(JSON.stringify({ event: "audience.subscribe", provider: this.name, ok: r.ok, who: await tagOf(s.email), interests: s.interests, source: s.source, guide: s.guide, consentVersion: s.consentVersion, consentAt: s.consentAt, confirmedAt: s.confirmedAt }));
    return r;
  }
  async unsubscribe(email: string) {
    // Resend accepts an email address in place of the contact id.
    const r = await this.call("PATCH", `/${encodeURIComponent(email)}`, { unsubscribed: true });
    console.log(JSON.stringify({ event: "audience.unsubscribe", provider: this.name, ok: r.ok, who: await tagOf(email) }));
    return r;
  }
}

/**
 * GHOST ADAPTER STUB (TOL-2896: Ghost hosting is a pending money decision, so nothing here is live).
 * When approved, implement against the Ghost Admin API:
 *   POST {GHOST_URL}/ghost/api/admin/members/   (Authorization: Ghost <JWT signed from GHOST_ADMIN_API_KEY "id:secret">)
 *   body: { members: [{ email, name, labels: interests.map(i => ({ name: i })), subscribed: true,
 *           newsletters: [{ id }], note: `consent ${consentVersion} ${consentAt}` }] }
 *   unsubscribe: PUT /members/{id}/ with { newsletters: [] }
 * Ghost labels would give the per-interest segmentation Resend audiences lack.
 * Select it with AUDIENCE_PROVIDER=ghost once implemented; until then this only logs.
 */
class GhostAudience implements AudienceProvider {
  readonly name = "ghost-stub";
  async subscribe(): Promise<AudienceResult> {
    console.error("audience: Ghost adapter is a stub (TOL-2896); subscriber not stored");
    return { ok: false, provider: this.name, error: "not implemented" };
  }
  async unsubscribe(): Promise<AudienceResult> {
    return { ok: false, provider: this.name, error: "not implemented" };
  }
}

export function getAudience(): AudienceProvider {
  if (process.env.AUDIENCE_PROVIDER === "ghost") return new GhostAudience();
  const key = process.env.RESEND_API_KEY;
  const audience = process.env.RESEND_AUDIENCE_ID;
  if (key && audience) return new ResendAudience(key, audience);
  return new LogOnlyAudience();
}
