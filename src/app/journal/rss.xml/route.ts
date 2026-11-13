import { bodyHtml, getPosts, imageUrl, postUrl } from "@/lib/journal";
import { getSettings } from "@/lib/sanity";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 300;

// Strip characters XML 1.0 forbids, then escape the five reserved ones.
const esc = (s: string) =>
  s
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);
  const base = getSiteUrl();
  const items = posts.slice(0, 30).map((p) => {
    const url = postUrl(p.slug);
    return `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>${p.publishAt ? `\n      <pubDate>${new Date(p.publishAt).toUTCString()}</pubDate>` : ""}
      <description>${esc(p.excerpt)}</description>
      <content:encoded><![CDATA[<img src="${esc(imageUrl(p.heroImage, 1200))}" alt="${esc(p.heroAlt)}" />${bodyHtml(p.body).replace(/]]>/g, "]]&gt;")}]]></content:encoded>
${p.tags.map((t) => `      <category>${esc(t)}</category>`).join("\n")}
    </item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${esc(settings.name)} Journal</title>
    <link>${esc(base)}/journal</link>
    <atom:link href="${esc(base)}/journal/rss.xml" rel="self" type="application/rss+xml" />
    <description>Tips and straight answers from the ${esc(settings.name)} shop in Wenatchee.</description>
    <language>en-us</language>${posts[0]?.publishAt ? `\n    <lastBuildDate>${new Date(posts[0].publishAt).toUTCString()}</lastBuildDate>` : ""}
${items.join("\n")}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=300" } });
}
