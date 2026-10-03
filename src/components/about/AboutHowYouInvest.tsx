import Image from "next/image";
import { SketchedLineIcon } from "@/icons/SketchedLineIcon";
import assetPlusLogo from "@/assets/images/logo-asset-plus.png";

export function AboutHowYouInvest() {
  return (
    <section
      className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-24 pb-24 sm:pb-40 mt-8"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
    >
      <h2 className="relative inline-block text-3xl sm:text-4xl font-semibold">
        How you invest?
        <SketchedLineIcon
          className="absolute left-0 -bottom-3 md:-bottom-4 w-[2/5] h-2.5 text-(--fg)"
          color="currentColor"
        />
      </h2>

      <div className="flex flex-col gap-8 max-w-2xl mt-20 sm:mt-24 text-sm sm:text-base leading-relaxed">
        <p className="text-base sm:text-lg opacity-70">
          Simple, transparent and online.
        </p>
        <p>
          Bole Capital works with AssetPlus as its investment platform partner.
          Once your plan is ready, you complete your investments and track your
          portfolio online through the platform, while we stay with you on
          strategy, reviews and questions.
        </p>
        <a
          href="https://www.partners.assetplus.in/aboutus"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-fit"
        >
          <Image
            src={assetPlusLogo}
            alt="AssetPlus - Partner. Grow. Succeed."
            className="w-32 sm:w-40 h-auto"
          />
        </a>
      </div>
    </section>
  );
}
