import { FooterBrand } from "./FooterBrand";
import { FooterNavColumn } from "./FooterNavColumn";
import { FooterContact } from "./FooterContact";
import {
  COMPANY_LINKS as COMPANY,
  RESOURCE_LINKS as RESOURCES,
  SERVICE_LINKS as SERVICES,
} from "@/lib/siteLinks";
import { Reveal } from "@/components/motion/Reveal";

export function Footer() {
  return (
    <footer className="w-full">
      {/* Main grid */}
      <div className="w-full px-6 md:px-12 lg:px-20 py-20 md:py-32 grid grid-cols-2 lg:flex lg:justify-around gap-10 lg:gap-6">
        <Reveal className="col-span-2 lg:col-span-1">
          <FooterBrand />
        </Reveal>
        <Reveal delay={80}>
          <FooterNavColumn heading="Services" links={SERVICES} />
        </Reveal>
        <Reveal delay={160}>
          <FooterNavColumn heading="Company" links={COMPANY} />
        </Reveal>
        <Reveal delay={240}>
          <FooterNavColumn heading="Resources" links={RESOURCES} />
        </Reveal>
        <Reveal delay={320} className="col-span-2 lg:col-span-1">
          <FooterContact />
        </Reveal>
      </div>

      {/* Regulatory disclaimer bar */}
      <div
        className="px-6 md:px-12 lg:px-20 pt-4 pb-6 text-center text-xs"
        style={{
          fontFamily: "var(--font-poppins), sans-serif",
          color: "var(--fg)",
        }}
      >
        {/* Opacity lives on the text, not the wrapper, so the credit link stays fully opaque */}
        <p className="opacity-40">
          Mutual fund investments are subject to market risks. Read all scheme
          related documents carefully before investing.
        </p>
        <p className="mt-3">
          <span className="opacity-40">Website designed and developed by </span>
          <a
            href="https://cbsdev.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7f5dde] hover:cursor-pointer"
          >
            @CBSDev
          </a>
        </p>
      </div>
    </footer>
  );
}
