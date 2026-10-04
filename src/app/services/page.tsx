import { ServicesHero } from "@/components/services/ServicesHero";
import { pageMetadata } from "@/lib/seo";
import { ServicesList } from "@/components/services/ServicesList";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Mutual funds, portfolio review, goal-based investing, PMS and SIF, insurance and NPS from Bole Capital, an AMFI-registered mutual fund distributor.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div className="bg-(--bg)">
      <ServicesHero />
      <ServicesList />
    </div>
  );
}
