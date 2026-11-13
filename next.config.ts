import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Keep old static URLs working.
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/services.html", destination: "/services", permanent: true },
      { source: "/book-a-call.html", destination: "/book-a-call", permanent: true },
      { source: "/decostorepros.html", destination: "/decostorepros", permanent: true },
    ];
  },
};

export default nextConfig;
