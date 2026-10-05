import testimonialData from "@/data/testimonials.json";
import type { Testimonial } from "@/types/testimonial";
import { TestimonialsCarousel } from "./TestimonialsCarousel";
import { SwooshCircleIcon } from "@/icons/SwooshCircleIcon";
import { RevealText } from "@/components/motion/RevealText";

const testimonials = testimonialData as Testimonial[];

export function TestimonialsSection() {
  return (
    <section className="py-8 sm:py-16 px-5 sm:px-8 md:px-12 lg:px-24 mx-auto w-full mt-4 sm:mt-6">
      <RevealText
        className="text-2xl sm:text-3xl md:text-4xl font-medium leading-snug"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        What do our
        <br />
        clients{" "}
        <span className="relative inline-block px-2 sm:px-4">
          say?
          <SwooshCircleIcon
            className="absolute inset-0 w-full h-10 md:h-16 text-(--fg)"
            preserveAspectRatio="none"
          />
        </span>
      </RevealText>

      <TestimonialsCarousel testimonials={testimonials} />
    </section>
  );
}
