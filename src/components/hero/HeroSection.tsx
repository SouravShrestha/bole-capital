import Image from "next/image";
import heroImage from "@/assets/images/hero-image.png";
import { BuildsUnderline } from "@/icons/BuildsUnderline";
import { IconButton } from "@/components/ui/IconButton";
import { ChevronRightIcon } from "@/icons/ChevronRightIcon";

export function HeroSection() {
  return (
    <section
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--fg)",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-24 py-12 sm:py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center xl:mt-10">
        {/* Left column */}
        <div className="flex flex-col gap-8 sm:gap-10 md:gap-14 order-2 md:order-1">
          {/* Heading */}
          <h1
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
          </h1>

          {/* Subtitle */}
          <p
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
          </p>

          {/* CTA */}
          <div>
            <IconButton
              as="link"
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              icon={<ChevronRightIcon />}
            >
              Start your wealth journey
            </IconButton>
          </div>

          {/* AMFI badge */}
          <div
            className="flex flex-col gap-1.5"
            style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "0.75rem",
              opacity: 0.55,
            }}
          >
            <span>AMFI Registered Mutual Fund Distributor</span>
            <span>ARN: 366194</span>
          </div>
        </div>

        {/* Right column - hero image */}
        <div className="relative w-full flex justify-center md:justify-end mt-4 md:mt-0 order-2">
          <Image
            src={heroImage}
            alt="Wealth management dashboard illustration"
            className="w-[75%] md:w-[90%] max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-full object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
