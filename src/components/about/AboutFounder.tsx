import Image from "next/image";
import { DoubleUnderlineIcon } from "@/icons/DoubleUnderlineIcon";
import { LinkedinIcon } from "@/icons/LinkedinIcon";
import founderImg from "@/assets/images/founder.png";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";

export function AboutFounder() {
  return (
    <section
      className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-24 py-24 sm:pt-40 sm:pb-56"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
    >
      <Reveal as="p" variant="fade" className="text-xs sm:text-sm opacity-80 mb-5">
        Get to know us a little more
      </Reveal>
      <RevealText delay={100} className="text-3xl sm:text-4xl font-semibold">
        From{" "}
        <span className="relative inline-block">
          founder&rsquo;s
          <DoubleUnderlineIcon
            className="absolute left-0 -bottom-3 md:-bottom-4 w-full h-auto text-(--fg)"
            color="currentColor"
          />
        </span>{" "}
        lens
      </RevealText>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mt-12 md:mt-24">
        <Reveal
          variant="scale"
          duration={1100}
          className="justify-self-center mt-6"
        >
          <Image
            src={founderImg}
            alt="Hemant Bole, Founder of Bole Capital"
            placeholder="blur"
            className="w-48 sm:w-72 md:w-80 h-auto rounded-sm"
          />
        </Reveal>

        <div className="flex flex-col gap-5 text-sm sm:text-base leading-relaxed mt-6 text-center md:text-left">
          <Reveal as="p" delay={150}>
            I started Bole Capital after seeing how many investors held funds
            they couldn&rsquo;t explain, in portfolios that were never built
            around a plan. I wanted to change that.
          </Reveal>
          <Reveal as="p" delay={280}>
            Today I work with young professionals, families and business owners
            across India to build portfolios with a clear purpose, review them
            regularly and keep decisions calm through market cycles.
          </Reveal>
          <Reveal as="p" variant="fade" delay={450} className="mt-6 leading-7 italic">
            Hemant Bole, <br />
            Founder, Bole Capital
          </Reveal>
          <Reveal variant="fade" delay={550}>
            <a
              href="https://in.linkedin.com/in/hemant-bole-01958ba4"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Find Hemant Bole on LinkedIn (opens in a new tab)"
              className="inline-flex items-center gap-2 text-sm no-underline opacity-80 hover:opacity-100 hover:cursor-pointer transition-opacity"
              style={{ color: "var(--fg)" }}
            >
              <LinkedinIcon width={18} height={18} />
              Find me on LinkedIn
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
