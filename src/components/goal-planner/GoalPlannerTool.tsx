"use client";
import { useState } from "react";
import { SegmentedToggle } from "@/components/sip-calculator/SegmentedToggle";
import type { CostGoalType, GoalInputs, GoalType, RetirementInputs } from "@/lib/goalPlanner";
import { CostGoalPlanner } from "./CostGoalPlanner";
import { RetirementPlanner } from "./RetirementPlanner";
import { COST_GOAL_DEFAULTS, GOAL_META, GOAL_ORDER, RETIREMENT_DEFAULTS } from "./goalConfig";

const GOAL_OPTIONS = GOAL_ORDER.map((value) => ({
  value,
  label: GOAL_META[value].label,
  ariaLabel: `${GOAL_META[value].title} planning`,
}));

/** Goal planner: education, retirement, home and car, each with its own remembered inputs. */
export function GoalPlannerTool() {
  const [goal, setGoal] = useState<GoalType>("education");
  const [costGoals, setCostGoals] = useState<Record<CostGoalType, GoalInputs>>(COST_GOAL_DEFAULTS);
  const [retirement, setRetirement] = useState<RetirementInputs>(RETIREMENT_DEFAULTS);

  const toggle = (
    <div className="flex justify-center">
      <SegmentedToggle size="compact" ariaLabel="Goal" value={goal} onChange={setGoal} options={GOAL_OPTIONS} />
    </div>
  );

  return (
    <section
      className="w-full"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
      aria-labelledby="goal-planner-heading"
    >
      <h2 id="goal-planner-heading" className="sr-only">
        {GOAL_META[goal].title} planning calculator
      </h2>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goal === "retirement" ? (
          <RetirementPlanner value={retirement} onChange={setRetirement} toggle={toggle} />
        ) : (
          <CostGoalPlanner
            goal={goal}
            value={costGoals[goal]}
            onChange={(next) => setCostGoals((g) => ({ ...g, [goal]: next }))}
            toggle={toggle}
          />
        )}
      </div>
    </section>
  );
}
