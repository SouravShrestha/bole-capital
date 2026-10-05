import { IconButton } from "@/components/ui/IconButton";
import { ChevronRightIcon } from "@/icons/ChevronRightIcon";
import { LoadReveal, LoadRevealText } from "@/components/motion/LoadReveal";

export function AboutHero() {
  return (
    <section
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
      className="w-full"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-12 lg:px-24 pt-12 sm:pt-16 md:pt-32 pb-12 sm:pb-16 md:pb-32">
        <LoadReveal
          as="p"
          variant="fade"
          className="text-xs sm:text-sm text-[#1DB954] mb-6 md:mb-10"
        >
          This is Bole Capital
        </LoadReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          <LoadRevealText
            as="h1"
            delay={100}
            className="text-3xl sm:text-4xl lg:text-4xl font-medium"
          >
            We set out to build
            <span className="block opacity-70 mt-2 md:mt-4">
              a better way to invest
            </span>
          </LoadRevealText>
          <div className="flex flex-col gap-8 md:gap-12 items-start md:pt-2">
            <LoadReveal
              as="p"
              delay={350}
              className="text-sm sm:text-base leading-relaxed opacity-90 max-w-md sm:-mt-8"
            >
              Good financial decisions don&rsquo;t need to be complicated. Bole
              Capital was built to create a more personal and transparent
              investment experience for individuals and families.
            </LoadReveal>
            <LoadReveal delay={500}>
              <IconButton as="link" href="/contact" icon={<ChevronRightIcon />}>
                Start your wealth journey
              </IconButton>
            </LoadReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
