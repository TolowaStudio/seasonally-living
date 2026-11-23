// Subscription-backed writer for draft-week and draft-from-transcript (TS-4129).
// Tries, in order: Claude Max (`claude -p`), Gemini Neon (`neon` / Antigravity), Composer (`agent -p`).
// No paid Anthropic API key. Injectable tiers for check-weekly-draft.ts.
import { spawnSync } from "node:child_process";
import type { Draft } from "./lib.ts";

const STRIPPED_ENV_KEYS = [
  ["ANTHROPIC", "API", "KEY"].join("_"),
  ["ANTHROPIC", "API", "KEY", "FILE"].join("_"),
] as const;

/** Child process env for subscription CLIs — never pass paid API keys through. */
export function subscriptionWriterEnv(base: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  const env = { ...base };
  for (const key of STRIPPED_ENV_KEYS) delete env[key];
  return env;
}

export type WriterTier = "claude-max" | "neon" | "composer";

export type WriterCallOpts = { model: string; user: string; maxTokens?: number };
export type WriterCallResult = { draft: Draft; usage: { input: number; output: number }; tier: WriterTier; model: string };

export type TierAttempt = {
  tier: WriterTier;
  run: (opts: WriterCallOpts) => WriterCallResult;
};

const JSON_RULES = `Respond with ONLY one JSON object (no markdown fence, no commentary) with fields:
title, excerpt, tags (array of line tags), body_markdown, facebook, instagram_caption, instagram_hashtags (array),
gbp_text, gbp_cta (LEARN_MORE|CALL|BOOK|ORDER|SHOP|SIGN_UP), video_hook (optional), needs_confirm (array).
All required fields must be present.`;

export function refuseUnattendedModel(model: string): void {
  if (/opus|fable/i.test(model)) {
    throw new Error(`refusing ${model}: unattended runs use Haiku or Sonnet only`);
  }
}

export function claudeSubscriptionModel(model: string): "haiku" | "sonnet" {
  refuseUnattendedModel(model);
  if (/sonnet/i.test(model)) return "sonnet";
  return "haiku";
}

export function isTierFallbackError(stderr: string, exitCode: number | null, signal: NodeJS.Signals | null): boolean {
  if (signal) return true;
  if (exitCode === 127 || exitCode === 126) return true;
  const s = stderr.toLowerCase();
  return (
    /rate.?limit|usage limit|overloaded|429|529|quota|too many requests|auth|login|sign.?in|not found|enoent|permission denied|subscription/.test(
      s,
    ) || exitCode === 1
  );
}

export function extractJsonObject(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  const fence = /```(?:json)?\s*([\s\S]*?)```/i.exec(trimmed);
  const body = fence?.[1]?.trim() ?? trimmed;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Model output contained no JSON object");
  return JSON.parse(body.slice(start, end + 1)) as Record<string, unknown>;
}

function writerPrompt(user: string): string {
  return `${user}\n\n${JSON_RULES}\n\nReturn the draft as JSON only.`;
}

function parseCliDraft(stdout: string, stderr: string, exitCode: number | null, signal: NodeJS.Signals | null, label: string): Record<string, unknown> {
  if (signal) throw new Error(`${label}: killed by ${signal}`);
  if (exitCode !== 0) {
    const err = new Error(`${label} exited ${exitCode}: ${stderr.slice(0, 400)}`);
    (err as Error & { fallback?: boolean }).fallback = isTierFallbackError(stderr, exitCode, signal);
    throw err;
  }
  try {
    return extractJsonObject(stdout);
  } catch (e) {
    const err = new Error(`${label}: could not parse draft JSON (${e instanceof Error ? e.message : e})`);
    (err as Error & { fallback?: boolean }).fallback = true;
    throw err;
  }
}

function claudeTextFromJson(stdout: string | null): string {
  if (!stdout?.trim()) return "";
  const lines = stdout.trim().split("\n").filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const row = JSON.parse(lines[i]!) as { type?: string; result?: string; message?: { content?: { type: string; text?: string }[] } };
      if (row.type === "result" && typeof row.result === "string" && row.result.trim()) return row.result;
      if (row.type === "assistant" && row.message?.content) {
        const text = row.message.content.find((c) => c.type === "text")?.text;
        if (text?.trim()) return text;
      }
    } catch {
      /* not json line */
    }
  }
  return stdout;
}

export function runClaudeMaxTier(opts: WriterCallOpts): WriterCallResult {
  const claudeModel = claudeSubscriptionModel(opts.model);
  const prompt = writerPrompt(opts.user);
  const run = spawnSync("claude", ["-p", prompt, "--model", claudeModel, "--output-format", "json"], {
    encoding: "utf8",
    timeout: 120_000,
    env: subscriptionWriterEnv(),
  });
  if (run.error) {
    const code = (run.error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      const err = new Error("claude-max: claude not on PATH");
      (err as Error & { fallback?: boolean }).fallback = true;
      throw err;
    }
    throw run.error;
  }
  const text = claudeTextFromJson(run.stdout);
  const raw = parseCliDraft(text, run.stderr ?? "", run.status, run.signal, "claude-max");
  return { draft: raw as Draft, usage: { input: 0, output: 0 }, tier: "claude-max", model: claudeModel };
}

export function runNeonTier(opts: WriterCallOpts): WriterCallResult {
  const bin = process.env.DRAFT_NEON_BIN?.trim() || "neon";
  const prompt = writerPrompt(opts.user);
  const args = (process.env.DRAFT_NEON_ARGS?.trim() ? process.env.DRAFT_NEON_ARGS.trim().split(/\s+/) : ["-p"]).concat([prompt]);
  const run = spawnSync(bin, args, {
    encoding: "utf8",
    timeout: 120_000,
    shell: false,
    env: subscriptionWriterEnv(),
  });
  if (run.error && (run.error as NodeJS.ErrnoException).code === "ENOENT") {
    const err = new Error(`neon tier: ${bin} not on PATH`);
    (err as Error & { fallback?: boolean }).fallback = true;
    throw err;
  }
  const raw = parseCliDraft(run.stdout, run.stderr, run.status, run.signal, "neon");
  return { draft: raw as Draft, usage: { input: 0, output: 0 }, tier: "neon", model: "neon" };
}

export function runComposerTier(opts: WriterCallOpts): WriterCallResult {
  const bin = process.env.DRAFT_COMPOSER_BIN?.trim() || "agent";
  const prompt = writerPrompt(opts.user);
  const run = spawnSync(bin, ["-p", "--output-format", "text", "--mode", "ask", prompt], {
    encoding: "utf8",
    timeout: 120_000,
    env: subscriptionWriterEnv(),
  });
  if (run.error && (run.error as NodeJS.ErrnoException).code === "ENOENT") {
    const err = new Error(`composer tier: ${bin} not on PATH`);
    (err as Error & { fallback?: boolean }).fallback = true;
    throw err;
  }
  const raw = parseCliDraft(run.stdout, run.stderr, run.status, run.signal, "composer");
  return { draft: raw as Draft, usage: { input: 0, output: 0 }, tier: "composer", model: "composer" };
}

export const DEFAULT_WRITER_TIERS: TierAttempt[] = [
  { tier: "claude-max", run: runClaudeMaxTier },
  { tier: "neon", run: runNeonTier },
  { tier: "composer", run: runComposerTier },
];

export function runWriterTiers(opts: WriterCallOpts, tiers: TierAttempt[] = DEFAULT_WRITER_TIERS): WriterCallResult {
  if (process.env.DRAFT_WRITER_FORBIDDEN === "1") {
    throw new Error("DRAFT_WRITER_FORBIDDEN: a dry run or test must not call the writer");
  }
  refuseUnattendedModel(opts.model);
  const errors: string[] = [];
  for (const t of tiers) {
    try {
      const result = t.run(opts);
      return { ...result, tier: t.tier };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const fallback = e instanceof Error && (e as Error & { fallback?: boolean }).fallback;
      errors.push(`${t.tier}: ${msg}`);
      if (fallback === false) throw e;
    }
  }
  throw new Error(`No subscription writer tier available (tried ${tiers.map((t) => t.tier).join(" → ")}).\n${errors.join("\n")}`);
}

export function tierLabel(tier: WriterTier, requestedModel: string): string {
  switch (tier) {
    case "claude-max":
      return `claude-max (${claudeSubscriptionModel(requestedModel)})`;
    case "neon":
      return "neon (antigravity)";
    case "composer":
      return "composer (cursor agent)";
    default: {
      const _never: never = tier;
      return _never;
    }
  }
}
