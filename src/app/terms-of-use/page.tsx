import Link from "next/link";
import {
  LegalEmail,
  LegalPage,
  legalLinkClass,
  type LegalSection,
} from "@/components/legal/LegalPage";
import { COMPLIANCE, DISTRIBUTOR_STATEMENT, MARKET_RISK_DISCLAIMER } from "@/lib/compliance";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Use & Disclaimer",
  description:
    "Terms for using the Bole Capital website, including the mutual fund risk disclaimer, calculator illustrations and third-party links.",
  path: "/terms-of-use",
});

const internal = (href: string, label: string) => (
  <Link href={href} className={legalLinkClass} style={{ color: "var(--fg)" }}>
    {label}
  </Link>
);

const SECTIONS: LegalSection[] = [
  {
    id: "about-these-terms",
    heading: "About these terms",
    body: [
      `This website is operated by ${COMPLIANCE.legalName} under the brand Bole Capital. By using it, you agree to these terms. If you do not agree, please do not use the website.`,
    ],
  },
  {
    id: "who-we-are",
    heading: "Who we are",
    body: [DISTRIBUTOR_STATEMENT],
  },
  {
    id: "not-investment-advice",
    heading: "Information, not advice",
    body: [
      "Content on this website is general information for education and awareness. It is not investment, legal or tax advice, and it is not a recommendation or offer to buy or sell any security or scheme.",
      "Any suggestion we make is based on the information you share with us and your stated goals. Please consider your own circumstances, and seek independent professional advice where appropriate, before investing.",
    ],
  },
  {
    id: "market-risk",
    heading: "Market risk",
    body: [
      MARKET_RISK_DISCLAIMER,
      "Past performance may or may not be sustained in future and is not a guarantee of future returns. The value of investments and the income from them can go down as well as up.",
    ],
  },
  {
    id: "calculators",
    heading: "Calculators and illustrations",
    body: [
      <>
        Tools such as the {internal("/resources/sip-calculator", "SIP calculator")}{" "}
        use the assumptions you enter, such as an expected rate of return. Results
        are illustrations only, do not represent the performance of any scheme
        and are not a promise of returns.
      </>,
    ],
  },
  {
    id: "testimonials",
    heading: "Testimonials",
    body: [
      "Testimonials reflect individual client experiences and are shared with their consent. They are not indicative of future performance or of the experience of other clients.",
    ],
  },
  {
    id: "third-party-links",
    heading: "Third-party websites",
    body: [
      "Online investing is offered through AssetPlus, a third-party platform, and this website links to other external sites such as AMFI and SEBI. Those sites have their own terms and privacy policies, and we are not responsible for their content or availability.",
    ],
  },
  {
    id: "accuracy",
    heading: "Accuracy and availability",
    body: [
      "We try to keep information accurate and current, but we do not guarantee that it is complete or error-free. Content may change without notice, and the website may be unavailable from time to time.",
      "To the extent permitted by law, Bole Capital is not liable for any loss arising from reliance on content on this website.",
    ],
  },
  {
    id: "intellectual-property",
    heading: "Intellectual property",
    body: [
      "Text, design, logos and graphics on this website belong to Bole Capital unless stated otherwise. Scheme names and logos belong to their respective owners.",
    ],
  },
  {
    id: "privacy-and-grievances",
    heading: "Privacy and grievances",
    body: [
      <>
        How we handle information you share is explained in our{" "}
        {internal("/privacy-policy", "Privacy Policy")}. To raise a complaint,
        see {internal("/grievance-redressal", "Grievance Redressal")} or write to{" "}
        <LegalEmail />.
      </>,
    ],
  },
  {
    id: "governing-law",
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of India. Subject to any dispute resolution mechanism prescribed by SEBI, courts in Dhanbad, Jharkhand have jurisdiction.",
    ],
  },
];

export default function TermsOfUsePage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="The ground rules for using this website, and what our content is and is not."
      sections={SECTIONS}
      closingPrompt="Questions about these terms?"
    />
  );
}
