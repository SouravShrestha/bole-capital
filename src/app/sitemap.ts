import type { MetadataRoute } from "next";
import { SITEMAP_SECTIONS } from "@/lib/siteLinks";
import { SITE_LAST_UPDATED, absoluteUrl } from "@/lib/seo";

// Built from the same link config as the footer and /sitemap page, so a new
// page added there is picked up here automatically.
const PRIORITY: Record<string, number> = {
  "/": 1,
  "/services": 0.9,
  "/about": 0.8,
  "/contact": 0.8,
  "/resources": 0.7,
  "/resources/sip-calculator": 0.7,
  "/faq": 0.7,
  "/glossary": 0.6,
  "/sitemap": 0.3,
  "/privacy-policy": 0.3,
  "/commission-disclosures": 0.3,
  "/grievance-redressal": 0.3,
  "/terms-of-use": 0.3,
};

export default function sitemap(): MetadataRoute.Sitemap {
  // Drop #fragments (search engines ignore them) and de-duplicate.
  const paths = new Set(
    SITEMAP_SECTIONS.flatMap((s) => s.links)
      .filter((l) => !l.external)
      .map((l) => l.href.split("#")[0] || "/")
  );

  return [...paths].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(SITE_LAST_UPDATED),
    changeFrequency: "monthly",
    priority: PRIORITY[path] ?? (path.startsWith("/services/") ? 0.8 : 0.5),
  }));
}
