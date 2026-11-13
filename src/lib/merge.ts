// Pure merge of CMS content over code defaults. No imports, so it can be unit-tested under plain node.

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

/**
 * Sanity wins wherever it has a real value; empty strings, nulls and empty arrays fall back to the default.
 * Arrays of objects merge item by item over the default item at the same index (or the last default item),
 * so a half-filled item added in the Studio can't render undefined fields or crash a page.
 */
export function mergeContent<T>(fallback: T, incoming: unknown): T {
  if (incoming === null || incoming === undefined || incoming === "") return fallback;
  if (Array.isArray(fallback)) {
    if (!Array.isArray(incoming) || incoming.length === 0) return fallback;
    const objects = fallback.length > 0 && fallback.every((x) => x && typeof x === "object" && !Array.isArray(x));
    if (!objects) return stripMeta(incoming.filter((x) => typeof x === typeof fallback[0] || fallback.length === 0)) as T;
    return incoming
      .filter((x) => x && typeof x === "object" && !Array.isArray(x))
      .map((x, i) => mergeContent(fallback[Math.min(i, fallback.length - 1)], x)) as T;
  }
  if (fallback && typeof fallback === "object") {
    if (typeof incoming !== "object" || Array.isArray(incoming)) return fallback;
    const out: Record<string, unknown> = { ...(fallback as Record<string, unknown>) };
    for (const [k, v] of Object.entries(incoming as Record<string, unknown>)) {
      if (k.startsWith("_") && k !== "_type") continue;
      out[k] = k in out ? mergeContent(out[k], v) : stripMeta(v);
    }
    return out as T;
  }
  return (typeof incoming === typeof fallback ? incoming : fallback) as T;
}

export function stripMeta<T>(v: T): T {
  if (Array.isArray(v)) return v.map(stripMeta) as T;
  if (v && typeof v === "object") {
    return Object.fromEntries(Object.entries(v as Record<string, Json>).filter(([k]) => !k.startsWith("_") || k === "_type").map(([k, x]) => [k, stripMeta(x)])) as T;
  }
  return v;
}
