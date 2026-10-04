import type { Metadata } from "next";

export const SITE_URL = "https://bolecapital.in";
export const SITE_NAME = "Bole Capital";
export const SITE_DESCRIPTION =
  "Bole Capital helps individuals and families build and protect wealth through a disciplined, long-term approach.";

/** Bump when site content changes. Drives the footer date and sitemap.xml <lastmod>. */
export const SITE_LAST_UPDATED = "2026-10-05";

export const CONTACT = {
  email: "hello@bolecapital.in",
  telephone: "+91-9971301069",
  address: {
    streetAddress: "",
    addressLocality: "Dhanbad",
    addressRegion: "Jharkhand",
    postalCode: "826001",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.instagram.com/bolecapital",
    "https://www.linkedin.com/company/bolecapital",
  ],
} as const;

type PageSeo = {
  /** Short page title; the root layout template appends " - Bole Capital". */
  title: string;
  description: string;
  /** Path relative to the site root, e.g. "/about". */
  path: string;
  keywords?: string[];
};

/**
 * Per-page metadata with canonical URL, Open Graph and Twitter tags.
 * Nested `openGraph`/`twitter` objects replace (not merge with) the layout's,
 * so the shared fields are repeated here.
 */
export function pageMetadata({ title, description, path, keywords }: PageSeo): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_IN",
      url: path,
      title: `${title} - ${SITE_NAME}`,
      description,
    },
    twitter: {
      card: "summary",
      title: `${title} - ${SITE_NAME}`,
      description,
    },
  };
}

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();
