import Link from "next/link";
import { ArrowIcon } from "@/icons/ArrowIcon";
import { QuoteIcon } from "@/icons/QuoteIcon";
import { VerifiedIcon } from "@/icons/VerifiedIcon";
import { Reveal } from "@/components/motion/Reveal";

const services = [
  { label: "Mutual funds", filled: true, rotate: -3 },
  { label: "SIF", filled: false, rotate: -12 },
  { label: "PMS", filled: false, rotate: -4 },
  { label: "Insurance", filled: true, rotate: 4 },
  { label: "NPS", filled: false, rotate: -3 },
  { label: "Portfolio review", filled: false, rotate: 12 },
  { label: "Goal based planning", filled: true, rotate: -3 },
];

const credentials = [
  "NISM certified",
  "AMFI registered",
  "7+ years in the markets",
];

const cardClass =
  "rounded-2xl sm:rounded-3xl border border-(--fg) bg-(--surface) shadow-[0_2px_0_0_var(--fg)]";

export function AboutHighlights() {
  return (
    <section
      className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-24 pb-16 sm:pb-24 mt-14"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        <Reveal
          className={`${cardClass} p-6 sm:p-8 flex flex-col gap-8 min-h-64`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-medium">Services</h2>
            <Link
              href="/services"
              aria-label="View services"
              className="w-7 h-7 rounded-full bg-(--fg) flex items-center justify-center transition-transform hover:rotate-45 hover:cursor-pointer"
            >
              <ArrowIcon color="var(--bg)" className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-4 items-center justify-center my-auto">
            {services.map(({ label, filled, rotate }, index) => (
              <Reveal
                as="span"
                key={label}
                variant="scale"
                delay={250 + index * 70}
                className="inline-block"
              >
                <span
                  style={{ transform: `rotate(${rotate}deg)` }}
                  className={`inline-block px-4 md:px-3 py-2 rounded-full border text-xs sm:text-sm border-(--fg) ${
                    filled ? "bg-(--fg) text-(--bg)" : ""
                  }`}
                >
                  {label}
                </span>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <div className="flex flex-col gap-8">
          <Reveal
            delay={120}
            className="rounded-2xl sm:rounded-3xl bg-(--fg) text-(--bg) p-6 sm:p-8 flex flex-col gap-3"
          >
            <h2 className="text-xl sm:text-2xl font-medium">Pan-India</h2>
            <p className="text-sm">online and in-person services</p>
          </Reveal>
          <Reveal
            as="ul"
            delay={200}
            className={`${cardClass} p-6 sm:p-8 flex flex-col gap-4 flex-1 justify-center`}
          >
            {credentials.map((item, index) => (
              <Reveal
                as="li"
                key={item}
                variant="left"
                delay={350 + index * 100}
                className="flex items-center gap-3 text-sm"
              >
                <VerifiedIcon color="var(--fg)" className="w-5 h-5 shrink-0" />
                {item}
              </Reveal>
            ))}
          </Reveal>
        </div>

        <Reveal
          as="figure"
          delay={280}
          className={`${cardClass} p-6 sm:p-8 flex flex-col gap-4 min-h-72`}
        >
          <QuoteIcon color="var(--fg)" className="w-6 h-6" />
          <blockquote className="text-sm sm:text-base leading-relaxed">
            Clear, honest and never pushy. Every recommendation came with a
            plain-English explanation, and I never felt pressured to buy
            anything I didn&apos;t need. I finally understand what I own and
            why, and I feel far more confident about my financial future.
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
