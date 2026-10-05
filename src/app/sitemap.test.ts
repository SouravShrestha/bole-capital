import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { SITE_URL } from "@/lib/seo";
import { SERVICES_SEO } from "@/lib/servicesSeo";

describe("sitemap.xml", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  it("includes the compliance pages", () => {
    expect(urls).toContain(`${SITE_URL}/grievance-redressal`);
    expect(urls).toContain(`${SITE_URL}/terms-of-use`);
    expect(urls).toContain(`${SITE_URL}/privacy-policy`);
  });

  it("includes every service alias page", () => {
    for (const { slug } of SERVICES_SEO) expect(urls).toContain(`${SITE_URL}/services/${slug}`);
  });

  it("strips #fragments, de-duplicates and skips external links", () => {
    expect(urls.some((u) => u.includes("#"))).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((u) => u.startsWith(SITE_URL))).toBe(true);
  });

  it("gives every entry a valid lastModified date", () => {
    for (const e of entries) {
      expect(Number.isNaN(new Date(e.lastModified as Date).getTime())).toBe(false);
    }
  });
});
