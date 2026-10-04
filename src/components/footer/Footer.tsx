import { FooterBrand } from "./FooterBrand";
import { FooterNavColumn } from "./FooterNavColumn";
import { FooterContact } from "./FooterContact";
import {
  COMPANY_LINKS as COMPANY,
  RESOURCE_LINKS as RESOURCES,
  SERVICE_LINKS as SERVICES,
} from "@/lib/siteLinks";

export function Footer() {
  return (
    <footer className="w-full">
      {/* Main grid */}
      <div className="w-full px-6 md:px-12 lg:px-20 py-20 md:py-32 grid grid-cols-2 lg:flex lg:justify-around gap-10 lg:gap-6 bg-(--bg)">
        <div className="col-span-2 lg:col-span-1">
          <FooterBrand />
        </div>
        <FooterNavColumn heading="Services" links={SERVICES} />
        <FooterNavColumn heading="Company" links={COMPANY} />
        <FooterNavColumn heading="Resources" links={RESOURCES} />
        <div className="col-span-2 lg:col-span-1">
          <FooterContact />
        </div>
      </div>

      {/* Regulatory disclaimer bar */}
      <div
        className="px-6 md:px-12 lg:px-20 pt-4 pb-6 text-center text-xs opacity-40"
        style={{
          fontFamily: "var(--font-poppins), sans-serif",
          color: "var(--fg)",
        }}
      >
        Mutual fund investments are subject to market risks. Read all scheme
        related documents carefully before investing.
      </div>
    </footer>
  );
}
