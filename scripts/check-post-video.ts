// post-video.ts must default to dry-run and refuse placeholders (TS-3293).
// Run: node --experimental-strip-types scripts/check-post-video.ts
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "sl-post-video-"));
const video = join(dir, "tiny.mp4");
writeFileSync(video, Buffer.from([0, 0, 0, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d])); // minimal ftyp header

const run = (extra: string[]) =>
  spawnSync("node", ["--experimental-strip-types", "scripts/content/post-video.ts", "--video", video, ...extra], {
    encoding: "utf8",
    env: { ...process.env, META_PAGE_ACCESS_TOKEN: "", FACEBOOK_PAGE_ID: "", INSTAGRAM_BUSINESS_ACCOUNT_ID: "" },
  });

const dry = run(["--dry-run", "--facebook", "A short shop video."]);
assert.equal(dry.status, 0, dry.stderr);
assert.match(dry.stdout, /dry run/i);
assert.match(dry.stdout, /Nothing was posted/i);

const bad = run(["--dry-run", "--facebook", "Still [[ADD: something]]"]);
assert.notEqual(bad.status, 0, "placeholders must be refused");

const needToken = run(["--send", "--facebook", "ok"]);
assert.notEqual(needToken.status, 0, "--send without token must fail");

console.log("post-video checks passed");