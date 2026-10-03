import { AboutHero } from "@/components/about/AboutHero";
import { AboutHighlights } from "@/components/about/AboutHighlights";
import { AboutWhyChooseUs } from "@/components/about/AboutWhyChooseUs";
import { AboutFounder } from "@/components/about/AboutFounder";
import { AboutHowYouInvest } from "@/components/about/AboutHowYouInvest";

export const metadata = {
  title: "About - Bole Capital",
  description:
    "Learn about Bole Capital's mission, philosophy, and the team behind it.",
};

export default function AboutPage() {
  return (
    <main className="bg-(--bg)">
      <AboutHero />
      <AboutHighlights />
      <AboutWhyChooseUs />
      <AboutFounder />
      <AboutHowYouInvest />
    </main>
  );
}
