import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  turbopack: {
    root: __dirname,
  },
  // turbopack.root above only pins Turbopack's root. The default (non-Turbopack)
  // `next build` path uses this instead — without it Next can infer $HOME as the
  // workspace root if a stray lockfile exists there.
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
