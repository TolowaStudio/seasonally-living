import type { RichTitle as T } from "@/content/types";

/** Headline with an optional accent phrase, e.g. "Swim all year. *In the backyard.*" (styled per theme in globals.css). */
export default function RichTitle({ t, accent }: { t: T; accent?: string }) {
  return (
    <>
      {t.before}
      {t.emphasis && <em className="rt-em" style={accent ? { color: accent } : undefined}>{t.emphasis}</em>}
      {t.after}
    </>
  );
}
