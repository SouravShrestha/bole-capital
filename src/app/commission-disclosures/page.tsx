import Link from "next/link";
import commissionData from "@/data/commissions.json";
import type { CommissionCategory } from "@/types/commission";
import { pageMetadata } from "@/lib/seo";
import { COMPLIANCE } from "@/lib/compliance";
import { LoadReveal, LoadRevealText } from "@/components/motion/LoadReveal";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = pageMetadata({
  title: "Commission Disclosures",
  description:
    `Trail commission ranges Bole Capital (${COMPLIANCE.arn}) receives from Asset Management Companies, disclosed under SEBI Circular SEBI/IMD/CIR No.4/168230/09.`,
  path: "/commission-disclosures",
});

const linkClass = "underline underline-offset-4 hover:opacity-100 hover:cursor-pointer";

// Trail commission ranges received from AMCs (exclusive of GST). Update src/data/commissions.json as revised rates arrive.
const COMMISSIONS = commissionData as CommissionCategory[];

const NOTES: string[] = [
  "Mutual fund investments are subject to market risks. Read all scheme related documents and key information documents carefully before investing.",
  "Rates are shown on a best-effort basis and are updated as revised rates are received from AMCs. Actual commission depends on the AMC, scheme and plan.",
  "This page is for information only and is not financial, legal or tax advice. Net asset values move with market conditions, and past performance does not guarantee future returns.",
  "Any investment proposal we share is prepared at your request from the information you provide. It is non-binding, and you are free to accept or reject it or to seek independent legal, investment or tax advice.",
];

export default function CommissionDisclosuresPage() {
  return (
    <main id="main-content"
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
            Commission Disclosures
          </LoadRevealText>
          <LoadReveal
            as="p"
            delay={350}
            className="mt-6 md:mt-8 text-sm md:text-base opacity-70 max-w-xl mx-auto"
          >
            What we earn, stated openly. These are the trail commissions Bole
            Capital receives from Asset Management Companies.
          </LoadReveal>
        </div>

        <div className="flex flex-col gap-12 md:gap-16">
          <Reveal as="section" id="commission-rates" aria-labelledby="commission-rates-heading">
            <h2
              id="commission-rates-heading"
              className="text-lg md:text-xl font-medium pb-4 border-b"
              style={{ borderColor: "var(--card-border)" }}
            >
              Commission from Mutual Funds (Exclusive of GST)
            </h2>
            <p className="mt-6 text-sm md:text-base leading-7 opacity-80">
              Disclosed under SEBI Circular SEBI/IMD/CIR No. 4/168230/09: Bole Capital ({COMPLIANCE.legalName}, {COMPLIANCE.arn}) is an AMFI-registered Mutual Fund Distributor. The following are the details of the commission earned by Bole Capital from various AMCs whose products are distributed:
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-left text-sm md:text-base border-collapse">
                <caption className="sr-only">
                  Commission from Mutual Funds, trail commission ranges by
                  category and fund scheme, exclusive of GST
                </caption>
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--card-border)" }}>
                    <th scope="col" className="py-3 pr-4 font-medium">
                      Fund scheme
                    </th>
                    <th scope="col" className="py-3 pl-4 font-medium whitespace-nowrap">
                      Trail commission range
                    </th>
                  </tr>
                </thead>
                {COMMISSIONS.map(({ category, rows }) => (
                  <tbody key={category}>
                    <tr className="border-b" style={{ borderColor: "var(--card-border)" }}>
                      <th
                        scope="rowgroup"
                        colSpan={2}
                        className="pt-6 pb-3 font-medium text-xs md:text-xs tracking-wide opacity-60"
                      >
                        {category}
                      </th>
                    </tr>
                    {rows.map(({ scheme, trail }) => (
                      <tr
                        key={scheme}
                        className="border-b"
                        style={{ borderColor: "var(--card-border)" }}
                      >
                        <th scope="row" className="py-3 pr-4 font-normal opacity-80 pl-2">
                          {scheme}
                        </th>
                        <td className="py-3 pl-4 opacity-80 whitespace-nowrap text-right pr-2">{trail}</td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
          </Reveal>

          <Reveal as="section" id="important-notes" aria-labelledby="important-notes-heading">
            <h2
              id="important-notes-heading"
              className="text-lg md:text-xl font-medium pb-4 border-b"
              style={{ borderColor: "var(--card-border)" }}
            >
              Important notes
            </h2>
            <div className="flex flex-col gap-4 mt-6">
              {NOTES.map((note, i) => (
                <p key={i} className="text-sm md:text-base leading-7 opacity-80">
                  {note}
                </p>
              ))}
            </div>
          </Reveal>
        </div>

        <p className="mt-16 md:mt-24 text-sm opacity-60 text-center">
          Questions about how we are paid?{" "}
          <Link href="/contact" className={linkClass} style={{ color: "var(--fg)" }}>
            Start a conversation
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
