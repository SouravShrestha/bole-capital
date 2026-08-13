import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["192.168.29.141"],
};

initOpenNextCloudflareForDev();

export default nextConfig;
