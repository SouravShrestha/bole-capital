import type { ReactNode } from "react";
import Link from "next/link";
import { pageMetadata, CONTACT } from "@/lib/seo";
import { LoadReveal, LoadRevealText } from "@/components/motion/LoadReveal";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Plain-language privacy policy explaining what the Bole Capital website collects, why, who processes it and how to have it corrected or deleted.",
  path: "/privacy-policy",
});

type Section = { id: string; heading: string; body: ReactNode[] };

const linkClass = "underline underline-offset-4 hover:opacity-100 hover:cursor-pointer";

const EMAIL = (
  <a href={`mailto:${CONTACT.email}`} className={linkClass} style={{ color: "var(--fg)" }}>
    {CONTACT.email}
  </a>
);

const PHONE = (
  <>
    <a href="tel:+917827301069" className={linkClass} style={{ color: "var(--fg)" }}>
      +91 78273 01069
    </a>
    ,{" "}
    <a href="tel:+919971301069" className={linkClass} style={{ color: "var(--fg)" }}>
      +91 99713 01069
    </a>
  </>
);

const SECTIONS: Section[] = [
  {
    id: "who-is-responsible",
    heading: "Who is responsible for your information",
    body: [
      "Bole Capital is the brand under which Hemant Bole (ARN-366194), an AMFI-registered Mutual Fund Distributor, operates. Hemant Bole is responsible for information collected through this website.",
    ],
  },
  {
    id: "what-we-collect",
    heading: "What we collect",
    body: [
      "Only what you type into our forms. Through the contact form, that is your name, phone number, an optional email address and your message. Through the subscribe form, that is your email address.",
      "We do not ask for PAN, Aadhaar, bank details, folio numbers, portfolio values, medical information or document uploads through this website. Please do not send those through the public forms.",
      "Your IP address is used briefly to prevent spam by limiting how often a form can be submitted. Our hosting provider may also log ordinary technical information such as IP address and browser type for security purposes.",
    ],
  },
  {
    id: "why-we-use-it",
    heading: "Why we use it",
    body: [
      "To respond to your enquiry and have the conversation you asked for, or to let you know when we have something to share if you subscribed. Those are the only purposes we use your details for.",
      "We will not add you to a marketing list from a contact enquiry alone.",
    ],
  },
  {
    id: "who-processes-it",
    heading: "Who processes it",
    body: [
      "When you submit a form, your details are delivered as a private message to Bole Capital through a messaging service, where only Bole Capital can read them. The website itself does not keep a database of submissions.",
      "Website hosting and form delivery use standard service providers acting on our instructions.",
      "We do not sell your information and we do not send your personal details to analytics or advertising tools.",
    ],
  },
  {
    id: "how-long-we-keep-it",
    heading: "How long we keep it",
    body: [
      "Enquiry details are retained for up to 24 months from the last contact, unless you become a client, in which case records are retained as required under applicable regulatory record-keeping rules.",
    ],
  },
  {
    id: "correction-and-deletion",
    heading: "Correction and deletion",
    body: [
      <>
        Write to {EMAIL} or call {PHONE} to see, correct or delete the
        information you shared through this website. We will respond within a
        reasonable period.
      </>,
    ],
  },
  {
    id: "security",
    heading: "Security",
    body: [
      "Submissions are transmitted over HTTPS and handled server-side. Access to your details is limited to Bole Capital. No system is perfectly secure, so please avoid sending sensitive financial identifiers through the public forms.",
    ],
  },
  {
    id: "cookies-and-analytics",
    heading: "Cookies and analytics",
    body: [
      "This website does not run marketing analytics or advertising trackers. Your light or dark theme choice is saved in your own browser so the site looks the way you left it; it is never sent to us.",
      "If analytics is added later, it will be introduced with an appropriate consent approach and this page will be updated.",
    ],
  },
  {
    id: "grievance-contact",
    heading: "Grievance contact",
    body: [
      <>
        Grievance officer: Hemant Bole, Bole Capital. Email {EMAIL}, phone{" "}
        {PHONE}.
      </>,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main
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
            Privacy Policy
          </LoadRevealText>
          <LoadReveal
            as="p"
            delay={350}
            className="mt-6 md:mt-8 text-sm md:text-base opacity-70 max-w-xl mx-auto"
          >
            Plain language, no surprises. This explains what the Bole Capital
            website collects and what happens to it.
          </LoadReveal>
        </div>

        <div className="flex flex-col gap-12 md:gap-16">
          {SECTIONS.map(({ id, heading, body }) => (
            <Reveal
              as="section"
              key={id}
              id={id}
              aria-labelledby={`${id}-heading`}
            >
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
          Questions about this policy?{" "}
          <Link href="/contact" className={linkClass} style={{ color: "var(--fg)" }}>
            Start a conversation
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
