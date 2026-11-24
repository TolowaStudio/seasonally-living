import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { mailConfigured, resolveEmailProvider, sendMail } from "./mail.ts";

const ENV_KEYS = ["EMAIL_PROVIDER", "RESEND_API_KEY", "POSTMARK_SERVER_TOKEN", "NODE_ENV", "POSTMARK_MESSAGE_STREAM"] as const;

function saveEnv() {
  const snap: Record<string, string | undefined> = {};
  for (const k of ENV_KEYS) snap[k] = process.env[k];
  return snap;
}

function restoreEnv(snap: Record<string, string | undefined>) {
  for (const k of ENV_KEYS) {
    if (snap[k] === undefined) delete process.env[k];
    else process.env[k] = snap[k];
  }
}

let envSnap: Record<string, string | undefined>;
let fetchCalls: { url: string; init: RequestInit }[];

beforeEach(() => {
  envSnap = saveEnv();
  fetchCalls = [];
  mock.method(globalThis, "fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    fetchCalls.push({ url, init: init ?? {} });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  });
});

afterEach(() => {
  restoreEnv(envSnap);
  mock.restoreAll();
});

test("resolveEmailProvider: unset and resend use resend", () => {
  delete process.env.EMAIL_PROVIDER;
  assert.equal(resolveEmailProvider(), "resend");
  process.env.EMAIL_PROVIDER = "resend";
  assert.equal(resolveEmailProvider(), "resend");
});

test("resolveEmailProvider: unknown falls back to resend with warning", () => {
  const warns: unknown[] = [];
  const original = console.warn;
  console.warn = (...args: unknown[]) => {
    warns.push(args);
  };
  try {
    process.env.EMAIL_PROVIDER = "mailgun";
    assert.equal(resolveEmailProvider(), "resend");
    assert.match(String(warns[0]?.[0]), /unknown EMAIL_PROVIDER/);
  } finally {
    console.warn = original;
  }
});

test("mailConfigured reflects active provider credentials", () => {
  delete process.env.EMAIL_PROVIDER;
  delete process.env.RESEND_API_KEY;
  delete process.env.POSTMARK_SERVER_TOKEN;
  assert.equal(mailConfigured(), false);

  process.env.RESEND_API_KEY = "re_test";
  assert.equal(mailConfigured(), true);

  process.env.EMAIL_PROVIDER = "postmark";
  delete process.env.RESEND_API_KEY;
  assert.equal(mailConfigured(), false);
  process.env.POSTMARK_SERVER_TOKEN = "pm_test";
  assert.equal(mailConfigured(), true);
});

test("sendMail uses Resend when EMAIL_PROVIDER is unset", async () => {
  delete process.env.EMAIL_PROVIDER;
  process.env.RESEND_API_KEY = "re_test";
  process.env.NODE_ENV = "test";

  const result = await sendMail({ to: "lead@example.com", subject: "Hello", text: "Body" });
  assert.equal(result.ok, true);
  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0]!.url, "https://api.resend.com/emails");
  const headers = fetchCalls[0]!.init.headers as Record<string, string>;
  assert.equal(headers.Authorization, "Bearer re_test");
});

test("sendMail uses Postmark API with outbound stream when EMAIL_PROVIDER=postmark", async () => {
  process.env.EMAIL_PROVIDER = "postmark";
  process.env.POSTMARK_SERVER_TOKEN = "pm_server_token";
  process.env.NODE_ENV = "test";

  const result = await sendMail({
    to: ["a@example.com", "b@example.com"],
    subject: "Hi",
    text: "Plain",
    html: "<p>Hi</p>",
    replyTo: "sales@seasonallyliving.com",
    headers: { "X-Custom": "1" },
  });
  assert.equal(result.ok, true);
  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0]!.url, "https://api.postmarkapp.com/email");
  const headers = fetchCalls[0]!.init.headers as Record<string, string>;
  assert.equal(headers["X-Postmark-Server-Token"], "pm_server_token");
  const body = JSON.parse(String(fetchCalls[0]!.init.body));
  assert.equal(body.MessageStream, "outbound");
  assert.equal(body.To, "a@example.com,b@example.com");
  assert.equal(body.ReplyTo, "sales@seasonallyliving.com");
  assert.deepEqual(body.Headers, [{ Name: "X-Custom", Value: "1" }]);
});

test("sendMail skips when provider key is missing", async () => {
  process.env.EMAIL_PROVIDER = "postmark";
  delete process.env.POSTMARK_SERVER_TOKEN;
  process.env.NODE_ENV = "development";

  const logs: unknown[] = [];
  const original = console.log;
  console.log = (...args: unknown[]) => {
    logs.push(args);
  };
  try {
    const result = await sendMail({ to: "x@example.com", subject: "S", text: "T" });
    assert.equal(result.skipped, true);
    assert.equal(fetchCalls.length, 0);
    assert.ok(logs.some((line) => String(line[0]).includes("MAIL (dev, not sent)")));
  } finally {
    console.log = original;
  }
});