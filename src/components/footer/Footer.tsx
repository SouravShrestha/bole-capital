import { FooterBrand } from "./FooterBrand";
import { FooterNavColumn, type FooterLink } from "./FooterNavColumn";
import { FooterContact } from "./FooterContact";

const SERVICES: FooterLink[] = [
  { label: "Mutual Funds", href: "/services#mutual-funds" },
  { label: "Portfolio Review", href: "/services#portfolio-review" },
  { label: "Goal-based Investing", href: "/services#goal-based-investing" },
  { label: "PMS / SIF", href: "/services#pms-sif" },
  { label: "Insurance", href: "/services#insurance" },
  { label: "NPS", href: "/services#nps" },
];

const COMPANY: FooterLink[] = [
  { label: "About", href: "/about" },
  { label: "Why Bole Capital", href: "/why-bole-capital" },
  { label: "How you invest", href: "/how-you-invest" },
  { label: "Contact", href: "/contact" },
];

const RESOURCES: FooterLink[] = [
  { label: "SIP Calculator", href: "/resources/sip-calculator" },
  { label: "FAQs", href: "/faq" },
  { label: "Glossary", href: "/glossary" },
  { label: "Sitemap", href: "/sitemap" },
];

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
