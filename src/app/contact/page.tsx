import { ContactHero } from "@/components/contact/ContactHero";
import { pageMetadata } from "@/lib/seo";
import { ContactSection } from "@/components/contact/ContactSection";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Start a conversation with Bole Capital. Reach us by email, phone or WhatsApp, or visit us at Bank More, Dhanbad, Jharkhand.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main id="main-content">
      <ContactHero />
      <ContactSection />
    </main>
  );
}
