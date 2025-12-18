import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `https://apibeta.wamateai.online:${process.env.BACKEND_PORT || '5987'}/api/:path*`,
      },
      {
        source: '/public/:path*',
        destination: `https://apibeta.wamateai.online:${process.env.BACKEND_PORT || '5987'}/public/:path*`,
      },
    ];
  },
};

export default nextConfig;
