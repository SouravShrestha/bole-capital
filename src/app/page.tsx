import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { OfferingsSection } from "@/components/offerings/OfferingsSection";
import { PhilosophySection } from "@/components/philosophy/PhilosophySection";
import { LetsMakeThingsHappenSection } from "@/components/cta/LetsMakeThingsHappenSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { OG_IMAGE, SITE_NAME } from "@/lib/seo";
// import { WhatsappFab } from "@/components/whatsapp/WhatsappFab";

const HOME_TITLE = `${SITE_NAME} - Mutual Fund Distributor in Dhanbad`;
const HOME_DESCRIPTION =
  "Goal-based mutual fund investing, portfolio reviews, NPS and insurance planning from Bole Capital, an AMFI-registered mutual fund distributor in Dhanbad, Jharkhand.";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroSection />
      <OfferingsSection />
      <LetsMakeThingsHappenSection />
      <PhilosophySection />
      <TestimonialsSection />
      {/* <WhatsappFab /> */}
    </main>
  );
}
