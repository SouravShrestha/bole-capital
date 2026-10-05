"use client";
import { useMemo } from "react";
import { RangeField } from "@/components/sip-calculator/RangeField";
import { costGoalPath, planGoal, type CostGoalType, type GoalInputs } from "@/lib/goalPlanner";
import { formatRupees, formatRupeesCompact } from "@/lib/sipCalculator";
import {
  COST_GOAL_CONFIG,
  GOAL_META,
  INFLATION_LIMITS,
  RATE_LIMITS,
  RATE_MARKS,
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
  goal: CostGoalType;
  value: GoalInputs;
  onChange: (next: GoalInputs) => void;
  /** Goal switcher rendered at the top of the inputs card. */
  toggle: React.ReactNode;
};

/** Inputs + results cards for goals with a known price today (education, home, car). */
export function CostGoalPlanner({ goal, value, onChange, toggle }: Props) {
  const config = COST_GOAL_CONFIG[goal];
  const plan = useMemo(() => planGoal(value), [value]);
  const yearly = useMemo(() => costGoalPath(value, plan), [value, plan]);
  const set = (key: keyof GoalInputs) => (v: number) => onChange({ ...value, [key]: v });
  const period = yearsText(value.years);

  return (
    <>
      {/* ---------- Inputs ---------- */}
      <div className={`${cardClassName} flex flex-col gap-8`} style={cardStyle}>
        {toggle}

        <RangeField
          label={config.yearsLabel}
          unit="Yrs"
          value={value.years}
          onChange={set("years")}
          format={plain}
          marks={config.yearMarks}
          {...config.years}
        />
        <RangeField
          label={config.costLabel}
          unit="₹"
          value={value.currentCost}
          onChange={set("currentCost")}
          marks={config.costMarks}
          {...config.cost}
        />
        <RangeField
          label="Expected inflation rate"
          unit="%"
          value={value.inflationRate}
          onChange={set("inflationRate")}
          format={plain}
          marks={config.inflationMarks}
          {...INFLATION_LIMITS}
        />
        <RangeField
          label="Expected rate of return"
          unit="%"
          value={value.annualRate}
          onChange={set("annualRate")}
          format={plain}
          marks={RATE_MARKS}
          {...RATE_LIMITS}
        />

        <AssumptionNote>
          Prices tend to rise every year. We grow today&apos;s cost by the
          inflation rate to estimate what your {config.noun} will cost, then
          work out the investment needed to get there. Returns are never
          guaranteed.
        </AssumptionNote>
      </div>

      {/* ---------- Results ---------- */}
      <div className={`${cardClassName} flex flex-col gap-8`} style={cardStyle}>
        <PlanHeader
          title={`Your ${config.noun} plan`}
          tagline={GOAL_META[goal].tagline}
          meta={`${period} @ ${value.annualRate}% p.a.`}
        />

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4" aria-live="polite">
          <div className="sm:col-span-2 mb-2">
            <dt className="text-sm opacity-60 first-letter:uppercase">
              {config.noun} cost after {period}
            </dt>
            <dd className="text-3xl font-semibold tabular-nums">
              {formatRupeesCompact(plan.futureCost)}
            </dd>
            <dd className="mt-1 text-xs opacity-60">
              {formatRupeesCompact(value.currentCost)} today, at {value.inflationRate}% inflation a year
            </dd>
          </div>
          <FundingOptions plan={plan} years={value.years} />
        </dl>

        <ProjectionSection yearly={yearly} targetLabel={targetLabel(goal)} />

        <PlanActions
          request={{ goal, inputs: value }}
          message={`I'd like to plan for my ${config.noun} in ${period} (estimated cost ${formatRupees(plan.futureCost)}).`}
        />
      </div>
    </>
  );
}
