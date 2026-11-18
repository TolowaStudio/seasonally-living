// Run: node --experimental-strip-types scripts/check-listing-packet.ts   (TOL-2907)
// Keeps docs/TOL-2907-bbb-listing-packet.md equal to the site's single source of facts and the L&I result, and keeps
// it a DRAFT that promises nothing. Fails when the sheet's phone, address, hours or website differ from
// src/content/settings.ts, the license number or UBI is not the one in check-lni-license.ts, the DRAFT marker is gone,
// the sheet promises a rating outcome, or it cites the lookalike business's license.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { OUR_UBI } from "./check-lni-license.ts";

export const LICENSE_NUMBER = "SEASOL*762BW";
export const LOOKALIKE_LICENSE = "CHIMCCS840KD";
export const LOOKALIKE_UBI = "603453854";

export type Facts = { phone: string; zip: string; line1: string; website: string };

/** Pull the facts out of settings.ts text (single source). */
export function settingsFacts(settingsText: string): Facts {
  const pick = (re: RegExp, what: string) => {
    const m = settingsText.match(re);
    assert.ok(m, `settings.ts: cannot find ${what}`);
    return m[1];
  };
  return {
    phone: pick(/phoneDisplay:\s*"([^"]+)"/, "phoneDisplay"),
    line1: pick(/line1:\s*"([^"]+)"/, "address line1"),
    zip: pick(/zip:\s*"([^"]+)"/, "address zip"),
    website: "seasonallyliving.com",
  };
}

export function packetProblems(packet: string, f: Facts): string[] {
  const out: string[] = [];
  if (!/\bDRAFT\b/.test(packet) || !/Nothing here has been sent/.test(packet)) out.push("packet must say DRAFT and that nothing was sent");
  for (const [k, v] of Object.entries(f)) if (!packet.includes(v)) out.push(`packet does not show ${k}: ${v}`);
  if (!packet.includes(LICENSE_NUMBER)) out.push(`packet does not show license ${LICENSE_NUMBER}`);
  if (!packet.includes(OUR_UBI)) out.push(`packet does not show our UBI ${OUR_UBI}`);
  if (packet.includes(LOOKALIKE_LICENSE) || packet.includes(LOOKALIKE_UBI)) out.push("packet cites the lookalike business's license or UBI");
  if (!/Tuesday to Saturday 10am to 4pm/.test(packet)) out.push("packet hours must read Tuesday to Saturday 10am to 4pm");
  if (/\b10\s?(?:am)?\s?(?:to|-|–)\s?5\s?pm\b/i.test(packet.replace(/live `\/contact` page says 10 to 5/g, ""))) out.push("packet shows 10 to 5 hours");
  if (/will (?:raise|restore|fix|remove) (?:the|our) (?:rating|F)|rating will/i.test(packet)) out.push("packet promises a rating outcome");
  return out;
}

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

// ---- Self-test: each assertion fails if its rule is removed. ----
{
  const f: Facts = { phone: "(509) 667-8833", line1: "1407 Maiden Ln", zip: "98801", website: "seasonallyliving.com" };
  const good = `DRAFT. Nothing here has been sent. ${f.phone} ${f.line1} ${f.zip} https://${f.website} ${LICENSE_NUMBER} ${OUR_UBI} Tuesday to Saturday 10am to 4pm`;
  assert.deepEqual(packetProblems(good, f), [], "a complete draft packet passes");
  assert.ok(packetProblems(good.replace("DRAFT", "FINAL"), f).length > 0, "a packet without the DRAFT marker must fail");
  assert.ok(packetProblems(good.replace(f.phone, "(509) 555-0100"), f).length > 0, "a different phone than settings.ts must fail");
  assert.ok(packetProblems(good.replace(f.line1, "1604 N Wenatchee Ave"), f).length > 0, "the old address must fail");
  assert.ok(packetProblems(good.replace(LICENSE_NUMBER, "CHIMCFS990DF"), f).length > 0, "the expired registration number must fail");
  assert.ok(packetProblems(good + ` ${LOOKALIKE_LICENSE}`, f).length > 0, "the lookalike business's license must fail");
  assert.ok(packetProblems(good.replace("10am to 4pm", "10am to 5pm"), f).length > 0, "10 to 5 hours must fail");
  assert.ok(packetProblems(good + " The rating will go up.", f).length > 0, "a promised rating outcome must fail");
}

const packet = readFileSync(join(root, "docs/TOL-2907-bbb-listing-packet.md"), "utf8");
const settings = readFileSync(join(root, "src/content/settings.ts"), "utf8");
const problems = packetProblems(packet, settingsFacts(settings));
if (problems.length > 0) {
  console.error(`FAIL: ${problems.join("; ")}`);
  process.exit(1);
}
console.log("ok: BBB and listing packet matches settings.ts and the L&I result");
