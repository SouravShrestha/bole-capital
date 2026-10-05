import Link from "next/link";
import type { Faq, FaqCategory } from "@/types/faq";
import { PlusIcon } from "@/icons/PlusIcon";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";

// Hand-picked questions most relevant to someone exploring resources.
const FEATURED_IDS = [
  "getting-started-2",
  "getting-started-1",
  "managing-2",
  "advice-4",
  "risk-1",
];

export function PopularQuestions({ categories }: { categories: FaqCategory[] }) {
  const all = new Map<string, Faq>(
    categories.flatMap((c) => c.faqs.map((f) => [f.id, f] as const))
  );
  const featured = FEATURED_IDS.map((id) => all.get(id)).filter(
    (f): f is Faq => Boolean(f)
  );

  if (featured.length === 0) return null;

  return (
    <section
      className="w-full"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
      aria-labelledby="popular-questions-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-12 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 mt-4 md:mt-12">
        <div>
          <RevealText
            id="popular-questions-heading"
            className="text-2xl sm:text-3xl font-medium"
          >
            Popular questions
          </RevealText>
          <Reveal
            as="p"
            delay={150}
            className="mt-4 text-sm leading-relaxed opacity-70 max-w-xs"
          >
            A few of the things investors ask us before they start.
          </Reveal>
          <Link
            href="/faq"
            className="block w-fit ml-auto lg:ml-0 mt-6 text-sm font-medium underline underline-offset-4 hover:opacity-80 hover:cursor-pointer"
          >
            See all FAQs
          </Link>
        </div>

        {/* Native <details> keeps this section server-rendered with no JS. */}
        <div className="border-t" style={{ borderColor: "var(--card-border)" }}>
          {featured.map((faq, index) => (
            <Reveal
              as="details"
              key={faq.id}
              delay={index * 80}
              className="group border-b"
              style={{ borderColor: "var(--card-border)" }}
            >
              <summary className="flex items-start justify-between gap-4 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:opacity-80 transition-opacity">
                <h3 className="text-base md:text-lg font-normal">
                  {faq.question}
                </h3>
                <PlusIcon className="w-6 h-6 shrink-0 mt-0.5 transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="pb-6 text-sm md:text-base leading-relaxed opacity-70 max-w-2xl font-inter">
                {faq.answer}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
