import { HeroSection } from "@/components/hero/HeroSection";
import { OfferingsSection } from "@/components/offerings/OfferingsSection";
import { PhilosophySection } from "@/components/philosophy/PhilosophySection";
import { LetsMakeThingsHappenSection } from "@/components/cta/LetsMakeThingsHappenSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <OfferingsSection />
      <LetsMakeThingsHappenSection />
      <PhilosophySection />
      <TestimonialsSection />
      {/* <WhatsappFab /> */}
    </main>
  );
}
