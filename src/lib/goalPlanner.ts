import { calculate, monthlyRate, type YearlyPoint } from "./sipCalculator";

/** Cost-based goals: a known price today, grown by inflation. */
export type CostGoalType = "education" | "house" | "car";
export type GoalType = CostGoalType | "retirement";

export interface GoalInputs {
  /** Years until the goal is bought. */
  years: number;
  /** Cost of the goal in today's rupees. */
  currentCost: number;
  /** Expected annual inflation of the goal's cost, in percent. */
  inflationRate: number;
  /** Expected annual investment return, in percent. */
  annualRate: number;
}

export interface FundingPlan {
  /** Monthly SIP (start of month, same model as the SIP calculator) needed to reach the target. */
  monthlySip: number;
  /** Total paid in through the SIP over the period. */
  sipInvested: number;
  /** One-time investment today needed to reach the target. */
  lumpsum: number;
}

export interface GoalPlan extends FundingPlan {
  /** Inflation-adjusted cost (or corpus) needed at the target year. */
  futureCost: number;
}

/** SIP and lumpsum needed today to have `target` after `years` at `annualRate`%. */
export function fundTarget(target: number, years: number, annualRate: number): FundingPlan {
  const lumpsum = target / Math.pow(1 + annualRate / 100, years);
  const n = years * 12;
  const i = monthlyRate(annualRate);
  // Future value of 1/month paid at the start of each month (annuity due).
  const factor = i === 0 ? n : ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const monthlySip = n > 0 ? target / factor : target;
  return { monthlySip, sipInvested: n > 0 ? monthlySip * n : target, lumpsum };
}

export function planGoal(inputs: GoalInputs): GoalPlan {
  const { years, currentCost, inflationRate, annualRate } = inputs;
  const futureCost = currentCost * Math.pow(1 + inflationRate / 100, years);
  return { futureCost, ...fundTarget(futureCost, years, annualRate) };
}

export interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  /** Age the corpus should last until. */
  lifeExpectancy: number;
  /** Household expenses per month in today's rupees. */
  monthlyExpenses: number;
  /** Expected annual inflation, in percent. Applies before and after retirement. */
  inflationRate: number;
  /** Expected annual return until retirement, in percent. */
  annualRate: number;
  /** Expected annual return on the corpus during retirement, in percent. */
  postRetirementRate: number;
}

export interface RetirementPlan extends GoalPlan {
  yearsToRetire: number;
  retirementYears: number;
  /** Monthly expenses in the first year of retirement, after inflation. */
  monthlyExpensesAtRetirement: number;
}

/**
 * Corpus needed at retirement to fund inflation-rising expenses until
 * `lifeExpectancy`. Each year's expenses are withdrawn at the start of the
 * year while the rest stays invested at `postRetirementRate`
 * (a growing annuity due), so `futureCost` is that corpus.
 */
export function planRetirement(inputs: RetirementInputs): RetirementPlan {
  const yearsToRetire = Math.max(0, inputs.retirementAge - inputs.currentAge);
  const retirementYears = Math.max(0, inputs.lifeExpectancy - inputs.retirementAge);

  const monthlyExpensesAtRetirement =
    inputs.monthlyExpenses * Math.pow(1 + inputs.inflationRate / 100, yearsToRetire);
  const firstYearExpenses = monthlyExpensesAtRetirement * 12;

  // Ratio of each year's withdrawal (in today's-at-retirement value) to the previous one.
  const q = (1 + inputs.inflationRate / 100) / (1 + inputs.postRetirementRate / 100);
  const presentValueFactor =
    Math.abs(1 - q) < 1e-12 ? retirementYears : (1 - Math.pow(q, retirementYears)) / (1 - q);
  const corpus = firstYearExpenses * presentValueFactor;

  return {
    yearsToRetire,
    retirementYears,
    monthlyExpensesAtRetirement,
    futureCost: corpus,
    ...fundTarget(corpus, yearsToRetire, inputs.annualRate),
  };
}

/** A goal with its inputs, e.g. for the downloadable report. */
export type GoalRequest =
  | { goal: CostGoalType; inputs: GoalInputs }
  | { goal: "retirement"; inputs: RetirementInputs };

export interface GoalYearPoint extends YearlyPoint {
  /** What the goal needs at the end of this year (cost after inflation, or the target corpus). */
  target: number;
}

/**
 * Year-end SIP balance (invested + value, same model as the SIP calculator)
 * alongside the goal's target for that year, for the projection chart.
 */
export function savingsPath(
  monthlySip: number,
  years: number,
  annualRate: number,
  targetAt: (year: number) => number
): GoalYearPoint[] {
  return calculate({ mode: "sip", amount: monthlySip, annualStepUp: 0, years, annualRate }).yearly.map(
    (p) => ({ ...p, target: targetAt(p.year) })
  );
}

/** Projection for a cost goal: the target is today's cost grown by inflation each year. */
export function costGoalPath(inputs: GoalInputs, plan: FundingPlan = planGoal(inputs)): GoalYearPoint[] {
  return savingsPath(plan.monthlySip, inputs.years, inputs.annualRate, (year) =>
    inputs.currentCost * Math.pow(1 + inputs.inflationRate / 100, year)
  );
}

/** Projection for retirement: the target is the (fixed) corpus needed at retirement. */
export function retirementPath(
  inputs: RetirementInputs,
  plan: RetirementPlan = planRetirement(inputs)
): GoalYearPoint[] {
  return savingsPath(plan.monthlySip, plan.yearsToRetire, inputs.annualRate, () => plan.futureCost);
}
