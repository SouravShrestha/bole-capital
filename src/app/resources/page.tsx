import type { Metadata } from "next";
import faqService from "@/api/faq/faqService";
import { ResourcesHero } from "@/components/resources/ResourcesHero";
import { ResourcesGrid } from "@/components/resources/ResourcesGrid";
import { PopularQuestions } from "@/components/resources/PopularQuestions";

export const metadata: Metadata = {
  title: "Resources - Bole Capital",
  description:
    "SIP calculator and answers to common questions for mutual fund investors.",
};

export default async function ResourcesPage() {
  const categories = await faqService.getCategories();

  return (
    <main className="bg-(--bg)">
      <ResourcesHero />
      <ResourcesGrid categories={categories} />
      <PopularQuestions categories={categories} />
    </main>
  );
}
