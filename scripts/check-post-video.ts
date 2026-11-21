// post-video.ts must default to dry-run and refuse placeholders (TS-3293).
// Run: node --experimental-strip-types scripts/check-post-video.ts
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { instagramResumableStart } from "./content/meta.ts";

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

assert.deepEqual(instagramResumableStart({ id: "1789", upload_url: "https://rupload.example/v" }), {
  containerId: "1789",
  uploadUrl: "https://rupload.example/v",
});
assert.deepEqual(instagramResumableStart({ id: "1789", uri: "https://rupload.example/legacy" }), {
  containerId: "1789",
  uploadUrl: "https://rupload.example/legacy",
});
assert.throws(() => instagramResumableStart({ id: "1789" }), /missing id or upload URL/);

// Fake rupload endpoint: proves we can POST the binary with the headers post-video uses.
await new Promise<void>((resolve, reject) => {
  const data = Buffer.from("clip-bytes");
  const server = createServer((req, res) => {
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.end();
      return;
    }
    assert.equal(req.headers.authorization, "OAuth test-token");
    assert.equal(req.headers.offset, "0");
    assert.equal(req.headers.file_size, String(data.length));
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c as Buffer));
    req.on("end", () => {
      assert.equal(Buffer.concat(chunks).toString(), "clip-bytes");
      res.end();
      server.close(() => resolve());
    });
  });
  server.listen(0, async () => {
    const port = (server.address() as { port: number }).port;
    const { uploadUrl } = instagramResumableStart({ id: "c", upload_url: `http://127.0.0.1:${port}/bin` });
    const up = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: "OAuth test-token",
        offset: "0",
        file_size: String(data.length),
        "Content-Type": "application/octet-stream",
      },
      body: data,
    });
    assert.equal(up.status, 200);
  });
  server.on("error", reject);
});

console.log("post-video checks passed");