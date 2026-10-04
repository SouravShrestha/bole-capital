import glossaryData from "@/data/glossary.json";
import type { GlossaryTerm } from "@/types/glossary";
import { GlossaryMain } from "@/components/glossary/GlossaryMain";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Glossary of Investing Terms",
  description:
    "Plain-language definitions of common mutual fund and investing terms, from NAV and SIP to expense ratio, ELSS and XIRR.",
  path: "/glossary",
  keywords: ["mutual fund glossary", "investing terms", "NAV meaning", "SIP meaning", "XIRR"],
});

const terms = glossaryData as GlossaryTerm[];

export default function GlossaryPage() {
  const glossaryUrl = absoluteUrl("/glossary");
  const glossaryJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": glossaryUrl,
    name: "Bole Capital Glossary of Investing Terms",
    url: glossaryUrl,
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      "@id": `${glossaryUrl}#${t.id}`,
      name: t.term,
      description: t.definition,
      url: `${glossaryUrl}#${t.id}`,
      inDefinedTermSet: glossaryUrl,
    })),
  };

  return (
    <>
      <JsonLd data={glossaryJsonLd} />
      <GlossaryMain terms={terms} />
    </>
  );
}
