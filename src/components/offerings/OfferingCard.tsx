import Image, { StaticImageData } from "next/image";
import { ArrowIcon } from "@/icons/ArrowIcon";
import { TextHighlightIcon } from "@/icons/TextHighlightIcon";

type OfferingCardProps = {
  title: string;
  description: string;
  image: StaticImageData;
  linkText: string;
  variant: "light" | "dark";
};

export function OfferingCard({
  title,
  description,
  image,
  linkText,
  variant,
}: OfferingCardProps) {
  const isLight = variant === "light";

  const containerClass = isLight
    ? "bg-[#FAFAFA] text-[#0E0E0E] border-[1px] border-[#0E0E0E] shadow-[0_2px_0_0_#0E0E0E] hover:translate-y-[3px] hover:shadow-[0_6px_0_0_#0E0E0E] dark:border-[#FAFAFA] dark:shadow-none dark:hover:shadow-none dark:hover:-translate-y-1"
    : "bg-[#222222] text-[#FAFAFA] border-[1px] border-[#222222] hover:-translate-y-1 dark:border-[#FAFAFA] dark:shadow-[0_2px_0_0_#FAFAFA] dark:hover:translate-y-[3px] dark:hover:shadow-[0_6px_0_0_#FAFAFA]";

  const highlightColor = isLight ? "#87ED82" : "#FAFAFA";
  const circleBg = isLight ? "bg-[#0E0E0E]" : "bg-[#FAFAFA]";
  const arrowColor = isLight ? "#FAFAFA" : "#0E0E0E";

  return (
    <div
      className={`group rounded-2xl sm:rounded-3xl px-5 py-7 sm:px-7 sm:py-8 flex flex-col gap-6 h-full transition-all duration-200 ${containerClass} hover:cursor-pointer`}
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div className="relative self-start inline-block">
        <TextHighlightIcon
          color={highlightColor}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0 }}
        />
        <h3 className="relative z-10 text-lg sm:text-xl font-semibold px-2.5 py-0.5 text-dark">
          {title}
        </h3>
      </div>

      <div className="flex items-center justify-between gap-4 flex-1">
        <p className="text-[13px] leading-relaxed max-w-[60%] pl-2.5">
          {description}
        </p>
        <div className="w-20 h-20 sm:w-24 sm:h-24 relative shrink-0">
          <Image src={image} alt={title} fill className="object-contain" />
        </div>
      </div>

      <button className="flex items-center gap-3 self-start ml-2">
        <span
          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:rotate-45 ${circleBg}`}
        >
          <ArrowIcon color={arrowColor} className="w-3 h-3" />
        </span>
        <span className="text-xs sm:text-xs font-medium hover:underline text-left">
          {linkText}
        </span>
      </button>
    </div>
  );
}
