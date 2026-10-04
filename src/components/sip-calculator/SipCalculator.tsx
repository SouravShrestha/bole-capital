"use client";
import { useMemo, useState } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { ChevronRightIcon } from "@/icons/ChevronRightIcon";
import {
  calculate,
  formatRupees,
  formatRupeesCompact,
  type CalculatorMode,
} from "@/lib/sipCalculator";
import { RangeField } from "./RangeField";
import { SegmentedToggle } from "./SegmentedToggle";
import {
  DonutChart,
  GrowthBarChart,
  INVESTED_COLOR,
  RETURNS_COLOR,
} from "./ResultCharts";
import { YearlyBreakdown } from "./YearlyBreakdown";

const LIMITS = {
  sip: { min: 500, max: 500000, step: 500 },
  lumpsum: { min: 5000, max: 10000000, step: 5000 },
  stepUp: { min: 0, max: 50000, step: 500 },
  years: { min: 1, max: 40, step: 1 },
  rate: { min: 1, max: 30, step: 0.5 },
} as const;

const EXTEND_OPTIONS = [5, 7, 10] as const;
type ExtendBy = `${(typeof EXTEND_OPTIONS)[number]}`;

const formatRate = (v: number) => String(v);
const formatYears = (v: number) => String(v);

const cardClassName = "rounded-2xl border p-6 sm:p-8";
const cardStyle: React.CSSProperties = {
  backgroundColor: "var(--card-back-bg)",
  borderColor: "var(--card-border)",
};

export function SipCalculator() {
  const [mode, setMode] = useState<CalculatorMode>("sip");
  const [sipAmount, setSipAmount] = useState(5000);
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [stepUpEnabled, setStepUpEnabled] = useState(false);
  const [stepUp, setStepUp] = useState(500);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const [view, setView] = useState<"donut" | "bars">("donut");
  const [extendBy, setExtendBy] = useState<ExtendBy>("5");

  const isSip = mode === "sip";
  const amount = isSip ? sipAmount : lumpsumAmount;
  const effectiveStepUp = isSip && stepUpEnabled ? stepUp : 0;

  const result = useMemo(
    () =>
      calculate({ mode, amount, annualStepUp: effectiveStepUp, years, annualRate: rate }),
    [mode, amount, effectiveStepUp, years, rate]
  );

  const extended = useMemo(
    () =>
      calculate({
        mode,
        amount,
        annualStepUp: effectiveStepUp,
        years: years + Number(extendBy),
        annualRate: rate,
      }),
    [mode, amount, effectiveStepUp, years, rate, extendBy]
  );

  const amountLimits = isSip ? LIMITS.sip : LIMITS.lumpsum;

  return (
    <section
      className="w-full"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
      aria-labelledby="sip-calculator-heading"
    >
      <h2 id="sip-calculator-heading" className="sr-only">
        Investment calculator
      </h2>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ---------- Inputs ---------- */}
        <div className={`${cardClassName} flex flex-col gap-8`} style={cardStyle}>
          <div className="flex justify-center">
            <SegmentedToggle
              ariaLabel="Investment type"
              value={mode}
              onChange={setMode}
              options={[
                { value: "sip", label: "SIP" },
                { value: "lumpsum", label: "Lumpsum" },
              ]}
            />
          </div>

          <RangeField
            label={isSip ? "Monthly investment" : "Total investment"}
            unit="₹"
            value={amount}
            onChange={isSip ? setSipAmount : setLumpsumAmount}
            {...amountLimits}
          />

          {isSip && (
            <RangeField
              label="Annual step-up"
              unit="₹"
              value={stepUp}
              onChange={setStepUp}
              disabled={!stepUpEnabled}
              hideSlider={!stepUpEnabled}
              labelAddon={
                <SegmentedToggle
                  size="sm"
                  ariaLabel="Enable annual step-up"
                  value={stepUpEnabled ? "yes" : "no"}
                  onChange={(v) => setStepUpEnabled(v === "yes")}
                  options={[
                    { value: "no", label: "No" },
                    { value: "yes", label: "Yes" },
                  ]}
                />
              }
              {...LIMITS.stepUp}
            />
          )}

          <RangeField
            label="Investment period"
            unit="Yrs"
            value={years}
            onChange={setYears}
            format={formatYears}
            {...LIMITS.years}
          />

          <RangeField
            label="Expected rate of return"
            unit="%"
            value={rate}
            onChange={setRate}
            format={formatRate}
            {...LIMITS.rate}
          />

          <p
            className="text-sm leading-relaxed rounded-lg px-4 py-3"
            style={{ backgroundColor: "rgba(242, 201, 76, 0.1)", color: "var(--fg)" }}
          >
            <span className="opacity-80">
              Equity mutual funds in India have historically delivered around
              10–14% a year over long periods, but returns are never guaranteed.
              Use a conservative rate when planning.
            </span>
          </p>
        </div>

        {/* ---------- Results ---------- */}
        <div className={`${cardClassName} flex flex-col gap-8`} style={cardStyle}>
          <div className="flex items-center justify-between gap-4">
            <SegmentedToggle
              size="sm"
              ariaLabel="Chart view"
              value={view}
              onChange={setView}
              options={[
                { value: "donut", label: "Split", ariaLabel: "Show investment split" },
                { value: "bars", label: "Growth", ariaLabel: "Show yearly growth" },
              ]}
            />
            <span className="text-xs opacity-50">
              {years} {years === 1 ? "year" : "years"} @ {rate}% p.a.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            {view === "donut" ? (
              <DonutChart
                invested={result.invested}
                returns={result.returns}
                returnsPercent={result.returnsPercent}
              />
            ) : (
              <div className="w-full sm:w-1/2">
                <GrowthBarChart yearly={result.yearly} />
              </div>
            )}

            <dl className="flex flex-col gap-5 w-full sm:w-auto" aria-live="polite">
              <div>
                <dt className="text-sm opacity-60">Maturity amount</dt>
                <dd className="text-3xl font-semibold tabular-nums">
                  {formatRupeesCompact(result.maturity)}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-xs opacity-60">
                  <span
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ backgroundColor: INVESTED_COLOR }}
                    aria-hidden="true"
                  />
                  Total investment
                </dt>
                <dd className="text-lg font-medium tabular-nums">
                  {formatRupeesCompact(result.invested)}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-xs opacity-60">
                  <span
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ backgroundColor: RETURNS_COLOR }}
                    aria-hidden="true"
                  />
                  Estimated returns
                </dt>
                <dd className="text-lg font-medium tabular-nums">
                  {formatRupeesCompact(result.returns)}
                </dd>
              </div>
            </dl>
          </div>

          {/* What if I keep investing? */}
          <div className="border-t pt-6" style={{ borderColor: "var(--card-border)" }}>
            <p className="text-sm mb-4">
              What happens if I {isSip ? "keep investing" : "stay invested"} longer?
            </p>
            <div role="tablist" aria-label="Extend investment period" className="flex gap-1 border-b mb-4" style={{ borderColor: "var(--card-border)" }}>
              {EXTEND_OPTIONS.map((n) => {
                const key = String(n) as ExtendBy;
                const active = key === extendBy;
                return (
                  <button
                    key={n}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="extend-panel"
                    onClick={() => setExtendBy(key)}
                    className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
                      active
                        ? "border-[#22a352] text-[#22a352]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    +{n} yrs
                  </button>
                );
              })}
            </div>
            <dl id="extend-panel" role="tabpanel" className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-xs opacity-50 mb-1">Invested</dt>
                <dd className="tabular-nums">{formatRupees(extended.invested)}</dd>
              </div>
              <div>
                <dt className="text-xs opacity-50 mb-1">Growth</dt>
                <dd className="tabular-nums">{formatRupees(extended.returns)}</dd>
              </div>
              <div>
                <dt className="text-xs opacity-50 mb-1">Maturity</dt>
                <dd className="font-semibold tabular-nums">{formatRupees(extended.maturity)}</dd>
              </div>
            </dl>
            <p className="mt-6 text-sm opacity-60">
              {Number(extendBy)} more years adds{" "}
              <span className="text-[#22a352] font-medium">
                {formatRupeesCompact(extended.maturity - result.maturity)}
              </span>{" "}
              to your corpus.
            </p>
          </div>

          <div className="flex justify-center mt-auto">
            <IconButton
              as="link"
              href={`/contact?message=${encodeURIComponent(
                isSip
                  ? `I'd like to start a SIP of ${formatRupees(amount)}/month for ${years} years.`
                  : `I'd like to invest a lumpsum of ${formatRupees(amount)} for ${years} years.`
              )}`}
              icon={<ChevronRightIcon />}
            >
              Talk to us about this plan
            </IconButton>
          </div>
        </div>
      </div>

      <YearlyBreakdown yearly={result.yearly} />
    </section>
  );
}
