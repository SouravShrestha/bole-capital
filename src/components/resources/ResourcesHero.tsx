import { DoubleUnderlineIcon } from "@/icons/DoubleUnderlineIcon";
import { LoadReveal, LoadRevealText } from "@/components/motion/LoadReveal";

export function ResourcesHero() {
  return (
    <section
      className="w-full"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
    >
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 md:px-12 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
        <LoadReveal
          as="p"
          variant="fade"
          className="text-xs sm:text-sm tracking-wider opacity-60 mb-6"
        >
          Resources
        </LoadReveal>
        <LoadRevealText
          as="h1"
          delay={100}
          className="text-3xl sm:text-4xl md:text-5xl font-medium leading-snug"
        >
          Tools and answers for{" "}
          <span className="relative inline-block">
            clearer
            <DoubleUnderlineIcon
              className="absolute left-0 -bottom-2 sm:-bottom-3 w-full h-auto text-(--fg)"
              color="currentColor"
            />
          </span>{" "}
          decisions
        </LoadRevealText>
        <LoadReveal
          as="p"
          delay={450}
          className="mt-8 md:mt-10 mx-auto max-w-lg text-sm sm:text-base leading-relaxed opacity-70"
        >
          Plan your investments with our calculator, or find quick answers to
          the questions investors ask us most.
        </LoadReveal>
      </div>
    </section>
  );
}
