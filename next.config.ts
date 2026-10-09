import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // O PDF do regulamento lê a logo do disco
  outputFileTracingIncludes: {
    "/regulamento/pdf": ["./public/logo.png"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
