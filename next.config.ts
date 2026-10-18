import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel React Best Practice: Eliminate barrel import overhead */
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
