"use client";
import { useMemo } from "react";
import { RangeField } from "@/components/sip-calculator/RangeField";
import { planRetirement, retirementPath, type RetirementInputs } from "@/lib/goalPlanner";
import { formatRupees, formatRupeesCompact } from "@/lib/sipCalculator";
import {
  GOAL_META,
  INFLATION_LIMITS,
  INFLATION_MARKS,
  RATE_LIMITS,
  RATE_MARKS,
  RETIREMENT_LIMITS,
  RETIREMENT_MARKS,
  targetLabel,
} from "./goalConfig";
import {
  AssumptionNote,
  FundingOptions,
  PlanHeader,
  PlanActions,
  ProjectionSection,
  cardClassName,
  cardStyle,
  plain,
  yearsText,
} from "./PlannerParts";

type Props = {
  value: RetirementInputs;
  onChange: (next: RetirementInputs) => void;
  toggle: React.ReactNode;
};

type AgeKey = "currentAge" | "retirementAge" | "lifeExpectancy";

/** Keep current age < retirement age < life expectancy by nudging the other two. */
function withAge(value: RetirementInputs, key: AgeKey, age: number): RetirementInputs {
  const next = { ...value, [key]: age };
  if (key === "currentAge") {
    next.retirementAge = Math.max(next.retirementAge, age + 1);
    next.lifeExpectancy = Math.max(next.lifeExpectancy, next.retirementAge + 1);
  } else if (key === "retirementAge") {
    next.currentAge = Math.min(next.currentAge, age - 1);
    next.lifeExpectancy = Math.max(next.lifeExpectancy, age + 1);
  } else {
    next.retirementAge = Math.min(next.retirementAge, age - 1);
    next.currentAge = Math.min(next.currentAge, next.retirementAge - 1);
  }
  return next;
}

export function RetirementPlanner({ value, onChange, toggle }: Props) {
  const plan = useMemo(() => planRetirement(value), [value]);
  const yearly = useMemo(() => retirementPath(value, plan), [value, plan]);
  const set = (key: keyof RetirementInputs) => (v: number) => onChange({ ...value, [key]: v });
  const setAge = (key: AgeKey) => (v: number) => onChange(withAge(value, key, v));
  const period = yearsText(plan.yearsToRetire);

  return (
    <>
      {/* ---------- Inputs ---------- */}
      <div className={`${cardClassName} flex flex-col gap-8`} style={cardStyle}>
        {toggle}

        <RangeField
          label="Your current age"
          unit="Yrs"
          value={value.currentAge}
          onChange={setAge("currentAge")}
          format={plain}
          marks={RETIREMENT_MARKS.currentAge}
          {...RETIREMENT_LIMITS.currentAge}
        />
        <RangeField
          label="Age you want to retire at"
          unit="Yrs"
          value={value.retirementAge}
          onChange={setAge("retirementAge")}
          format={plain}
          marks={RETIREMENT_MARKS.retirementAge}
          {...RETIREMENT_LIMITS.retirementAge}
        />
        <RangeField
          label="Plan for income until age"
          unit="Yrs"
          value={value.lifeExpectancy}
          onChange={setAge("lifeExpectancy")}
          format={plain}
          marks={RETIREMENT_MARKS.lifeExpectancy}
          {...RETIREMENT_LIMITS.lifeExpectancy}
        />
        <RangeField
          label="Current monthly expenses"
          unit="₹"
          value={value.monthlyExpenses}
          onChange={set("monthlyExpenses")}
          marks={RETIREMENT_MARKS.monthlyExpenses}
          {...RETIREMENT_LIMITS.monthlyExpenses}
        />
        <RangeField
          label="Expected inflation rate"
          unit="%"
          value={value.inflationRate}
          onChange={set("inflationRate")}
          format={plain}
          marks={INFLATION_MARKS}
          {...INFLATION_LIMITS}
        />
        <RangeField
          label="Expected return until retirement"
          unit="%"
          value={value.annualRate}
          onChange={set("annualRate")}
          format={plain}
          marks={RATE_MARKS}
          {...RATE_LIMITS}
        />
        <RangeField
          label="Expected return after retirement"
          unit="%"
          value={value.postRetirementRate}
          onChange={set("postRetirementRate")}
          format={plain}
          marks={RETIREMENT_MARKS.postRetirementRate}
          {...RATE_LIMITS}
        />

        <AssumptionNote>
          Your expenses keep rising with inflation, even after you stop
          working. We estimate the corpus that can pay for them every year
          until age {value.lifeExpectancy}, with the balance staying invested
          at a safer post-retirement return. Returns are never guaranteed.
        </AssumptionNote>
      </div>

      {/* ---------- Results ---------- */}
      <div className={`${cardClassName} flex flex-col gap-8`} style={cardStyle}>
        <PlanHeader
          title="Your retirement plan"
          tagline={GOAL_META.retirement.tagline}
          meta={`${period} @ ${value.annualRate}% p.a.`}
        />

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4" aria-live="polite">
          <div className="sm:col-span-2 mb-2">
            <dt className="text-sm opacity-60">Corpus needed at age {value.retirementAge}</dt>
            <dd className="text-3xl font-semibold tabular-nums">
              {formatRupeesCompact(plan.futureCost)}
            </dd>
            <dd className="mt-1 text-xs opacity-60">
              Covers {formatRupeesCompact(plan.monthlyExpensesAtRetirement)}/month at
              retirement ({formatRupeesCompact(value.monthlyExpenses)} today), rising
              with inflation for {yearsText(plan.retirementYears)}
            </dd>
          </div>
          <FundingOptions plan={plan} years={plan.yearsToRetire} />
        </dl>

        <ProjectionSection yearly={yearly} targetLabel={targetLabel("retirement")} />

        <PlanActions
          request={{ goal: "retirement", inputs: value }}
          message={`I'd like to plan my retirement at age ${value.retirementAge} (estimated corpus ${formatRupees(plan.futureCost)}).`}
        />
      </div>
    </>
  );
}
