import { AboutHero } from "@/components/about/AboutHero";
import { pageMetadata } from "@/lib/seo";
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

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutHighlights />
      <AboutWhyChooseUs />
      <AboutFounder />
      <AboutHowYouInvest />
    </main>
  );
}
