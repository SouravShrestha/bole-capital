import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesList } from "@/components/services/ServicesList";

export const metadata = {
  title: "Services - Bole Capital",
  description:
    "Mutual funds, NPS, PMS, SIF, insurance, fixed income, and portfolio review.",
};

export default function ServicesPage() {
  return (
    <div className="bg-(--bg)">
      <ServicesHero />
      <ServicesList />
    </div>
  );
}
