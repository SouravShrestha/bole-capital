import Image from "next/image";
import heroImage from "@/assets/images/hero-image.png";
import { BuildsUnderline } from "@/icons/BuildsUnderline";
import { IconButton } from "@/components/ui/IconButton";
import { ChevronRightIcon } from "@/icons/ChevronRightIcon";
import { Float } from "@/components/motion/Float";
import { LoadReveal, LoadRevealText } from "@/components/motion/LoadReveal";
import { COMPLIANCE } from "@/lib/compliance";

export function HeroSection() {
  return (
    <section
      style={{ color: "var(--fg)" }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-24 py-12 sm:py-16 md:py-24 xl:pt-34 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left column */}
        <div className="flex flex-col gap-8 sm:gap-10 md:gap-14 order-2 md:order-1">
          {/* Heading */}
          <LoadRevealText
            as="h1"
            stagger={80}
            className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl leading-tight font-medium"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Clarity{" "}
            <span className="relative inline-block">
              builds
              <BuildsUnderline
                className="absolute left-0 -bottom-2 w-full h-auto"
                style={{ color: "var(--fg)" } as React.CSSProperties}
              />
            </span>{" "}
            wealth
          </LoadRevealText>

          {/* Subtitle */}
          <LoadReveal
            as="p"
            delay={250}
            className="text-sm sm:text-base md:text-lg leading-relaxed max-w-sm sm:max-w-md"
            style={{
              fontFamily: "var(--font-poppins)",
              color: "var(--fg)",
              opacity: 0.75,
            }}
          >
            A disciplined approach to investing, protection and long-term wealth
            creation. Built around your goals, guided by strategy rather than
            products.
          </LoadReveal>

          {/* CTA */}
          <LoadReveal delay={400}>
            <IconButton
              as="link"
              href="https://wa.me/917827301069"
              target="_blank"
              rel="noopener noreferrer"
              icon={<ChevronRightIcon />}
            >
              Start your wealth journey
            </IconButton>
          </LoadReveal>

          {/* AMFI badge */}
          <LoadReveal
            variant="fade"
            delay={550}
            className="flex flex-col gap-1.5"
            style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "0.75rem",
              opacity: 0.55,
            }}
          >
            <span>AMFI Registered Mutual Fund Distributor</span>
            <span>ARN: {COMPLIANCE.arnNumber}</span>
          </LoadReveal>
        </div>

        {/* Right column - hero image */}
        <LoadReveal
          variant="scale"
          duration={1100}
          className="relative w-full flex justify-center md:justify-end mt-4 md:mt-0 order-2"
        >
          <Float className="w-full flex justify-center md:justify-end">
            <Image
              src={heroImage}
              alt="Wealth management dashboard illustration"
              className="w-[75%] md:w-[90%] max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-full object-contain"
              priority
            />
          </Float>
        </LoadReveal>
      </div>
    </section>
  );
}
