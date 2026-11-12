import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained Node server for the Cloud Run image (see Dockerfile).
  output: "standalone",
  turbopack: { root: __dirname },
  // Pins file tracing so Next never infers $HOME as the workspace root.
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/tolowa-studio/**" },
    ],
  },
  async redirects() {
    return [
      { source: "/book", destination: "/visit", permanent: true },
      { source: "/showroom", destination: "/visit", permanent: true },
      { source: "/contact", destination: "/visit", permanent: true },
      { source: "/outdoor-kitchens", destination: "/", permanent: true },
      { source: "/fireplace-stoves", destination: "/fireplaces", permanent: true },
      { source: "/fireplaces-stoves", destination: "/fireplaces", permanent: true },
      { source: "/hot-tubs-spas", destination: "/hot-tubs", permanent: true },
      { source: "/cal-spas", destination: "/hot-tubs", permanent: true },
      { source: "/swim-pro", destination: "/swim-spas", permanent: true },
      { source: "/construction-design-services", destination: "/pools", permanent: true },
    ];
  },
};

export default nextConfig;
