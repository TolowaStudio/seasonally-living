// Run: node --experimental-strip-types scripts/check-no-vercel.ts   (TOL-655)
// Vercel is retired and prohibited (runtime is Cloud Run). Fails if Vercel config or deploy wiring comes back:
// vercel.json, a .vercel/ directory, or a Vercel dependency/script in package.json.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function vercelResidue(root: string): string[] {
  const found: string[] = [];
  for (const p of ["vercel.json", ".vercel", "vercel.ts", ".vercelignore"]) if (existsSync(join(root, p))) found.push(p);
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const name of Object.keys(deps)) if (name === "vercel" || name.startsWith("@vercel/")) found.push(`package.json dep ${name}`);
  for (const [k, v] of Object.entries<string>(pkg.scripts ?? {})) if (/\bvercel\b/.test(v)) found.push(`package.json script ${k}`);
  return found;
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
assert.deepEqual(vercelResidue(root), [], "Vercel is retired (TOL-655); remove the files/deps listed above");
console.log("ok: no Vercel config or dependency in repo");
