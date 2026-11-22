import type { AreaFaq } from "@/content/areas";

/** Substitute the shop phone in service-area FAQ answers (Studio copy uses this token). */
export const AREA_FAQ_PHONE = "{{phone}}";

const LEGACY_PHONE = "(509) 667-8833";

export function areaFaqsForDisplay(faqs: AreaFaq[], phoneDisplay: string): AreaFaq[] {
  return faqs.map((f) => ({
    q: f.q,
    a: f.a.replaceAll(AREA_FAQ_PHONE, phoneDisplay).replaceAll(LEGACY_PHONE, phoneDisplay),
  }));
}