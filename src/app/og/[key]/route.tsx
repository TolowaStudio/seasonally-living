import { ImageResponse } from "next/og";
import { AREAS } from "@/content/areas";
import { ALL_PAGES } from "@/content/pages";
import type { LineContent } from "@/content/types";
import { getBrand, getPage, getSettings } from "@/lib/sanity";
import { addressOf } from "@/lib/site";
import { cloudinaryUrl } from "@/lib/seo";

// Share images (Open Graph / Twitter) per page, generated with next/og: the page's hero photo, a dark scrim,
// the page's name and the shop's name and address. The key is looked up server-side from real pages, so this
// is not an open "type any text" image generator. Cached for a day at the CDN / browser.

type Card = { kicker: string; title: string; image: string };

const key = (pageId: string) => (pageId === "/" ? "home" : pageId.replace(/^\//, "").replace(/\//g, "-"));

async function resolve(k: string): Promise<Card | null> {
  if (k.startsWith("brand-")) {
    const b = await getBrand(k.slice(6));
    return b ? { kicker: `Fireplaces & stoves · ${b.origin}`, title: `${b.name} in Wenatchee`, image: b.heroImage } : null;
  }
  if (k.startsWith("area-")) {
    const a = AREAS.find((x) => x.slug === k.slice(5));
    return a ? { kicker: a.hero.kicker, title: a.title, image: a.hero.image } : null;
  }
  const def = ALL_PAGES.find((p) => key(p.pageId) === k);
  if (!def) return null;
  if (def._type === "simplePage") return def.image ? { kicker: def.kicker, title: def.seo.title, image: def.image } : null;
  const c = await getPage<LineContent>(def.pageId);
  return { kicker: c.hero.kicker, title: c.seo.title, image: c.hero.image };
}

async function photo(id: string): Promise<string | null> {
  try {
    const res = await fetch(cloudinaryUrl(id, "c_fill,g_auto,w_1200,h_630,f_jpg,q_70"), { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    return `data:image/jpeg;base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(_req: Request, ctx: { params: Promise<{ key: string }> }) {
  const k = (await ctx.params).key;
  const card = await resolve(k);
  if (!card) return new Response("Not found", { status: 404 });
  const [bg, s] = await Promise.all([photo(card.image), getSettings()]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0e1316", color: "#fff" }}>
        {bg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bg} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", background: "linear-gradient(to top, rgba(8,7,5,0.94) 0%, rgba(8,7,5,0.78) 42%, rgba(8,7,5,0.2) 100%)" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "56px 64px", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 3, textTransform: "uppercase", color: "#e9b68c" }}>{card.kicker}</div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.05, marginTop: 16, maxWidth: 1000 }}>{card.title}</div>
          <div style={{ display: "flex", fontSize: 28, marginTop: 28, color: "rgba(255,255,255,0.88)" }}>
            {s.name} · {addressOf(s)} · {s.phoneDisplay}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" } },
  );
}
