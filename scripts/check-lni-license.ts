// Run: node --experimental-strip-types scripts/check-lni-license.ts           (CI: self-test only, no network)
//      node --experimental-strip-types scripts/check-lni-license.ts --live    (reads Washington open data, TOL-2907)
//
// Why this exists: BBB rates Chim Chimney "F" for "Failure to have a required competency license". The public
// Washington L&I contractor register (data.wa.gov dataset m8qx-ubtq) shows the old registration "CHIM CHIMNEY
// FIREPLACE & SPA" (CHIMCFS990DF) EXPIRED 2024-08-10, and a current one under the new name "SEASONALLY LIVING"
// (SEASOL*762BW, same UBI, effective 2024-01-18, expires 2028-04-08). If that registration lapses, or someone matches
// the lookalike "CHIM CHIMNEY SWEEPS LLC" (a different business, different UBI), the F and any BBB reply are wrong.
// Matching is by UBI, never by name.
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

/** UBI of the McNeill corporation (same on the expired Chim Chimney and the active Seasonally Living registration). */
export const OUR_UBI = "601862521";
const DATASET = "https://data.wa.gov/resource/m8qx-ubtq.json";
export const WARN_DAYS = 90;

export type LniRow = {
  businessname?: string;
  contractorlicensenumber?: string;
  ubi?: string;
  contractorlicensestatus?: string;
  licenseexpirationdate?: string;
};

/** Problems with our registration; empty means a current, unexpired one exists for our UBI. */
export function licenseProblems(rows: LniRow[], today: Date, ubi = OUR_UBI, warnDays = WARN_DAYS): string[] {
  const mine = rows.filter((r) => r.ubi === ubi);
  if (mine.length === 0) return [`no L&I registration found for UBI ${ubi}`];
  const horizon = today.getTime() + warnDays * 86_400_000;
  const good = mine.filter(
    (r) => r.contractorlicensestatus === "ACTIVE" && r.licenseexpirationdate && Date.parse(r.licenseexpirationdate) > horizon,
  );
  if (good.length > 0) return [];
  return mine.map(
    (r) =>
      `${r.businessname} ${r.contractorlicensenumber}: ${r.contractorlicensestatus}, expires ${r.licenseexpirationdate?.slice(0, 10)} (need ACTIVE and more than ${warnDays} days left)`,
  );
}

// ---- Self-test: rows copied from the live register on 2026-11-17. Each assertion must be able to fail. ----
{
  const old: LniRow = { businessname: "CHIM CHIMNEY FIREPLACE & SPA", contractorlicensenumber: "CHIMCFS990DF", ubi: OUR_UBI, contractorlicensestatus: "EXPIRED", licenseexpirationdate: "2024-08-10T00:00:00.000" };
  const current: LniRow = { businessname: "SEASONALLY LIVING", contractorlicensenumber: "SEASOL*762BW", ubi: OUR_UBI, contractorlicensestatus: "ACTIVE", licenseexpirationdate: "2028-04-08T00:00:00.000" };
  const lookalike: LniRow = { businessname: "CHIM CHIMNEY SWEEPS LLC", contractorlicensenumber: "CHIMCCS840KD", ubi: "603453854", contractorlicensestatus: "ACTIVE", licenseexpirationdate: "2027-11-25T00:00:00.000" };
  const today = new Date("2026-11-17T00:00:00Z");

  assert.deepEqual(licenseProblems([old, current, lookalike], today), [], "active registration under our UBI passes");
  assert.equal(licenseProblems([old], today).length, 1, "only the expired Chim Chimney registration must fail (this is the BBB F)");
  assert.equal(licenseProblems([lookalike], today).length, 1, "another business's active license must not satisfy ours (match by UBI, not name)");
  assert.equal(licenseProblems([], today).length, 1, "no rows must fail");
  assert.equal(licenseProblems([{ ...current, contractorlicensestatus: "SUSPENDED" }], today).length, 1, "a suspended registration with a future expiry date must fail");
  assert.equal(
    licenseProblems([{ ...current, licenseexpirationdate: "2027-01-05T00:00:00.000" }], today).length,
    1,
    "an ACTIVE registration inside the warning window must fail so renewal is chased before it lapses",
  );
}

if (process.argv.includes("--live")) {
  const url = `${DATASET}?${new URLSearchParams({ ubi: OUR_UBI, $limit: "50" })}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  assert.ok(res.ok, `data.wa.gov returned ${res.status}`);
  const rows = (await res.json()) as LniRow[];
  const problems = licenseProblems(rows, new Date());
  for (const r of rows) console.log(`${r.businessname}  ${r.contractorlicensenumber}  ${r.contractorlicensestatus}  expires ${r.licenseexpirationdate?.slice(0, 10)}`);
  if (problems.length > 0) {
    console.error(`FAIL: ${problems.join("; ")}`);
    process.exit(1);
  }
  console.log("ok: current L&I registration for our UBI");
} else if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log("ok: L&I license check self-test (run with --live for the register)");
}
