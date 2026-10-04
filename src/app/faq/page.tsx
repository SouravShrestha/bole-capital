import FaqMain from "@/components/faq/FaqMain";
import faqService from "@/api/faq/faqService";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQ",
  description:
    "Answers to frequently asked questions about Bole Capital's services, investment approach, getting started, managing investments and risk.",
  path: "/faq",
});

export default async function FaqPage() {
  const categories = await faqService.getCategories();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: absoluteUrl("/faq"),
    mainEntity: categories.flatMap((c) =>
      c.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      }))
    ),
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <FaqMain categories={categories} />
    </>
  );
}
