// Post an approved shop video to Facebook and Instagram (Meta Graph API). PUBLIC SEND.
//
//   node --experimental-strip-types scripts/content/post-video.ts --video clip.mp4 [options]
//
// Options
//   --draft-json <file>   JSON from draft-from-transcript / draft-week (reads social.*)
//   --facebook "text"     Facebook description (overrides draft)
//   --instagram "text"    Instagram caption + hashtags from draft if omitted
//   --srt <file>          SRT for Facebook closed captions (optional)
//   --dry-run             Default. Prints the plan, no network (except you passed --send).
//   --send                Actually upload. Requires Meta token + page ids; needs Jeramey go-ahead.
//
// Storage: videos stay on disk under out/content-drafts/video/ (gitignored). No Google Drive upload.
import { readFileSync, statSync } from "node:fs";
import { basename } from "node:path";
import {
  instagramResumableStart,
  metaAccessToken,
  metaConfig,
  graphUrl,
  type InstagramResumableStartBody,
} from "./meta.ts";

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").filter((l) => l.startsWith("//")).map((l) => l.slice(3)).join("\n"));
  process.exit(0);
}

const opt = (name: string) => {
  const i = args.indexOf(`--${name}`);
  if (i < 0) return undefined;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) throw new Error(`--${name} needs a value`);
  return v;
};
const send = args.includes("--send");
const dryRun = !send;

const video = opt("video");
if (!video) throw new Error("Pass --video <file.mp4>");
if (!statSync(video).isFile()) throw new Error(`Not a file: ${video}`);

type Social = { facebook?: string; instagram?: { caption: string; hashtags: string[] } };
let social: Social = {};
const draftJson = opt("draft-json");
if (draftJson) {
  const doc = JSON.parse(readFileSync(draftJson, "utf8")) as { social?: Social };
  social = doc.social ?? {};
}

const facebook = opt("facebook") ?? social.facebook ?? "";
const igCaption =
  opt("instagram") ??
  [social.instagram?.caption, ...(social.instagram?.hashtags ?? []).map((h) => (h.startsWith("#") ? h : `#${h}`))].filter(Boolean).join("\n\n");
const srt = opt("srt");

const unsafe = (t: string) => /\[\[|TODO|lorem/i.test(t);
if (facebook && unsafe(facebook)) throw new Error("Facebook text still has placeholders; fix before sending.");
if (igCaption && unsafe(igCaption)) throw new Error("Instagram caption still has placeholders; fix before sending.");

const size = statSync(video).size;
const plan = {
  video: basename(video),
  bytes: size,
  facebookDescription: facebook.slice(0, 120) + (facebook.length > 120 ? "…" : ""),
  instagramPreview: igCaption.slice(0, 120) + (igCaption.length > 120 ? "…" : ""),
  srt: srt ?? null,
  mode: dryRun ? "dry-run" : "send",
};

if (dryRun) {
  console.log("post-video: dry run (pass --send to upload). Nothing was posted.\n", JSON.stringify(plan, null, 2));
  process.exit(0);
}

const token = metaAccessToken();
const { version, facebookPageId, instagramBusinessAccountId } = metaConfig();

async function uploadFacebookPageVideo(): Promise<{ id: string }> {
  const form = new FormData();
  form.append("access_token", token);
  form.append("description", facebook);
  form.append("source", new Blob([readFileSync(video)]), basename(video));
  if (srt) {
    form.append("subtitles[en_US]", new Blob([readFileSync(srt)]), basename(srt));
  }
  const res = await fetch(graphUrl(`/${facebookPageId}/videos`, version), { method: "POST", body: form });
  const body = (await res.json()) as { id?: string; error?: { message: string } };
  if (!res.ok || !body.id) throw new Error(`Facebook upload failed: ${body.error?.message ?? res.status}`);
  return { id: body.id };
}

/** Instagram Reels resumable upload (local file → Graph container → publish). */
async function uploadInstagramReel(): Promise<{ id: string }> {
  const start = await fetch(graphUrl(`/${instagramBusinessAccountId}/media`, version), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      access_token: token,
      media_type: "REELS",
      upload_type: "resumable",
      caption: igCaption,
    }),
  });
  const startBody = (await start.json()) as InstagramResumableStartBody;
  if (!start.ok) throw new Error(`Instagram resumable start failed: ${startBody.error?.message ?? start.status}`);
  const { containerId, uploadUrl } = instagramResumableStart(startBody);

  const buf = readFileSync(video);
  const up = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${token}`,
      offset: "0",
      file_size: String(buf.length),
      "Content-Type": "application/octet-stream",
    },
    body: buf,
  });
  if (!up.ok) {
    const t = await up.text();
    throw new Error(`Instagram binary upload failed: ${up.status} ${t.slice(0, 200)}`);
  }

  const pub = await fetch(graphUrl(`/${instagramBusinessAccountId}/media_publish`, version), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ access_token: token, creation_id: containerId }),
  });
  const pubBody = (await pub.json()) as { id?: string; error?: { message: string } };
  if (!pub.ok || !pubBody.id) throw new Error(`Instagram publish failed: ${pubBody.error?.message ?? pub.status}`);
  return { id: pubBody.id };
}

console.log(`post-video: uploading ${basename(video)} (${size} bytes)…`);
const fb = await uploadFacebookPageVideo();
console.log(`  Facebook video id: ${fb.id}`);
const ig = await uploadInstagramReel();
console.log(`  Instagram media id: ${ig.id}`);
console.log("post-video: done. Check both feeds; links are not looked up in this script.");