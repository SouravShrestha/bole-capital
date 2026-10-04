import type { FaqCategory } from "@/types/faq";
import { PiggybankIcon } from "@/icons/PiggybankIcon";
import { DocumentIcon } from "@/icons/DocumentIcon";
import {
  calculate,
  formatRupees,
  formatRupeesCompact,
} from "@/lib/sipCalculator";
import {
  DonutChart,
  INVESTED_COLOR,
  RETURNS_COLOR,
} from "@/components/sip-calculator/ResultCharts";
import { ResourceCard } from "./ResourceCard";

// Example shown on the calculator card. Computed at build time, not hardcoded,
// so it always matches what the calculator itself would show.
const SAMPLE = { amount: 10000, years: 15, annualRate: 12 };

function SipPreview() {
  const r = calculate({ mode: "sip", annualStepUp: 0, ...SAMPLE });
  return (
    <div
      className="rounded-xl p-5 flex flex-col sm:flex-row items-center gap-6"
    >
      <DonutChart
        invested={r.invested}
        returns={r.returns}
        returnsPercent={r.returnsPercent}
        sizeClassName="w-36 h-36"
      />
      <dl className="flex flex-col gap-3 text-sm w-full sm:w-auto">
        <div>
          <dt className="text-xs opacity-50">
            {formatRupees(SAMPLE.amount)}/month · {SAMPLE.years} yrs ·{" "}
            {SAMPLE.annualRate}%
          </dt>
          <dd className="text-2xl font-semibold tabular-nums">
            {formatRupeesCompact(r.maturity)}
          </dd>
        </div>
        <div className="flex gap-6">
          <div>
            <dt className="flex items-center gap-1.5 text-xs opacity-60">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: INVESTED_COLOR }} aria-hidden="true" />
              Invested
            </dt>
            <dd className="tabular-nums">{formatRupeesCompact(r.invested)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs opacity-60">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: RETURNS_COLOR }} aria-hidden="true" />
              Returns
            </dt>
            <dd className="tabular-nums">{formatRupeesCompact(r.returns)}</dd>
          </div>
        </div>
      </dl>
    </div>
  );
}

function FaqPreview({ categories }: { categories: FaqCategory[] }) {
  return (
    <ul
      className="rounded-xl divide-y"
      style={{ borderColor: "var(--card-border)" }}
    >
      {categories.map((c) => (
        <li
          key={c.id}
          className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
          style={{ borderColor: "var(--card-border)" }}
        >
          <span className="opacity-80">{c.name}</span>
          <span className="text-xs tabular-nums opacity-50 shrink-0">
            {c.faqs.length} {c.faqs.length === 1 ? "question" : "questions"}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ResourcesGrid({ categories }: { categories: FaqCategory[] }) {
  const totalQuestions = categories.reduce((n, c) => n + c.faqs.length, 0);

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <ResourceCard
          href="/resources/sip-calculator"
          eyebrow="Calculator"
          title="SIP Calculator"
          description="See how a monthly SIP or a lumpsum could grow over time, with optional yearly step-up and a year-by-year breakdown."
          linkText="Open calculator"
          icon={<PiggybankIcon className="w-6 h-6" />}
        >
          <SipPreview />
        </ResourceCard>

        <ResourceCard
          href="/faq"
          eyebrow={`${totalQuestions} answers`}
          title="FAQs"
          description="Plain answers about how we work, getting started, managing your investments and understanding risk."
          linkText="Browse all FAQs"
          icon={<DocumentIcon className="w-6 h-6" />}
        >
          <FaqPreview categories={categories} />
        </ResourceCard>
      </div>
    </section>
  );
}
