import { NAV_LINKS } from "@/components/navbar/navConfig";
import { COMPLIANCE } from "@/lib/compliance";
import { SERVICES_SEO, servicePath } from "@/lib/servicesSeo";

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

/**
 * Bole Capital's AssetPlus onboarding/login portal. The ARN in the path is
 * what attributes signups to Bole Capital, so always reference this constant
 * rather than retyping the URL.
 */
export const ASSETPLUS_URL = `https://www.assetplus.in/mfd/${COMPLIANCE.arn}`;

export const INVEST_ONLINE_LINK = {
  label: "AssetPlus login",
  href: ASSETPLUS_URL,
  ariaLabel: "Invest online on AssetPlus (opens in a new tab)",
} as const;

/** Each service has its own crawlable alias URL (/services/<slug>). */
export const SERVICE_LINKS: SiteLink[] = SERVICES_SEO.map(({ name, slug }) => ({
  label: name,
  href: servicePath(slug),
}));

export const COMPANY_LINKS: SiteLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Why Bole Capital", href: "/about#why-bole-capital" },
  { label: "How you invest", href: "/about#how-you-invest" },
  { label: "Contact", href: "/contact" },
  { label: INVEST_ONLINE_LINK.label, href: ASSETPLUS_URL, external: true },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Commission Disclosures", href: "/commission-disclosures" },
  { label: "Grievance Redressal", href: "/grievance-redressal" },
  { label: "Terms of Use", href: "/terms-of-use" },
];

export const RESOURCE_LINKS: SiteLink[] = [
  { label: "SIP Calculator", href: "/resources/sip-calculator" },
  { label: "Goal Planner", href: "/resources/goal-planner" },
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
