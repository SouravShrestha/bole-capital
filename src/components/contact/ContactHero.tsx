import { LoadReveal, LoadRevealText } from "@/components/motion/LoadReveal";

export function ContactHero() {
  return (
    <section
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
      className="w-full"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-12 lg:px-24 pt-12 sm:pt-16 md:pt-28 pb-20 md:pb-32">
        <LoadReveal
          as="p"
          variant="fade"
          className="text-xs sm:text-sm text-(--fg) mb-6 md:mb-10"
        >
          Contact us
        </LoadReveal>
        <LoadRevealText as="h1" delay={100} className="text-3xl sm:text-4xl font-medium">
          Leave us a note
          <span className="block opacity-70 mt-2 md:mt-4">
            and we&rsquo;ll get back to you soon
          </span>
        </LoadRevealText>
      </div>
    </section>
  );
}
