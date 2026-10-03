import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["192.168.29.141", "192.168.29.106"],
  devIndicators: false,
};

initOpenNextCloudflareForDev();

export default nextConfig;
