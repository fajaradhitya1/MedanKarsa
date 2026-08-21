import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Mengabaikan error TypeScript saat build di Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;