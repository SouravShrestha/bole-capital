import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { SITEMAP_SECTIONS } from "@/lib/siteLinks";
import { ExternalLinkIcon } from "@/icons/ExternalLinkIcon";

export const metadata: Metadata = pageMetadata({
  title: "Sitemap",
  description: "Every page and section on the Bole Capital website.",
  path: "/sitemap",
});

export default function SitemapPage() {
  return (
    <main id="main-content"
      className="min-h-screen pt-32 pb-32 md:pb-48 px-6 md:px-12 lg:px-24 text-(--fg)"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <p className="text-sm font-normal tracking-widest opacity-60 md:mb-6 mb-4">
            Resources
          </p>
          <h1 className="text-4xl md:text-5xl font-medium tracking-wide">
            Sitemap
          </h1>
          <p className="mt-6 md:mt-8 text-sm md:text-base opacity-70 max-w-xl mx-auto">
            Everything on the Bole Capital website, in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 sm:gap-12">
          {SITEMAP_SECTIONS.map(({ heading, links }) => (
            <section key={heading} aria-labelledby={`sitemap-${heading}`}>
              <h2
                id={`sitemap-${heading}`}
                className="text-sm tracking-widest opacity-70 pb-6 border-b"
                style={{ borderColor: "var(--card-border)" }}
              >
                {heading}
              </h2>
              <ul className="flex flex-col gap-4 list-none p-0 mt-6">
                {links.map(({ label, href, external }) => (
                  <li key={href}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm md:text-base no-underline opacity-80 hover:opacity-100 hover:underline hover:cursor-pointer underline-offset-4 transition-opacity"
                        style={{ color: "var(--fg)" }}
                      >
                        {label}
                        <ExternalLinkIcon width={11} height={11} />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="text-sm md:text-base no-underline opacity-80 hover:opacity-100 hover:underline hover:cursor-pointer underline-offset-4 transition-opacity"
                        style={{ color: "var(--fg)" }}
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
