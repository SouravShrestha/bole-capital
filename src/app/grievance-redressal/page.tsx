import {
  LegalEmail,
  LegalPage,
  LegalPhones,
  legalLinkClass,
  type LegalSection,
} from "@/components/legal/LegalPage";
import { COMPLIANCE, REGULATORY_LINKS } from "@/lib/compliance";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Grievance Redressal",
  description:
    "How to raise a complaint with Bole Capital and escalate it to the AMC, SEBI SCORES or SmartODR if it is not resolved.",
  path: "/grievance-redressal",
});

function external(label: string) {
  const link = REGULATORY_LINKS.find((l) => l.label === label);
  if (!link) throw new Error(`Unknown regulatory link: ${label}`);
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={legalLinkClass}
      style={{ color: "var(--fg)" }}
    >
      {link.href.replace(/^https:\/\//, "").replace(/\/$/, "")}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

const SECTIONS: LegalSection[] = [
  {
    id: "step-1-contact-us",
    heading: "Step 1: Contact us",
    body: [
      <>
        Write to {COMPLIANCE.legalName}, the grievance officer for Bole Capital,
        at <LegalEmail /> or call <LegalPhones />. Please include your name,
        folio number or transaction reference (if any) and a short description
        of the issue.
      </>,
      "We aim to acknowledge complaints within 2 working days and to resolve them within 21 days.",
    ],
  },
  {
    id: "step-2-amc-or-rta",
    heading: "Step 2: The AMC or its registrar",
    body: [
      "If your complaint relates to a specific scheme, transaction or statement, you can also raise it directly with the Asset Management Company (AMC) or its Registrar and Transfer Agent (such as CAMS or KFintech). Their investor service contacts are listed on each AMC's website and in your account statement.",
    ],
  },
  {
    id: "step-3-sebi-scores",
    heading: "Step 3: SEBI SCORES",
    body: [
      <>
        If you are not satisfied with the response, you can lodge a complaint on
        SEBI&rsquo;s online complaint system, SCORES, at {external("SEBI SCORES")}.
      </>,
    ],
  },
  {
    id: "step-4-smartodr",
    heading: "Step 4: Online Dispute Resolution (SmartODR)",
    body: [
      <>
        If the matter is still unresolved, you can start an online conciliation
        or arbitration through the Online Dispute Resolution portal at{" "}
        {external("SmartODR")}.
      </>,
    ],
  },
  {
    id: "investor-charter",
    heading: "Investor Charter",
    body: [
      <>
        The Investor Charter for mutual funds sets out your rights and the
        services you can expect. Read it at {external("Investor Charter")}.
      </>,
    ],
  },
];

export default function GrievanceRedressalPage() {
  return (
    <LegalPage
      title="Grievance Redressal"
      intro="If something has gone wrong, here is how to tell us and how to escalate if it is not resolved."
      sections={SECTIONS}
      closingPrompt="Prefer to talk it through first?"
    />
  );
}
