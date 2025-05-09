import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  experimental: {
    useCache: true,
  },
  /* config options here */
  typescript:{
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
