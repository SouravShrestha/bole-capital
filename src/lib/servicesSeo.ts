/**
 * Search metadata for each service. `slug` matches the section id in
 * src/components/services/servicesData.ts and drives both the /services/<slug>
 * alias pages and the in-page #anchors. Pure data so it's testable and safe
 * to import anywhere.
 */
export type ServiceSeo = {
  slug: string;
  /** Short label for links and breadcrumbs. */
  name: string;
  /** Page <title>; the layout template appends " - Bole Capital". */
  seoTitle: string;
  seoDescription: string;
  /** Replaces the hero paragraph on the alias page, so each URL has unique copy. */
  intro: string;
  /** schema.org serviceType. */
  serviceType: string;
};

export const SERVICES_SEO: ServiceSeo[] = [
  {
    slug: "mutual-funds",
    name: "Mutual Funds",
    seoTitle: "Mutual Fund Investments in Dhanbad",
    seoDescription:
      "Goal-based mutual fund portfolios matched to your risk profile and time horizon, from Bole Capital, an AMFI-registered mutual fund distributor in Dhanbad.",
    intro:
      "Mutual funds chosen for a reason, not because they are popular. Each fund is matched to your risk profile, time horizon and plan.",
    serviceType: "Mutual fund distribution",
  },
  {
    slug: "portfolio-review",
    name: "Portfolio Review",
    seoTitle: "Mutual Fund Portfolio Review",
    seoDescription:
      "A clear review of your existing mutual funds: overlap, concentrated risk and fit with your goals, with a plain summary of what to keep, review or rebalance.",
    intro:
      "Already investing? We review what you own, show you where funds overlap or risk is concentrated, and whether it still fits your goals.",
    serviceType: "Investment portfolio review",
  },
  {
    slug: "goal-based-investing",
    name: "Goal-based Investing",
    seoTitle: "Goal-based Investing",
    seoDescription:
      "Link every investment to a goal such as a home, education or retirement, with a timeline, a plan and regular progress reviews.",
    intro:
      "A home, your child's education, retirement. We link each investment to a goal with a timeline, so every rupee has a purpose.",
    serviceType: "Goal-based financial planning",
  },
  {
    slug: "pms-sif",
    name: "PMS / SIF",
    seoTitle: "PMS and SIF (Specialised Investment Funds)",
    seoDescription:
      "Portfolio Management Services and Specialised Investment Funds explained clearly for eligible investors: suitability, fees, lock-ins and risks.",
    intro:
      "For eligible investors, we explain how PMS and SIF strategies work, what they cost and where they may fit in a wider portfolio.",
    serviceType: "Portfolio Management Services and Specialised Investment Funds",
  },
  {
    slug: "insurance",
    name: "Insurance",
    seoTitle: "Life and Health Insurance Planning",
    seoDescription:
      "Life and health cover reviewed against your income, dependants and long-term commitments, explained in plain language.",
    intro:
      "A good plan needs a safety net. We review life and health cover against your responsibilities, so a setback doesn't derail your goals.",
    serviceType: "Insurance planning",
  },
  {
    slug: "nps",
    name: "NPS",
    seoTitle: "National Pension System (NPS)",
    seoDescription:
      "Build a retirement corpus with the National Pension System: regular contributions, asset mix, tax benefits and withdrawal rules explained.",
    intro:
      "Build your retirement corpus one disciplined step at a time, with an NPS asset mix that suits your age and comfort with risk.",
    serviceType: "National Pension System (NPS) enrolment and guidance",
  },
];

export const servicePath = (slug: string) => `/services/${slug}`;

export function getServiceSeo(slug: string): ServiceSeo | undefined {
  return SERVICES_SEO.find((s) => s.slug === slug);
}

/** Matches /services/<known-slug> (with optional trailing slash). */
export function isServiceAliasPath(pathname: string): boolean {
  const match = /^\/services\/([^/]+)\/?$/.exec(pathname);
  return !!match && SERVICES_SEO.some((s) => s.slug === match[1]);
}
