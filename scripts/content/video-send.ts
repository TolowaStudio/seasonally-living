// Meta Graph video upload (Facebook Page + Instagram Reels). Used by post-video.ts; tested with a mock Graph.
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { graphUrl, instagramResumableStart, type InstagramResumableStartBody } from "./meta.ts";

export type VideoChannel = "facebook" | "instagram";

export type VideoSendInput = {
  token: string;
  version: string;
  facebookPageId: string;
  instagramBusinessAccountId: string;
  videoPath: string;
  facebook: string;
  igCaption: string;
  srt?: string;
  channels: VideoChannel[];
  fetchFn?: typeof fetch;
};

/** Refuse a public send with empty copy for a channel that is actually being posted. */
export function assertSendCopy(input: Pick<VideoSendInput, "channels" | "facebook" | "igCaption">) {
  if (input.channels.includes("facebook") && !input.facebook.trim()) {
    throw new Error("Refusing Facebook send: description is empty.");
  }
  if (input.channels.includes("instagram") && !input.igCaption.trim()) {
    throw new Error("Refusing Instagram send: caption is empty.");
  }
}

export async function sendVideoToMeta(input: VideoSendInput): Promise<{ facebookId?: string; instagramId?: string }> {
  const fetchFn = input.fetchFn ?? fetch;
  assertSendCopy(input);
  const videoBytes = readFileSync(input.videoPath);
  const out: { facebookId?: string; instagramId?: string } = {};

  // Instagram first so a failed Reels step does not leave Facebook already live.
  if (input.channels.includes("instagram")) {
    const start = await fetchFn(graphUrl(`/${input.instagramBusinessAccountId}/media`, input.version), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        access_token: input.token,
        media_type: "REELS",
        upload_type: "resumable",
        caption: input.igCaption,
      }),
    });
    const startBody = (await start.json()) as InstagramResumableStartBody;
    if (!start.ok) throw new Error(`Instagram resumable start failed: ${startBody.error?.message ?? start.status}`);
    const { containerId, uploadUrl } = instagramResumableStart(startBody);

    const up = await fetchFn(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `OAuth ${input.token}`,
        offset: "0",
        file_size: String(videoBytes.length),
        "Content-Type": "application/octet-stream",
      },
      body: videoBytes,
    });
    if (!up.ok) throw new Error(`Instagram binary upload failed: ${up.status}`);

    const pub = await fetchFn(graphUrl(`/${input.instagramBusinessAccountId}/media_publish`, input.version), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ access_token: input.token, creation_id: containerId }),
    });
    const pubBody = (await pub.json()) as { id?: string; error?: { message: string } };
    if (!pub.ok || !pubBody.id) throw new Error(`Instagram publish failed: ${pubBody.error?.message ?? pub.status}`);
    out.instagramId = pubBody.id;
  }

  if (input.channels.includes("facebook")) {
    const form = new FormData();
    form.append("access_token", input.token);
    form.append("description", input.facebook);
    form.append("source", new Blob([videoBytes]), basename(input.videoPath));
    if (input.srt) {
      form.append("subtitles[en_US]", new Blob([readFileSync(input.srt)]), basename(input.srt));
    }
    const res = await fetchFn(graphUrl(`/${input.facebookPageId}/videos`, input.version), { method: "POST", body: form });
    const body = (await res.json()) as { id?: string; error?: { message: string } };
    if (!res.ok || !body.id) throw new Error(`Facebook upload failed: ${body.error?.message ?? res.status}`);
    out.facebookId = body.id;
  }

  return out;
}