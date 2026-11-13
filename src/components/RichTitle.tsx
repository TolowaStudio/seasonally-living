import type { RichTitle as T } from "@/content/types";

/** Headline with an optional italic accent phrase, e.g. "Swim all year. *In the backyard.*" */
export default function RichTitle({ t, accent = "var(--clay-soft)" }: { t: T; accent?: string }) {
  return (
    <>
      {t.before}
      {t.emphasis && <em style={{ fontStyle: "italic", color: accent }}>{t.emphasis}</em>}
      {t.after}
    </>
  );
}

