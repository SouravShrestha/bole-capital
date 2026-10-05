import { describe, expect, it } from "vitest";
import { SERVICES_SEO, getServiceSeo, isServiceAliasPath } from "./servicesSeo";
import { serviceAliasJsonLd, serviceId, servicesListJsonLd } from "./servicesJsonLd";
import { SITE_URL } from "./seo";

describe("SERVICES_SEO", () => {
  it("has six services with unique, URL-safe slugs", () => {
    const slugs = SERVICES_SEO.map((s) => s.slug);
    expect(slugs).toHaveLength(6);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("gives each alias page unique title, description and intro", () => {
    for (const key of ["seoTitle", "seoDescription", "intro"] as const) {
      const values = SERVICES_SEO.map((s) => s[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("looks up services by slug", () => {
    expect(getServiceSeo("nps")?.name).toBe("NPS");
    expect(getServiceSeo("nope")).toBeUndefined();
  });

  it("recognises alias paths only for known slugs", () => {
    expect(isServiceAliasPath("/services/nps")).toBe(true);
    expect(isServiceAliasPath("/services/nps/")).toBe(true);
    expect(isServiceAliasPath("/services")).toBe(false);
    expect(isServiceAliasPath("/services/unknown")).toBe(false);
    expect(isServiceAliasPath("/services/nps/extra")).toBe(false);
  });
});

describe("services JSON-LD", () => {
  it("lists every service with an anchored @id and the organization as provider", () => {
    const list = servicesListJsonLd();
    expect(list.itemListElement).toHaveLength(SERVICES_SEO.length);
    for (const [i, entry] of list.itemListElement.entries()) {
      expect(entry.position).toBe(i + 1);
      expect(entry.item["@id"]).toBe(`${SITE_URL}/services#${SERVICES_SEO[i].slug}`);
      expect(entry.item.provider).toEqual({ "@id": `${SITE_URL}/#organization` });
    }
  });

  it("builds a Service + BreadcrumbList for an alias page", () => {
    const nps = getServiceSeo("nps")!;
    const [service, breadcrumbs] = serviceAliasJsonLd(nps)["@graph"];
    expect(service["@id"]).toBe(serviceId("nps"));
    expect(service.url).toBe(`${SITE_URL}/services/nps`);
    expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
    expect(breadcrumbs.itemListElement?.at(-1)?.item).toBe(`${SITE_URL}/services/nps`);
  });
});
