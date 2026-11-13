import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained Node server for the Cloud Run image (see Dockerfile).
  output: "standalone",
  turbopack: { root: __dirname },
  // Pins file tracing so Next never infers $HOME as the workspace root.
  outputFileTracingRoot: __dirname,
  // Every next/image src is a Cloudinary public ID (cloud tolowa-studio); Cloudinary resizes and serves.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
  },
  async redirects() {
    return [
      { source: "/book", destination: "/visit", permanent: true },
      { source: "/showroom", destination: "/visit", permanent: true },
      { source: "/contact", destination: "/visit", permanent: true },
      { source: "/outdoor-kitchens", destination: "/outdoor-living", permanent: true },
      { source: "/calflame", destination: "/outdoor-living", permanent: true },
      { source: "/construction-design-services", destination: "/outdoor-living", permanent: true },
      { source: "/fireplace-stove", destination: "/fireplaces", permanent: true },
      { source: "/fireplace-stoves", destination: "/fireplaces", permanent: true },
      { source: "/fireplaces-stoves", destination: "/fireplaces", permanent: true },
      { source: "/fireplacestoves-options", destination: "/fireplaces", permanent: true },
      { source: "/wood-fireplaces", destination: "/fireplaces", permanent: true },
      { source: "/gas-fireplace", destination: "/fireplaces/gas-electric", permanent: true },
      { source: "/electric-fireplaces", destination: "/fireplaces/gas-electric", permanent: true },
      { source: "/calspas", destination: "/hot-tubs", permanent: true },
      { source: "/cal-spas", destination: "/hot-tubs", permanent: true },
      { source: "/spas", destination: "/hot-tubs", permanent: true },
      { source: "/home-resort", destination: "/hot-tubs", permanent: true },
      { source: "/hot-tubs-spas", destination: "/hot-tubs", permanent: true },
      { source: "/swim-pro", destination: "/swim-spas", permanent: true },
      { source: "/cal-saunas", destination: "/saunas", permanent: true },
      { source: "/pool-spa-care", destination: "/spa-care", permanent: true },
      { source: "/our-story", destination: "/about", permanent: true },
      { source: "/cart", destination: "/visit", permanent: true },
      // Editors: the content studio is hosted by Sanity.
      { source: "/studio", destination: "https://seasonally-living.sanity.studio/", permanent: false },
    ];
  },
};

export default nextConfig;
