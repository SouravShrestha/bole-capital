import { SITE_URL } from "@/lib/seo";
import { SERVICES_SEO, servicePath, type ServiceSeo } from "@/lib/servicesSeo";

const ORG_ID = `${SITE_URL}/#organization`;

/** Stable @id for a service, anchored to its section on /services. */
export const serviceId = (slug: string) => `${SITE_URL}/services#${slug}`;

export function serviceNode(service: ServiceSeo) {
  return {
    "@type": "Service",
    "@id": serviceId(service.slug),
    name: service.name,
    serviceType: service.serviceType,
    description: service.seoDescription,
    url: `${SITE_URL}${servicePath(service.slug)}`,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "India" },
  };
}

/** /services: every service as an ItemList. */
export function servicesListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/services#services`,
    name: "Bole Capital services",
    itemListElement: SERVICES_SEO.map((service, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: serviceNode(service),
    })),
  };
}

/** /services/<slug>: the single Service plus a BreadcrumbList. */
export function serviceAliasJsonLd(service: ServiceSeo) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      serviceNode(service),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
          {
            "@type": "ListItem",
            position: 3,
            name: service.name,
            item: `${SITE_URL}${servicePath(service.slug)}`,
          },
        ],
      },
    ] as const,
  };
}
