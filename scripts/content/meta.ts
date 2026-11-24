// Meta Graph helpers for shop video posts (TS-3293). Tokens are never printed.
import { readFileSync } from "node:fs";

export function metaAccessToken(): string {
  const direct = process.env.META_PAGE_ACCESS_TOKEN?.trim();
  if (direct) return direct;
  const file = process.env.META_PAGE_ACCESS_TOKEN_FILE;
  if (file) return readFileSync(file, "utf8").trim();
  throw new Error(
    "No Meta Page token. Set META_PAGE_ACCESS_TOKEN or META_PAGE_ACCESS_TOKEN_FILE.\n" +
      "Store the token in GCP Secret Manager / n8n credentials — never commit it.",
  );
}

export function metaConfig() {
  const version = process.env.META_GRAPH_VERSION?.trim() || "v23.0";
  const facebookPageId = process.env.FACEBOOK_PAGE_ID?.trim();
  const instagramBusinessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim();
  if (!facebookPageId || !instagramBusinessAccountId) {
    throw new Error("Set FACEBOOK_PAGE_ID and INSTAGRAM_BUSINESS_ACCOUNT_ID (see automation/README.md).");
  }
  return { version, facebookPageId, instagramBusinessAccountId };
}

export function graphUrl(path: string, version: string) {
  const origin = (process.env.META_GRAPH_ORIGIN ?? "https://graph.facebook.com").replace(/\/$/, "");
  const prefix = path.startsWith("/") ? path : `/${path}`;
  return `${origin}/${version}${prefix}`;
}

/** Meta resumable IG upload start response (REELS). Docs use `upload_url`; some responses use `uri`. */
export type InstagramResumableStartBody = {
  id?: string;
  upload_url?: string;
  uri?: string;
  error?: { message: string };
};

export function instagramResumableStart(body: InstagramResumableStartBody): { containerId: string; uploadUrl: string } {
  const uploadUrl = body.upload_url ?? body.uri;
  const containerId = body.id;
  if (!containerId || !uploadUrl) {
    throw new Error(
      `Instagram resumable start missing id or upload URL (got id=${body.id ?? "null"}, upload_url=${body.upload_url ?? "null"}, uri=${body.uri ?? "null"})`,
    );
  }
  return { containerId, uploadUrl };
}