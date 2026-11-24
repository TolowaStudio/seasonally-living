import { oneLine } from "@/lib/text";

/** Per-phone cap for phone-only private feedback on /review (no email). */
export const FEEDBACK_PHONE_LIMIT = 2;
export const FEEDBACK_PHONE_WINDOW_MS = 60 * 60_000;

export function feedbackPhoneKey(phone: string): string {
  const line = oneLine(phone, 40);
  const digits = line.replace(/\D/g, "");
  const core = digits.length >= 10 ? digits.slice(-10) : digits;
  return `feedback-phone:${core || line}`;
}