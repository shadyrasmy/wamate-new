import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://127.0.0.1:${process.env.BACKEND_PORT || '5987'}/api/:path*`,
      },
      {
        source: '/public/:path*',
        destination: `http://127.0.0.1:${process.env.BACKEND_PORT || '5987'}/public/:path*`,
      },
      {
        source: '/socket.io/:path*',
        destination: `http://127.0.0.1:${process.env.BACKEND_PORT || '5987'}/socket.io/:path*`,
      },
    ];
  },
};

export default nextConfig;
