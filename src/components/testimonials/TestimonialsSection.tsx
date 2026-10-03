import { TestimonialCard } from "./TestimonialCard";
import { SwooshCircleIcon } from "@/icons/SwooshCircleIcon";

const testimonials = [
  {
    quote:
      "I had never invested before and didn't know where to start. Bole Capital explained everything in plain language and helped me set up a plan I actually understand.",
    rotation: -1,
  },
  {
    quote:
      "I owned a dozen funds and couldn't tell what each one was doing. The portfolio review showed me where things overlapped and gave me a clear structure to follow.",
    rotation: 3,
  },
  {
    quote:
      "What I value most is the communication. We get regular reviews, honest answers and no pressure to buy anything we don't need.",
    rotation: 0,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-8 sm:py-16 px-5 sm:px-8 md:px-12 lg:px-24 mx-auto w-full mt-4 sm:mt-6">
      <h2
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
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 my-16 sm:my-16 md:my-20">
        {testimonials.map((t, index) => (
          <TestimonialCard key={index} {...t} />
        ))}
      </div>
    </section>
  );
}
