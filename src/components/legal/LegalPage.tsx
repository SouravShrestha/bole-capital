import type { ReactNode } from "react";
import Link from "next/link";
import { LoadReveal, LoadRevealText } from "@/components/motion/LoadReveal";
import { Reveal } from "@/components/motion/Reveal";
import { CONTACT } from "@/lib/seo";

/**
 * Shared layout for text-heavy policy pages (same structure as
 * /privacy-policy and /commission-disclosures).
 */
export type LegalSection = { id: string; heading: string; body: ReactNode[] };

export const legalLinkClass =
  "underline underline-offset-4 hover:opacity-100 hover:cursor-pointer";

export const LegalEmail = () => (
  <a href={`mailto:${CONTACT.email}`} className={legalLinkClass} style={{ color: "var(--fg)" }}>
    {CONTACT.email}
  </a>
);

/** "+91-7827301069" -> "+91 78273 01069" */
function displayPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const local = digits.slice(-10);
  return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
}

export const LegalPhones = () => (
  <>
    {CONTACT.telephone.map((phone, i) => (
      <span key={phone}>
        {i > 0 && ", "}
        <a
          href={`tel:${phone.replace(/[^\d+]/g, "")}`}
          className={legalLinkClass}
          style={{ color: "var(--fg)" }}
        >
          {displayPhone(phone)}
        </a>
      </span>
    ))}
  </>
);

type LegalPageProps = {
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
  closingPrompt: string;
};

export function LegalPage({ title, intro, sections, closingPrompt }: LegalPageProps) {
  return (
    <main
      id="main-content"
      className="min-h-screen pt-32 pb-32 md:pb-48 px-6 md:px-12 lg:px-24 text-(--fg)"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <LoadReveal
            as="p"
            variant="fade"
            className="text-sm font-normal tracking-widest opacity-60 md:mb-6 mb-4"
          >
            Company
          </LoadReveal>
          <LoadRevealText as="h1" delay={100} className="text-4xl md:text-5xl font-medium tracking-wide">
            {title}
          </LoadRevealText>
          <LoadReveal
            as="p"
            delay={350}
            className="mt-6 md:mt-8 text-sm md:text-base opacity-70 max-w-xl mx-auto"
          >
            {intro}
          </LoadReveal>
        </div>

        <div className="flex flex-col gap-12 md:gap-16">
          {sections.map(({ id, heading, body }) => (
            <Reveal as="section" key={id} id={id} aria-labelledby={`${id}-heading`}>
              <h2
                id={`${id}-heading`}
                className="text-lg md:text-xl font-medium pb-4 border-b"
                style={{ borderColor: "var(--card-border)" }}
              >
                {heading}
              </h2>
              <div className="flex flex-col gap-4 mt-6">
                {body.map((p, i) => (
                  <p key={i} className="text-sm md:text-base leading-7 opacity-80">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-16 md:mt-24 text-sm opacity-60 text-center">
          {closingPrompt}{" "}
          <Link href="/contact" className={legalLinkClass} style={{ color: "var(--fg)" }}>
            Start a conversation
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
