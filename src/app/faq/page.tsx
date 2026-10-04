import FaqMain from "@/components/faq/FaqMain";
import faqService from "@/api/faq/faqService";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Bole Capital",
  description:
    "Find answers to frequently asked questions about Bole Capital services, investment approach, and getting started.",
};

export default async function FaqPage() {
  const categories = await faqService.getCategories();

  return <FaqMain categories={categories} />;
}
