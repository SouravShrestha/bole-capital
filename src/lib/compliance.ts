/**
 * Single source of truth for regulatory identifiers and disclosures.
 * Safe to import from client and server code.
 */
export const COMPLIANCE = {
  arnNumber: "366194",
  arn: "ARN-366194",
  legalName: "Hemant Bole",
  // TODO: fill in the EUIN (e.g. "E123456"). Hidden on the site while null.
  euin: null as string | null,
  // TODO: fill in the ARN validity date as YYYY-MM-DD. Hidden on the site while null.
  arnValidTill: null as string | null,
} as const;

/** AMFI's prescribed mutual fund risk disclaimer. */
export const MARKET_RISK_DISCLAIMER =
  "Mutual Fund investments are subject to market risks, read all scheme related documents carefully.";

export const DISTRIBUTOR_STATEMENT = `Bole Capital (${COMPLIANCE.legalName}) is an AMFI-registered Mutual Fund Distributor (${COMPLIANCE.arn}), not a SEBI-registered Investment Adviser. We do not charge advisory fees; we may earn commissions from AMCs on products distributed.`;

export const TESTIMONIAL_DISCLAIMER =
  "Individual client experiences, shared with consent. Not indicative of future returns.";

export type RegulatoryLink = { label: string; href: string };

export const REGULATORY_LINKS: RegulatoryLink[] = [
  { label: "SEBI SCORES", href: "https://scores.sebi.gov.in/" },
  { label: "SmartODR", href: "https://smartodr.in/" },
  { label: "Verify ARN on AMFI", href: "https://www.amfiindia.com/locate-distributor" },
  {
    label: "Investor Charter",
    href: "https://investor.sebi.gov.in/pdf/investor-charter/mf_amc_amfi.pdf",
  },
];

type ComplianceInput = {
  arnNumber: string;
  legalName: string;
  euin: string | null;
  arnValidTill: string | null;
};

/** Credential lines for display. EUIN and validity are omitted until set. */
export function formatCompliance(c: ComplianceInput = COMPLIANCE): string[] {
  const lines = [`ARN: ${c.arnNumber}`];
  if (c.euin) lines.push(`EUIN: ${c.euin}`);
  if (c.arnValidTill) {
    const date = new Date(c.arnValidTill);
    if (!Number.isNaN(date.getTime())) {
      lines.push(
        `Valid till: ${date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        })}`
      );
    }
  }
  lines.push(`Legal Name: ${c.legalName}`);
  return lines;
}
