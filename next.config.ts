import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { resolveLastUpdated } from "./src/lib/lastUpdated";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Public origin of this deployment (see SITE_URL in src/lib/seo.ts). Set
 * SITE_URL=https://test.bolecapital.in for test builds; defaults to production.
 * Validated here so a typo fails the build instead of shipping broken previews.
 */
function resolveSiteUrl(): string {
  const raw = process.env.SITE_URL?.trim();
  if (!raw) return "https://bolecapital.in";
  const url = new URL(raw);
  if (url.protocol !== "https:" && !isDev) {
    throw new Error(`SITE_URL must be https in production builds, got "${raw}"`);
  }
  return url.origin;
}

/**
 * 'unsafe-inline' for scripts keeps pages statically prerendered; a nonce-based
 * CSP would force every page to render per request. Dev needs 'unsafe-eval'
 * for React's debugging features and ws: for HMR.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "form-action 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Inlined at build time; read via SITE_LAST_UPDATED in src/lib/seo.ts.
  env: {
    SITE_LAST_UPDATED: resolveLastUpdated(),
    SITE_URL: resolveSiteUrl(),
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["192.168.29.141", "192.168.29.106"],
  devIndicators: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
