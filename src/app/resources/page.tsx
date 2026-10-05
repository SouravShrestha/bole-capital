import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import faqService from "@/api/faq/faqService";
import { ResourcesHero } from "@/components/resources/ResourcesHero";
import { ResourcesGrid } from "@/components/resources/ResourcesGrid";
import { PopularQuestions } from "@/components/resources/PopularQuestions";

export const metadata: Metadata = pageMetadata({
  title: "Resources",
  description:
    "SIP calculator, FAQs and a glossary of investing terms to help mutual fund investors make clearer decisions.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const categories = await faqService.getCategories();

  return (
    <main>
      <ResourcesHero />
      <ResourcesGrid categories={categories} />
      <PopularQuestions categories={categories} />
    </main>
  );
}
