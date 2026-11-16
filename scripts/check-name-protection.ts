// Run: node --experimental-strip-types scripts/check-name-protection.ts   (TOL-2907)
// Protects the 40-year name and the one public story. Fails when:
//   1. the public name stops being "Seasonally Living by Chim Chimney" (it is not a rebrand), or the 1979 history is dropped;
//   2. showroom hours are stated anywhere in src/ other than the single siteSettings source (the live Squarespace site
//      says 10-4 in the footer and 10-5 on /contact: one source stops that coming back);
//   3. a line the owners no longer carry (Cal Saunas, Cal Flame, outdoor kitchens, Marquis, River Pools, ATV swim spas)
//      is offered in public copy;
//   4. a page the live Squarespace site serves today (inventory 2026-11-15) neither exists nor redirects, so an old
//      Google result or listing would 404 once seasonallyliving.com points at this site.
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Paths linked from the live Squarespace home page on 2026-11-15 (docs/TOL-2907-name-protection.md, section 2). */
export const LEGACY_SQUARESPACE_PATHS = [
  "/about",
  "/cal-saunas",
  "/calflame",
  "/calspas",
  "/cart",
  "/construction-design-services",
  "/contact",
  "/electric-fireplaces",
  "/fireplace-stove",
  "/fireplacestoves-options",
  "/gas-fireplace",
  "/hearth-supplies",
  "/home-resort",
  "/pool-spa-care",
  "/spas",
  "/swim-pro",
  "/wood-fireplaces",
];

/** Lines the owners confirmed are no longer carried; public copy must not offer them. */
export const NOT_CARRIED = [/cal\s?saunas?/i, /cal\s?flame/i, /outdoor kitchens?/i, /marquis/i, /river\s?pools/i, /\bATV\b/, /\batv swim/i];

/** Showroom hours belong to siteSettings alone. Matches "10am – 4pm", "10-5", "10:00a-5:00p". */
export const HOURS_PATTERN = /\b\d{1,2}(?::\d{2})?\s?(?:am|a\.m\.|a)?\s?[–—-]\s?\d{1,2}(?::\d{2})?\s?(?:pm|p\.m\.|p)\b/i;

/** `source: "/x"` entries in next.config.ts redirects(). */
export function redirectSources(configText: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const m of configText.matchAll(/source:\s*"([^"]+)"\s*,\s*destination:\s*"([^"]+)"/g)) out.set(m[1], m[2]);
  return out;
}

/** A top-level route exists when src/app/<segment>/ is a directory with a page (or a dynamic child), or the root page. */
export function routeExists(root: string, path: string): boolean {
  const seg = path.replace(/^\//, "").split("/").filter(Boolean);
  if (seg.length === 0) return existsSync(join(root, "src/app/page.tsx"));
  const dir = join(root, "src/app", seg[0]);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
  if (seg.length === 1) return existsSync(join(dir, "page.tsx"));
  // Deeper paths: accept a literal page or any dynamic [param] page one level down.
  if (existsSync(join(dir, ...seg.slice(1), "page.tsx"))) return true;
  return readdirSync(dir).some((d) => d.startsWith("[") && existsSync(join(dir, d, "page.tsx")));
}

/** Legacy paths that neither render nor redirect to something that renders. */
export function uncoveredLegacyPaths(root: string, configText: string, legacy = LEGACY_SQUARESPACE_PATHS): string[] {
  const redirects = redirectSources(configText);
  return legacy.filter((p) => {
    const dest = redirects.get(p);
    if (dest !== undefined) return !(dest.startsWith("http") || routeExists(root, dest.split("#")[0]));
    return !routeExists(root, p);
  });
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

/** Lines in src/ (outside settings.ts and the hours parser) that state a showroom hours range. */
export function strayHours(root: string): string[] {
  const hits: string[] = [];
  for (const f of walk(join(root, "src"))) {
    const rel = f.slice(root.length + 1);
    if (rel === "src/content/settings.ts" || rel === "src/lib/seo.ts") continue;
    readFileSync(f, "utf8").split("\n").forEach((line, i) => {
      if (HOURS_PATTERN.test(line)) hits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 100)}`);
    });
  }
  return hits;
}

/** Lines in src/ that offer a line the owners do not carry. */
export function notCarriedOffers(root: string): string[] {
  const hits: string[] = [];
  for (const f of walk(join(root, "src"))) {
    const rel = f.slice(root.length + 1);
    readFileSync(f, "utf8").split("\n").forEach((line, i) => {
      if (NOT_CARRIED.some((re) => re.test(line))) hits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 100)}`);
    });
  }
  return hits;
}

// ---- Self-test: the detectors above must be able to fail, or the repo checks below prove nothing. ----
{
  const cfg = `{ source: "/calspas", destination: "/hot-tubs", permanent: true }, { source: "/ghost", destination: "/nowhere", permanent: true }`;
  const here = join(dirname(fileURLToPath(import.meta.url)), "..");
  assert.deepEqual(uncoveredLegacyPaths(here, cfg, ["/calspas", "/spas", "/ghost"]), ["/spas", "/ghost"], "detector must flag a missing redirect and a dead destination");
  assert.ok(HOURS_PATTERN.test("Tuesday - Saturday 10:00a-5:00p"), "hours pattern must catch the live /contact wording");
  assert.ok(HOURS_PATTERN.test("Open 10am – 4pm"), "hours pattern must catch the settings wording");
  assert.ok(!HOURS_PATTERN.test("since 1979 – 1995"), "hours pattern must not fire on year ranges");
  assert.ok(NOT_CARRIED.some((re) => re.test("Shop Cal Saunas")), "not-carried list must catch Cal Saunas");
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { SETTINGS } = await import("../src/content/settings.ts");
const configText = readFileSync(join(root, "next.config.ts"), "utf8");

// 1. The name is kept. This is not a rebrand.
assert.equal(SETTINGS.name, "Seasonally Living", "public short name");
assert.equal(SETTINGS.legalName, "Seasonally Living by Chim Chimney", "the 40-year name stays in the public name (TOL-2907: not a rebrand)");
assert.equal(SETTINGS.founded, 1979, "the 1979 founding year is the 40-year story");
assert.match(SETTINGS.owners, /McNeill/, "owners stay named");

// 2. One hours source, and it is the one the owners confirmed (Tuesday-Saturday 10-4).
assert.deepEqual(strayHours(root), [], "showroom hours are stated only in src/content/settings.ts");
assert.deepEqual(SETTINGS.hours[0], { days: "Tuesday – Saturday", time: "10am – 4pm" }, "hours match the live footer (TOL-2907 inventory)");

// 3. Nothing offers a line the owners dropped.
assert.deepEqual(notCarriedOffers(root), [], "public copy offers a line the owners no longer carry");

// 4. Every page the live Squarespace site serves today still resolves.
assert.deepEqual(uncoveredLegacyPaths(root, configText), [], "legacy Squarespace paths must exist or redirect (add them to next.config.ts redirects())");

console.log("ok: name, hours, not-carried lines and legacy redirects");
