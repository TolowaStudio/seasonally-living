// post-video.ts must default to dry-run and refuse placeholders (TS-3293).
// Run: node --experimental-strip-types scripts/check-post-video.ts
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { instagramResumableStart } from "./content/meta.ts";
import { sendVideoToMeta } from "./content/video-send.ts";

const dir = mkdtempSync(join(tmpdir(), "sl-post-video-"));
const video = join(dir, "tiny.mp4");
const videoBytes = Buffer.from([0, 0, 0, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d]);
writeFileSync(video, videoBytes);

const blankEnv = {
  ...process.env,
  META_PAGE_ACCESS_TOKEN: "",
  META_PAGE_ACCESS_TOKEN_FILE: "",
  FACEBOOK_PAGE_ID: "",
  INSTAGRAM_BUSINESS_ACCOUNT_ID: "",
  META_GRAPH_ORIGIN: "",
};

const run = (extra: string[]) =>
  spawnSync("node", ["--experimental-strip-types", "scripts/content/post-video.ts", "--video", video, ...extra], {
    encoding: "utf8",
    env: blankEnv,
  });

const dry = run(["--dry-run", "--facebook", "A short shop video."]);
assert.equal(dry.status, 0, dry.stderr);
assert.match(dry.stdout, /dry run/i);
assert.match(dry.stdout, /Nothing was posted/i);

const bad = run(["--dry-run", "--facebook", "Still [[ADD: something]]"]);
assert.notEqual(bad.status, 0, "placeholders must be refused");

const needToken = run(["--send", "--facebook", "ok", "--instagram", "ok ig"]);
assert.notEqual(needToken.status, 0, "--send without token must fail");

const emptySend = run(["--send", "--facebook", "", "--instagram", ""]);
assert.notEqual(emptySend.status, 0, "empty copy on --send must fail");
assert.match(emptySend.stderr + emptySend.stdout, /empty/i);

assert.deepEqual(instagramResumableStart({ id: "1789", upload_url: "https://rupload.example/v" }), {
  containerId: "1789",
  uploadUrl: "https://rupload.example/v",
});
assert.throws(() => instagramResumableStart({ id: "1789" }), /missing id or upload URL/);

// Mock Graph: exercises sendVideoToMeta (same code path as post-video --send).
await new Promise<void>((resolve, reject) => {
  let igContainer = "";
  const want: { igStart?: URLSearchParams; igPublish?: URLSearchParams; fbMultipart?: string } = {};

  const readBody = (req: IncomingMessage) =>
    new Promise<Buffer>((res, rej) => {
      const chunks: Buffer[] = [];
      req.on("data", (c) => chunks.push(c as Buffer));
      req.on("end", () => res(Buffer.concat(chunks)));
      req.on("error", rej);
    });

  const server = createServer(async (req, res: ServerResponse) => {
    try {
      const url = new URL(req.url ?? "/", "http://127.0.0.1");
      const body = await readBody(req);
      if (url.pathname === "/v23.0/ig-user/media" && req.method === "POST") {
        want.igStart = new URLSearchParams(body.toString());
        igContainer = "ig-container-3293";
        const uploadUrl = `http://127.0.0.1:${port}/rupload`;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ id: igContainer, upload_url: uploadUrl }));
        return;
      }
      if (url.pathname === "/rupload" && req.method === "POST") {
        if (req.headers.authorization !== "OAuth test-token") {
          res.statusCode = 403;
          res.end();
          return;
        }
        assert.equal(req.headers.file_size, String(videoBytes.length));
        assert.equal(body.compare(videoBytes), 0);
        res.statusCode = 200;
        res.end();
        return;
      }
      if (url.pathname === "/v23.0/ig-user/media_publish" && req.method === "POST") {
        want.igPublish = new URLSearchParams(body.toString());
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ id: "ig-published-3293" }));
        return;
      }
      if (url.pathname === "/v23.0/fb-page/videos" && req.method === "POST") {
        want.fbMultipart = body.toString("latin1");
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ id: "fb-video-3293" }));
        return;
      }
      res.statusCode = 404;
      res.end();
    } catch (e) {
      server.close();
      reject(e);
    }
  });

  let port = 0;
  server.listen(0, "127.0.0.1", async () => {
    port = (server.address() as { port: number }).port;
    process.env.META_GRAPH_ORIGIN = `http://127.0.0.1:${port}`;
    try {
      const result = await sendVideoToMeta({
        token: "test-token",
        version: "v23.0",
        facebookPageId: "fb-page",
        instagramBusinessAccountId: "ig-user",
        videoPath: video,
        facebook: "FB copy for the tub video.",
        igCaption: "IG caption #wenatchee",
        channels: ["instagram", "facebook"],
        fetchFn: fetch,
      });
      assert.equal(result.instagramId, "ig-published-3293");
      assert.equal(result.facebookId, "fb-video-3293");
      assert.equal(want.igStart?.get("media_type"), "REELS");
      assert.equal(want.igStart?.get("upload_type"), "resumable");
      assert.equal(want.igStart?.get("caption"), "IG caption #wenatchee");
      assert.equal(want.igPublish?.get("creation_id"), igContainer);
      assert.match(want.fbMultipart ?? "", /FB copy for the tub video/);
      assert.match(want.fbMultipart ?? "", /name="source"/);
      server.close(() => resolve());
    } catch (e) {
      server.close();
      reject(e);
    } finally {
      delete process.env.META_GRAPH_ORIGIN;
    }
  });
  server.on("error", reject);
});

console.log("post-video checks passed");