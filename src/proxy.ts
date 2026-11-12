import { NextResponse, type NextRequest } from "next/server";

// Only the real domain may be indexed. The *.run.app preview and any other host
// get X-Robots-Tag: noindex, so a preview can never compete with the live site.
const INDEXABLE_HOSTS = new Set(["seasonallyliving.com", "www.seasonallyliving.com"]);

export function proxy(request: NextRequest) {
  const res = NextResponse.next();
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  if (!INDEXABLE_HOSTS.has(host)) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
