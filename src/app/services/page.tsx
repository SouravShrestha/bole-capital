import { ServicesHero } from "@/components/services/ServicesHero";
import { pageMetadata } from "@/lib/seo";
import { ServicesList } from "@/components/services/ServicesList";
import { JsonLd } from "@/components/seo/JsonLd";
import { servicesListJsonLd } from "@/lib/servicesJsonLd";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Mutual funds, portfolio review, goal-based investing, PMS and SIF, insurance and NPS from Bole Capital, an AMFI-registered mutual fund distributor.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main id="main-content">
      <JsonLd data={servicesListJsonLd()} />
      <ServicesHero />
      <ServicesList />
    </main>
  );
}
