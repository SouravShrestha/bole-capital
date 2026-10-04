import { NAV_LINKS } from "@/components/navbar/navConfig";

/**
 * Single source of truth for site-wide link groups. The footer columns and
 * the /sitemap page both render from these, so they can't drift apart.
 */
export type SiteLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type SiteLinkSection = {
  heading: string;
  links: SiteLink[];
};

export const SERVICE_LINKS: SiteLink[] = [
  { label: "Mutual Funds", href: "/services#mutual-funds" },
  { label: "Portfolio Review", href: "/services#portfolio-review" },
  { label: "Goal-based Investing", href: "/services#goal-based-investing" },
  { label: "PMS / SIF", href: "/services#pms-sif" },
  { label: "Insurance", href: "/services#insurance" },
  { label: "NPS", href: "/services#nps" },
];

export const COMPANY_LINKS: SiteLink[] = [
  { label: "About", href: "/about" },
  { label: "Why Bole Capital", href: "/about#why-bole-capital" },
  { label: "How you invest", href: "/about#how-you-invest" },
  { label: "Contact", href: "/contact" },
];

export const RESOURCE_LINKS: SiteLink[] = [
  { label: "SIP Calculator", href: "/resources/sip-calculator" },
  { label: "FAQs", href: "/faq" },
  { label: "Glossary", href: "/glossary" },
  { label: "Sitemap", href: "/sitemap" },
];

/** Every section shown on the /sitemap page, in display order. */
export const SITEMAP_SECTIONS: SiteLinkSection[] = [
  { heading: "Pages", links: NAV_LINKS.map(({ label, href }) => ({ label, href })) },
  { heading: "Services", links: SERVICE_LINKS },
  { heading: "Company", links: COMPANY_LINKS },
  {
    heading: "Resources",
    links: [{ label: "All resources", href: "/resources" }, ...RESOURCE_LINKS],
  },
];
