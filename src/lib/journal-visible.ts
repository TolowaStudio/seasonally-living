// Shared journal visibility rule (plain-node checkable; no React or Sanity client).
import type { JournalPost, JournalStatus } from "../content/journal";

const VISIBLE: JournalStatus[] = ["approved", "scheduled", "published"];

/** True when the post should be on the public site right now. */
export function isVisible(p: Pick<JournalPost, "status" | "publishAt" | "posted">, now = Date.now()): boolean {
  if (p.status === "hidden") return false;
  if (p.posted) return true;
  if (!VISIBLE.includes(p.status)) return false;
  return !p.publishAt || Date.parse(p.publishAt) <= now;
}