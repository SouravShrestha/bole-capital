import Image from "next/image";
import { DoubleUnderlineIcon } from "@/icons/DoubleUnderlineIcon";
import founderImg from "@/assets/images/founder.png";

export function AboutFounder() {
  return (
    <section
      className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-24 py-24 sm:pt-40 sm:pb-56"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
    >
      <p className="text-xs sm:text-sm opacity-80 mb-5">
        Get to know us a little more
      </p>
      <h2 className="text-3xl sm:text-4xl font-semibold">
        From{" "}
        <span className="relative inline-block">
          founder&rsquo;s
          <DoubleUnderlineIcon
            className="absolute left-0 -bottom-3 md:-bottom-4 w-full h-auto text-(--fg)"
            color="currentColor"
          />
        </span>{" "}
        lens
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mt-12 md:mt-24">
        <div className="justify-self-center mt-6">
          <Image
            src={founderImg}
            alt="Hemant Bole, Founder of Bole Capital"
            placeholder="blur"
            className="w-48 sm:w-72 md:w-80 h-auto rounded-sm"
          />
        </div>

        <div className="flex flex-col gap-5 max-w-md text-sm sm:text-base leading-relaxed mt-6 text-center sm:text-left">
          <p>
            I started Bole Capital after seeing how many investors held funds
            they couldn&rsquo;t explain, in portfolios that were never built
            around a plan. I wanted to change that.
          </p>
          <p>
            Today I work with young professionals, families and business owners
            across India to build portfolios with a clear purpose, review them
            regularly and keep decisions calm through market cycles.
          </p>
          <p className="mt-6 leading-7 italic">
            Hemant Bole, <br />
            Founder, Bole Capital
          </p>
        </div>
      </div>
    </section>
  );
}
