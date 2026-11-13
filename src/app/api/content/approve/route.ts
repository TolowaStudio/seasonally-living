import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { SANITY_DATASET, SANITY_PROJECT_ID } from "@/lib/sanity";

// Phone-tap approval for the social queue (see automation/README.md).
//
// DISABLED unless CONTENT_APPROVE_SECRET is set: with it unset this route answers 404, exactly like a
// route that does not exist. It also needs SANITY_WRITE_TOKEN (an Editor-role token for this project).
//
//   POST /api/content/approve
//   Authorization: Bearer <CONTENT_APPROVE_SECRET>
//   { "id": "post-<slug>", "approvedBy": "Kimberly" }
//
// It flips ONE field on ONE post: status draft -> approved (or scheduled when publishAt is in the
// future), and records who and when. It posts nothing; the n8n workflow does the posting. It refuses
// a post that still has "check with Cam or Susan" items, unfilled [[ADD]] placeholders, or no text.
// Treat the secret like a password: long and random, in GCP Secret Manager / the Cloud Run env only.

const API = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2025-01-01/data`;
// Imported drafts are "post-<slug>"; posts created in the Studio get generated ids. Never a "drafts." id.
const ID_RE = /^(?!drafts\.)[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;
const APPROVERS = /^[A-Za-z][A-Za-z .'-]{0,39}$/;

const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

// Compare digests so length differences and timing reveal nothing about the secret.
function sameSecret(given: string, expected: string): boolean {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

type PostRow = { _rev: string; status?: string; publishAt?: string; needsConfirm?: string[]; text?: string };

export async function POST(req: NextRequest) {
  const secret = process.env.CONTENT_APPROVE_SECRET?.trim(); // a trailing newline from a mounted secret must not break auth
  if (!secret) return new NextResponse("Not Found", { status: 404 });
  // The route is internet-reachable and has no rate limit, so a guessable secret is not allowed to turn it on.
  if (secret.length < 32) {
    console.error("approve: CONTENT_APPROVE_SECRET is shorter than 32 characters; the route stays off");
    return new NextResponse("Not Found", { status: 404 });
  }

  const auth = req.headers.get("authorization") ?? "";
  const given = auth.startsWith("Bearer ") ? auth.slice(7) : (req.headers.get("x-approve-secret") ?? "");
  if (!given || !sameSecret(given, secret)) return json({ ok: false, error: "Unauthorized" }, 401);

  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) return json({ ok: false, error: "Approval is not configured (SANITY_WRITE_TOKEN)" }, 503);

  let body: { id?: unknown; approvedBy?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }
  const id = typeof body.id === "string" ? body.id.trim() : "";
  const approvedBy = typeof body.approvedBy === "string" ? body.approvedBy.trim() : "";
  if (!ID_RE.test(id)) return json({ ok: false, error: "id must be a post document id (for example post-<slug>)" }, 400);
  if (!APPROVERS.test(approvedBy)) return json({ ok: false, error: "approvedBy (a first name) is required" }, 400);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const q = new URLSearchParams({
    query: `*[_id == $id && _type == "post"][0]{_rev, status, publishAt, needsConfirm, "text": coalesce(social.facebook, "") + coalesce(social.instagram.caption, "") + coalesce(social.gbp.text, "") + coalesce(pt::text(body), "")}`,
    $id: JSON.stringify(id),
    perspective: "raw",
  });
  const found = await fetch(`${API}/query/${SANITY_DATASET}?${q}`, { headers, cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!found.ok) return json({ ok: false, error: "Could not read the post" }, 502);
  const row = ((await found.json()) as { result: PostRow | null }).result;
  if (!row) return json({ ok: false, error: "No such post" }, 404);

  if (row.status === "approved" || row.status === "scheduled" || row.status === "published") return json({ ok: true, id, status: row.status, note: "Already approved" });
  if ((row.needsConfirm?.length ?? 0) > 0) return json({ ok: false, error: "This post still has items to check with Cam or Susan" }, 409);
  if (!row.text || /\[\[[^\]]*\]\]/.test(row.text)) return json({ ok: false, error: "This post is empty or still has [[ADD]] placeholders" }, 409);

  const future = row.publishAt && Date.parse(row.publishAt) > Date.now();
  const status = future ? "scheduled" : "approved";
  const res = await fetch(`${API}/mutate/${SANITY_DATASET}`, {
    method: "POST",
    headers,
    // ifRevisionID: if anyone edited the post since we read it, the patch is refused rather than approving a different version.
    body: JSON.stringify({ mutations: [{ patch: { id, ifRevisionID: row._rev, set: { status, approvedBy, approvedAt: new Date().toISOString() } } }] }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return json({ ok: false, error: res.status === 409 ? "The post changed while approving; open it and try again" : "Could not save the approval" }, res.status === 409 ? 409 : 502);
  return json({ ok: true, id, status });
}
