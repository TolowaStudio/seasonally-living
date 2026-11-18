import { createClient } from "@sanity/client";

// The ONE Sanity read client for the site (TOL-3348). Both src/lib/sanity.ts and src/lib/journal.ts use it.
//
// Why one place: the "production" dataset is public today, so reads need no token. To make it private
// (so staff can enter real pre-owned costs), every read must send a token. With a single client that is a
// one-env-var change (SANITY_READ_TOKEN) instead of an edit in each caller, and scripts/check-sanity-access.ts
// fails CI if anyone builds a second client that would silently stay anonymous and start returning nothing.
//
// SANITY_READ_TOKEN is a server-only env name on purpose (no NEXT_PUBLIC_ prefix): Next.js never inlines it
// into browser code. Use a Viewer-role token, not Editor; this client only reads.

export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "83r23z7t";
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const SANITY_API_VERSION = "2025-01-01";

/** Client options for the given env. Pure, so the check script can assert on it without a network. */
export function sanityClientConfig(env: Record<string, string | undefined> = process.env) {
  const token = env.SANITY_READ_TOKEN?.trim();
  return {
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || "83r23z7t",
    dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: SANITY_API_VERSION,
    // The API CDN serves private datasets too when the request carries a token, so keep it on.
    useCdn: true,
    perspective: "published" as const,
    ...(token ? { token } : {}),
  };
}

export const sanityClient = createClient(sanityClientConfig());

/** Log text for a failed read. A 401/403 gets a pointer to the likely cause, because every caller falls back to
 *  the code defaults: without this hint a private dataset with no token looks like "the site just shows old copy". */
export function describeSanityError(err: unknown, env: Record<string, string | undefined> = process.env): string {
  const msg = err instanceof Error ? err.message : String(err);
  const status = (err as { statusCode?: number } | null)?.statusCode;
  if (status === 401 || status === 403) {
    return `${msg} [HTTP ${status}: ${env.SANITY_READ_TOKEN?.trim() ? "SANITY_READ_TOKEN was rejected (wrong project or revoked)" : "dataset looks private and SANITY_READ_TOKEN is not set"}; serving code defaults]`;
  }
  return msg;
}
