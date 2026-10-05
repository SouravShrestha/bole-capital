import { FooterBrand } from "./FooterBrand";
import { FooterNavColumn } from "./FooterNavColumn";
import { FooterContact } from "./FooterContact";
import {
  COMPANY_LINKS as COMPANY,
  RESOURCE_LINKS as RESOURCES,
  SERVICE_LINKS as SERVICES,
} from "@/lib/siteLinks";
import { Reveal } from "@/components/motion/Reveal";
import Link from "next/link";
import {
  DISTRIBUTOR_STATEMENT,
  MARKET_RISK_DISCLAIMER,
  REGULATORY_LINKS,
} from "@/lib/compliance";

export function Footer() {
  return (
    <footer className="w-full">
      {/* Main grid */}
      {/* In the 2-col layout, Company and Contact are pushed after Resources via `order-1`
          so Services and Resources share a row; `lg:order-none` restores DOM order on desktop. */}
      <div className="w-full px-6 md:px-12 lg:px-20 py-20 md:py-32 grid grid-cols-2 lg:flex lg:justify-around gap-10 lg:gap-6">
        <Reveal className="col-span-2 lg:col-span-1">
          <FooterBrand />
        </Reveal>
        <Reveal delay={80}>
          <FooterNavColumn heading="Services" links={SERVICES} />
        </Reveal>
        <Reveal delay={160} className="order-1 lg:order-none">
          <FooterNavColumn heading="Company" links={COMPANY} />
        </Reveal>
        <Reveal delay={240}>
          <FooterNavColumn heading="Resources" links={RESOURCES} />
        </Reveal>
        <Reveal delay={320} className="order-1 lg:order-none col-span-2 lg:col-span-1">
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
        {/* Opacity lives on the text, not the wrapper, so the credit link stays fully opaque.
            0.7 keeps small text above WCAG AA contrast in both themes. */}
        <div className="max-w-3xl mx-auto flex flex-col gap-2 opacity-70 leading-relaxed">
          <p className="font-medium">{MARKET_RISK_DISCLAIMER}</p>
          <p>{DISTRIBUTOR_STATEMENT}</p>
        </div>
        <nav aria-label="Investor resources" className="mt-4">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {REGULATORY_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 opacity-70 hover:opacity-100 hover:cursor-pointer transition-opacity"
                >
                  {label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/grievance-redressal"
                className="underline underline-offset-2 opacity-70 hover:opacity-100 hover:cursor-pointer transition-opacity"
              >
                Grievance Redressal
              </Link>
            </li>
            <li>
              <Link
                href="/terms-of-use"
                className="underline underline-offset-2 opacity-70 hover:opacity-100 hover:cursor-pointer transition-opacity"
              >
                Terms &amp; Disclaimer
              </Link>
            </li>
          </ul>
        </nav>
        <p className="mt-4">
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
