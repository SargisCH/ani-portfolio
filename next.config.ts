import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https", // Specify the protocol (e.g., 'https', 'http')
        hostname: "pub-0b988d4f9aa947428ecf6c08b7c15ce7.r2.dev", // The exact hostname
      },
    ],
  },
};

export default nextConfig;
