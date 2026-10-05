import Image from "next/image";
import { SketchedLineIcon } from "@/icons/SketchedLineIcon";
import assetPlusLogo from "@/assets/images/logo-asset-plus.png";
import appMockup from "@/assets/images/asset-plus-app-mockup.png";
import { IconButton } from "@/components/ui/IconButton";
import { ChevronRightIcon } from "@/icons/ChevronRightIcon";
import { ASSETPLUS_URL } from "@/lib/siteLinks";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { ShieldIcon } from "@/icons/ShieldIcon";
import { PiggybankIcon } from "@/icons/PiggybankIcon";
import { LayerIcon } from "@/icons/LayerIcon";
import { FamilyIcon } from "@/icons/FamilyIcon";

// Placeholder icons from the existing set; swap in dedicated ones later.
const FEATURES = [
  { label: "Paperless Digital KYC", Icon: ShieldIcon },
  { label: "SIP & Lumpsum Investing", Icon: PiggybankIcon },
  { label: "Real-Time Portfolio Tracking", Icon: LayerIcon },
  { label: "Dedicated Advisor", Icon: FamilyIcon },
];

export function AboutHowYouInvest() {
  return (
    <section
      id="how-you-invest"
      className="scroll-mt-6 sm:scroll-mt-12 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-24 pb-24 sm:pb-40 mt-8"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
    >
      <RevealText className="relative inline-block text-3xl sm:text-4xl font-semibold">
        How you invest?
        <SketchedLineIcon
          className="absolute left-0 -bottom-3 md:-bottom-4 w-[2/5] h-2.5 text-(--fg)"
          color="currentColor"
        />
      </RevealText>

      {/*
        Grid layout: from lg, the mockup sits in column 2 / row 1, centred
        against the intro + feature cards only; the partner logo + CTA drop to
        row 2. On lg the mockup column is capped so the text keeps most of the
        width; on xl the content column is sized to fit the feature pills on one
        line. Below lg, DOM order (content, CTA, mockup) keeps the image last.
      */}
      <div className="mt-20 sm:mt-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] xl:grid-cols-[auto_minmax(0,1fr)] gap-y-14 lg:gap-x-12 xl:gap-x-16 items-center text-sm sm:text-base leading-relaxed">
      <div className="flex flex-col gap-8 max-w-2xl">
        <Reveal as="p" className="text-base sm:text-lg opacity-70">
          Simple, transparent and online.
        </Reveal>
        <Reveal as="p" delay={120}>
          Investing should feel easy, and that&apos;s why we use AssetPlus, a SEBI-regulated platform powered by BSE. Finish your KYC digitally in minutes, explore 2,000+ mutual fund schemes from 40+ AMCs, and lean on our team whenever you need a hand.
        </Reveal>
        <Reveal as="ul" delay={160} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {FEATURES.map(({ label, Icon }) => (
            <li
              key={label}
              className="flex items-center gap-4 rounded-xl border px-5 py-4 sm:py-4"
              style={{
                backgroundColor: "var(--card-back-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <Icon className="w-4 h-4 shrink-0 opacity-80" />
              <span className="text-sm sm:text-base xl:whitespace-nowrap">{label}</span>
            </li>
          ))}
        </Reveal>
      </div>
      <div className="flex flex-col gap-8 max-w-2xl lg:col-start-1 lg:row-start-2">
        <a
          href={ASSETPLUS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="AssetPlus (opens in a new tab)"
          className="w-fit hover:cursor-pointer"
        >
          <Image
            src={assetPlusLogo}
            alt="AssetPlus - Partner. Grow. Succeed."
            className="w-32 sm:w-40 h-auto"
          />
        </a>
        <Reveal delay={200} className="flex flex-col gap-3">
          <IconButton
            as="link"
            href={ASSETPLUS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit"
            icon={<ChevronRightIcon />}
          >
            Get started on AssetPlus
            <span className="sr-only"> (opens in a new tab)</span>
          </IconButton>
          <p className="text-xs sm:text-sm opacity-60 mt-2">
            *You&rsquo;ll be taken to AssetPlus, our investment platform
            partner. Your account and transactions are held there.
          </p>
        </Reveal>
      </div>
      <Reveal delay={120} className="flex justify-center lg:justify-end lg:col-start-2 lg:row-start-1">
        <Image
          src={appMockup}
          alt="AssetPlus app showing portfolio and investment screens"
          className="w-full max-w-sm sm:max-w-md lg:max-w-sm h-auto lg:origin-right lg:scale-115 lg:translate-x-10 xl:translate-x-16"
          sizes="(min-width: 1280px) 442px, (min-width: 1024px) 332px, (min-width: 640px) 448px, 384px"
        />
      </Reveal>
      </div>
    </section>
  );
}
