// Post an approved shop video to Facebook and Instagram (Meta Graph API). PUBLIC SEND.
//
//   node --experimental-strip-types scripts/content/post-video.ts --video clip.mp4 [options]
//
// Options
//   --draft-json <file>   JSON from draft-from-transcript / draft-week (reads social.*)
//   --facebook "text"     Facebook description (overrides draft)
//   --instagram "text"    Instagram caption + hashtags from draft if omitted
//   --srt <file>          SRT for Facebook closed captions (optional)
//   --channels fb,ig      Default facebook,instagram. Either name alone is ok.
//   --dry-run             Default. Prints the plan, no network (except you passed --send).
//   --send                Actually upload. Requires Meta token + page ids; needs Jeramey go-ahead.
//
// Storage: videos stay on disk under out/content-drafts/video/ (gitignored). No Google Drive upload.
import { readFileSync, statSync } from "node:fs";
import { basename } from "node:path";
import { metaAccessToken, metaConfig } from "./meta.ts";
import { assertSendCopy, sendVideoToMeta, type VideoChannel } from "./video-send.ts";

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
try {
  if (!statSync(video).isFile()) throw new Error(`Not a file: ${video}`);
} catch (e) {
  if (e && typeof e === "object" && "code" in e && (e as NodeJS.ErrnoException).code === "ENOENT") {
    throw new Error(`Not a file: ${video}`);
  }
  throw e;
}

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

const parseChannels = (raw: string | undefined): VideoChannel[] => {
  const parts = (raw ?? "facebook,instagram")
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  const out: VideoChannel[] = [];
  for (const p of parts) {
    if (p === "facebook" || p === "fb") out.push("facebook");
    else if (p === "instagram" || p === "ig") out.push("instagram");
    else throw new Error(`Unknown channel ${p} (use facebook, instagram, fb, or ig)`);
  }
  if (!out.length) throw new Error("--channels needs at least one of facebook or instagram");
  return [...new Set(out)];
};
const channels = parseChannels(opt("channels"));

const size = statSync(video).size;
const plan = {
  video: basename(video),
  bytes: size,
  channels,
  facebookDescription: facebook.slice(0, 120) + (facebook.length > 120 ? "…" : ""),
  instagramPreview: igCaption.slice(0, 120) + (igCaption.length > 120 ? "…" : ""),
  srt: srt ?? null,
  mode: dryRun ? "dry-run" : "send",
};

if (dryRun) {
  console.log("post-video: dry run (pass --send to upload). Nothing was posted.\n", JSON.stringify(plan, null, 2));
  process.exit(0);
}

assertSendCopy({ channels, facebook, igCaption });
const token = metaAccessToken();
const { version, facebookPageId, instagramBusinessAccountId } = metaConfig();

console.log(`post-video: uploading ${basename(video)} (${size} bytes) to ${channels.join(", ")}…`);
const result = await sendVideoToMeta({
  token,
  version,
  facebookPageId,
  instagramBusinessAccountId,
  videoPath: video,
  facebook,
  igCaption,
  srt,
  channels,
});
if (result.facebookId) console.log(`  Facebook video id: ${result.facebookId}`);
if (result.instagramId) console.log(`  Instagram media id: ${result.instagramId}`);
console.log("post-video: done. Check both feeds; links are not looked up in this script.");