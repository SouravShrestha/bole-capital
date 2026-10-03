import { ContactHero } from "@/components/contact/ContactHero";
import { ContactSection } from "@/components/contact/ContactSection";

export const metadata = {
  title: "Contact - Bole Capital",
  description: "Start a conversation with Bole Capital.",
};

export default function ContactPage() {
  return (
    <main className="bg-(--bg)">
      <ContactHero />
      <ContactSection />
    </main>
  );
}
