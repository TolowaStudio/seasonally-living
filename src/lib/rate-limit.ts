// Small in-memory sliding-window limiter. Cloud Run may run several instances, so this is a
// best-effort brake against floods and form bots, not a hard quota. Per-IP, per-email and global
// caps together keep a single noisy client from burning the Resend allowance.

const hits = new Map<string, number[]>();
const MAX_KEYS = 5000;

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, retryAfter: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000)) };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > MAX_KEYS) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
    if (hits.size > MAX_KEYS) hits.clear();
  }
  return { ok: true, retryAfter: 0 };
}

/** Client address from the proxy chain (Cloud Run appends the real client to X-Forwarded-For). */
export function clientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[0].slice(0, 64);
  }
  return headers.get("x-real-ip")?.slice(0, 64) || "unknown";
}
