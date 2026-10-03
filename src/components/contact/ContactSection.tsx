import { ContactInfo } from "./ContactInfo";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-12 lg:px-24 pb-32 md:pb-48 grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-12 md:gap-20">
        <div className="order-2 md:order-1">
          <ContactInfo />
        </div>
        <div className="order-1 md:order-2">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
