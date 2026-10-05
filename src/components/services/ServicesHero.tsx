import { SketchedBracketIcon } from "@/icons/SketchedBracketIcon";
import { LoadReveal, LoadRevealText } from "@/components/motion/LoadReveal";

export function ServicesHero() {
  return (
    <section
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
      className="w-full"
    >
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 md:px-12 pt-16 sm:pt-24 md:pt-24 pb-30 sm:pb-24 md:pb-40 text-center">
        <LoadRevealText
          as="h1"
          className="text-3xl sm:text-4xl font-medium leading-snug sm:leading-snug md:leading-snug"
        >
          Thoughtfully diversified portfolios,
          <span className="block mt-1 md:mt-3">
            built{" "}
            <span className="relative inline-block">
              <SketchedBracketIcon
                className="absolute -left-1 top-0.5 sm:top-1 sm:left-0 w-[2.6em] h-[1.35em] text-(--fg) pointer-events-none"
                color="currentColor"
              />
              <span className="relative sm:ml-2 ml-1">aro</span>
            </span>
            und your goals
          </span>
        </LoadRevealText>
        <LoadReveal
          as="p"
          delay={450}
          className="mt-8 md:mt-12 mx-auto max-w-lg text-sm sm:text-base leading-relaxed opacity-90"
        >
          Choose funds for a reason, not because they are popular. We match them
          to your time horizon, risk profile and plan.
        </LoadReveal>
      </div>
    </section>
  );
}
