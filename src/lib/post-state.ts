// Posting state lives in Sanity documents of type "postState" (studio/post-state-schema.ts), not on the
// post. The site and n8n merge postState with any legacy post.results fields so old rows still work.

export type PostingLinks = {
  facebookUrl?: string;
  instagramUrl?: string;
  gbpUrl?: string;
};

export type PostStateRow = PostingLinks & {
  postId?: string;
  postedAt?: string;
  lastError?: string;
  claimedAt?: string;
};

const url = (v: unknown) => (typeof v === "string" && v.trim().startsWith("https://") ? v.trim() : undefined);

/** Canonical id for the postState document that belongs to a post. */
export const postStateDocumentId = (postId: string) => `postState.${postId}`;

/** Merge automation state with legacy links that may still live on the post document. postState wins. */
export function postingLinks(postState: PostingLinks | null | undefined, legacyResults: PostingLinks | null | undefined): PostingLinks {
  const leg = legacyResults ?? {};
  const st = postState ?? {};
  return {
    facebookUrl: url(st.facebookUrl) ?? url(leg.facebookUrl),
    instagramUrl: url(st.instagramUrl) ?? url(leg.instagramUrl),
    gbpUrl: url(st.gbpUrl) ?? url(leg.gbpUrl),
  };
}

export function hasPostedLink(links: PostingLinks): boolean {
  return !!(links.facebookUrl || links.instagramUrl || links.gbpUrl);
}

type Channel = "facebook" | "instagram" | "gbp";

const channelUrlKey = (channel: Channel): keyof PostingLinks =>
  channel === "gbp" ? "gbpUrl" : channel === "instagram" ? "instagramUrl" : "facebookUrl";

/** True when this channel still needs a publish attempt (automation skips when a link is already saved). */
export function channelStillNeedsPost(channel: Channel, channels: string[], links: PostingLinks): boolean {
  if (!channels.includes(channel)) return false;
  return !links[channelUrlKey(channel)];
}