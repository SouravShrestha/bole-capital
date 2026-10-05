import { AboutHero } from "@/components/about/AboutHero";
import { SITE_URL, pageMetadata } from "@/lib/seo";
import { COMPLIANCE } from "@/lib/compliance";
import { JsonLd } from "@/components/seo/JsonLd";
import { AboutHighlights } from "@/components/about/AboutHighlights";
import { AboutWhyChooseUs } from "@/components/about/AboutWhyChooseUs";
import { AboutFounder } from "@/components/about/AboutFounder";
import { AboutHowYouInvest } from "@/components/about/AboutHowYouInvest";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Learn about Bole Capital's mission, investment philosophy, why clients choose us, and how you invest with us online.",
  path: "/about",
});

const FOUNDER_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/about#founder`,
  name: COMPLIANCE.legalName,
  jobTitle: "Founder, AMFI-registered Mutual Fund Distributor",
  url: `${SITE_URL}/about`,
  worksFor: { "@id": `${SITE_URL}/#organization` },
  sameAs: ["https://in.linkedin.com/in/hemant-bole-01958ba4"],
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <JsonLd data={FOUNDER_JSON_LD} />
      <AboutHero />
      <AboutHighlights />
      <AboutWhyChooseUs />
      <AboutFounder />
      <AboutHowYouInvest />
    </main>
  );
}
