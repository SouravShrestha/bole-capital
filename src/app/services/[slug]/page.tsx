import { notFound } from "next/navigation";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesList } from "@/components/services/ServicesList";
import { ScrollToSection } from "@/components/services/ScrollToSection";
import { services } from "@/components/services/servicesData";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { SERVICES_SEO, getServiceSeo, servicePath } from "@/lib/servicesSeo";
import { serviceAliasJsonLd } from "@/lib/servicesJsonLd";

/**
 * Alias URLs for each service (/services/nps, ...). They render the exact
 * same design as /services, with per-service metadata, hero copy and JSON-LD,
 * and land on the matching section. Unknown slugs 404 via notFound().
 *
 * Deliberately no `dynamicParams = false`: OpenNext here has no incremental
 * cache, so Workers render these on demand, and dynamicParams=false makes
 * that throw NoFallbackError (404 for every slug).
 */

// Fail the build if the SEO slugs and the rendered section ids drift apart.
const sectionIds = new Set(services.map((s) => s.id));
for (const { slug } of SERVICES_SEO) {
  if (!sectionIds.has(slug)) {
    throw new Error(`servicesSeo slug "${slug}" has no matching section in servicesData`);
  }
}

export function generateStaticParams() {
  return SERVICES_SEO.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getServiceSeo(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: servicePath(slug),
  });
}

export default async function ServiceAliasPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getServiceSeo(slug);
  if (!service) notFound();

  return (
    <main id="main-content">
      <JsonLd data={serviceAliasJsonLd(service)} />
      <ServicesHero intro={service.intro} />
      <ServicesList />
      <ScrollToSection id={service.slug} />
    </main>
  );
}
