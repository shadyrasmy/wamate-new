import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://localhost:${process.env.BACKEND_PORT || '3001'}/api/:path*`,
      },
      {
        source: '/public/:path*',
        destination: `http://localhost:${process.env.BACKEND_PORT || '3001'}/public/:path*`,
      },
      {
        source: '/socket.io/:path*',
        destination: `http://localhost:${process.env.BACKEND_PORT || '3001'}/socket.io/:path*`,
      },
    ];
  },
};

export default nextConfig;
