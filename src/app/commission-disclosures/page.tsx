import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { LoadReveal, LoadRevealText } from "@/components/motion/LoadReveal";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = pageMetadata({
  title: "Commission Disclosures",
  description:
    "Trail commission ranges Bole Capital (ARN-366194) receives from Asset Management Companies, disclosed under SEBI Circular SEBI/IMD/CIR No.4/168230/09.",
  path: "/commission-disclosures",
});

const linkClass = "underline underline-offset-4 hover:opacity-100 hover:cursor-pointer";

type CommissionRow = { scheme: string; firstYear: string; secondYearOnwards: string };

// Trail commission ranges received from AMCs. Update as revised rates arrive.
const COMMISSIONS: CommissionRow[] = [
  { scheme: "Arbitrage Funds", firstYear: "0.05% to 0.60%", secondYearOnwards: "0.05% to 0.60%" },
  { scheme: "ELSS Funds", firstYear: "0.50% to 1.25%", secondYearOnwards: "0.50% to 1.25%" },
  { scheme: "Equity Oriented Funds", firstYear: "0.50% to 1.25%", secondYearOnwards: "0.50% to 1.25%" },
  { scheme: "Aggressive Hybrid Equity Funds", firstYear: "0.50% to 1.25%", secondYearOnwards: "0.50% to 1.25%" },
  { scheme: "Fixed Maturity Plans", firstYear: "0.05% to 0.50%", secondYearOnwards: "0.05% to 0.50%" },
  { scheme: "Fund of Funds", firstYear: "0.25% to 1%", secondYearOnwards: "0.25% to 1%" },
  { scheme: "Gilt Funds", firstYear: "0.25% to 1%", secondYearOnwards: "0.05% to 0.65%" },
  { scheme: "Hybrid Debt Funds", firstYear: "0.05% to 0.75%", secondYearOnwards: "0.05% to 0.75%" },
  { scheme: "Income Funds", firstYear: "0.05% to 1%", secondYearOnwards: "0.05% to 1%" },
  { scheme: "Index Funds", firstYear: "0.01% to 0.75%", secondYearOnwards: "0.01% to 0.75%" },
  { scheme: "Liquid / Ultra Short-Term Funds", firstYear: "0.05% to 0.50%", secondYearOnwards: "0.05% to 0.50%" },
  { scheme: "Short-Term Income Funds", firstYear: "0.05% to 0.65%", secondYearOnwards: "0.05% to 0.65%" },
  { scheme: "Thematic / Sector Funds", firstYear: "0.50% to 1.25%", secondYearOnwards: "0.50% to 1.25%" },
];

const NOTES: string[] = [
  "Mutual fund investments are subject to market risks. Read all scheme related documents and key information documents carefully before investing.",
  "Rates are shown on a best-effort basis and are updated as revised rates are received from AMCs. Actual commission depends on the AMC, scheme and plan.",
  "This page is for information only and is not financial, legal or tax advice. Net asset values move with market conditions, and past performance does not guarantee future returns.",
  "Any investment proposal we share is prepared at your request from the information you provide. It is non-binding, and you are free to accept or reject it or to seek independent legal, investment or tax advice.",
];

export default function CommissionDisclosuresPage() {
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
              Commission rates
            </h2>
            <p className="mt-6 text-sm md:text-base leading-7 opacity-80">
              Disclosed under SEBI Circular SEBI/IMD/CIR No.4/168230/09. Hemant
              Bole (ARN-366194) is an AMFI-registered Mutual Fund Distributor
              and receives the following trail commission from AMCs:
            </p>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-left text-sm md:text-base border-collapse">
                <caption className="sr-only">
                  Trail commission ranges by scheme type
                </caption>
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--card-border)" }}>
                    <th scope="col" className="py-3 pr-4 font-medium">
                      Scheme type
                    </th>
                    <th scope="col" className="py-3 px-4 font-medium whitespace-nowrap">
                      Trail 1st year
                    </th>
                    <th scope="col" className="py-3 pl-4 font-medium whitespace-nowrap">
                      Trail 2nd year onwards
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMMISSIONS.map(({ scheme, firstYear, secondYearOnwards }) => (
                    <tr
                      key={scheme}
                      className="border-b"
                      style={{ borderColor: "var(--card-border)" }}
                    >
                      <th scope="row" className="py-3 pr-4 font-normal opacity-80">
                        {scheme}
                      </th>
                      <td className="py-3 px-4 opacity-80 whitespace-nowrap">{firstYear}</td>
                      <td className="py-3 pl-4 opacity-80 whitespace-nowrap">
                        {secondYearOnwards}
                      </td>
                    </tr>
                  ))}
                </tbody>
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
