import { QuoteIcon } from "@/icons/QuoteIcon";

type TestimonialCardProps = {
  quote: string;
  name: string;
  designation: string;
  rotation?: number;
};

export function TestimonialCard({
  quote,
  name,
  designation,
  rotation = 0,
}: TestimonialCardProps) {
  return (
    <figure
      className="relative w-full max-w-sm mx-auto"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-3xl border-2 translate-x-1.5 translate-y-1.5 -rotate-1"
        style={{
          backgroundColor: "var(--card-back-bg)",
          borderColor: "var(--card-border)",
        }}
      />
      <div
        className="relative rounded-3xl border-2 bg-(--bg) p-8 sm:p-10 min-h-64 sm:min-h-72 flex flex-col gap-6"
        style={{ borderColor: "var(--card-border)", color: "var(--fg)" }}
      >
        <QuoteIcon className="w-6 h-6 sm:w-7 sm:h-7" color="var(--fg)" />
        <blockquote
          className="text-sm sm:text-base leading-relaxed"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          <p>{quote}</p>
        </blockquote>
        {/* mt-auto pins the attribution to the bottom so cards line up */}
        <figcaption
          className="mt-auto flex flex-col gap-1"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          <span className="text-sm sm:text-base font-medium">{name}</span>
          <span className="text-xs sm:text-sm opacity-60">{designation}</span>
        </figcaption>
      </div>
    </figure>
  );
}
