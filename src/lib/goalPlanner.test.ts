import { describe, expect, it } from "vitest";
import { costGoalPath, planGoal, planRetirement, retirementPath } from "./goalPlanner";
import { calculate } from "./sipCalculator";

describe("planGoal", () => {
  it("inflates the current cost annually", () => {
    const p = planGoal({ years: 2, currentCost: 1_000_000, inflationRate: 10, annualRate: 12 });
    expect(p.futureCost).toBeCloseTo(1_210_000, 6);
  });

  it("discounts the future cost for the lumpsum", () => {
    const p = planGoal({ years: 5, currentCost: 1_000_000, inflationRate: 6, annualRate: 12 });
    const lumpsumGrown = calculate({
      mode: "lumpsum",
      amount: p.lumpsum,
      annualStepUp: 0,
      years: 5,
      annualRate: 12,
    });
    expect(lumpsumGrown.maturity).toBeCloseTo(p.futureCost, 4);
  });

  it("SIP amount reaches the future cost under the SIP calculator's model", () => {
    const p = planGoal({ years: 20, currentCost: 5_000_000, inflationRate: 6, annualRate: 10 });
    const sip = calculate({ mode: "sip", amount: p.monthlySip, annualStepUp: 0, years: 20, annualRate: 10 });
    expect(sip.maturity).toBeCloseTo(p.futureCost, 2);
    expect(p.sipInvested).toBeCloseTo(p.monthlySip * 240, 6);
  });

  it("handles 0% return and 0% inflation", () => {
    const p = planGoal({ years: 5, currentCost: 600_000, inflationRate: 0, annualRate: 0 });
    expect(p.futureCost).toBe(600_000);
    expect(p.lumpsum).toBe(600_000);
    expect(p.monthlySip).toBeCloseTo(10_000, 6);
  });
});

describe("planRetirement", () => {
  const base = {
    currentAge: 30,
    retirementAge: 60,
    lifeExpectancy: 85,
    monthlyExpenses: 50_000,
    inflationRate: 6,
    annualRate: 12,
    postRetirementRate: 8,
  };

  it("needs expenses x years when returns equal inflation", () => {
    const p = planRetirement({ ...base, inflationRate: 0, postRetirementRate: 0 });
    expect(p.futureCost).toBeCloseTo(50_000 * 12 * 25, 6);
    expect(p.yearsToRetire).toBe(30);
    expect(p.retirementYears).toBe(25);
  });

  it("corpus lasts exactly until life expectancy", () => {
    const p = planRetirement(base);
    let corpus = p.futureCost;
    let expenses = p.monthlyExpensesAtRetirement * 12;
    for (let y = 0; y < p.retirementYears; y++) {
      corpus = (corpus - expenses) * 1.08;
      expenses *= 1.06;
    }
    expect(corpus).toBeCloseTo(0, 2);
  });

  it("funds the corpus with the same SIP model", () => {
    const p = planRetirement(base);
    const sip = calculate({ mode: "sip", amount: p.monthlySip, annualStepUp: 0, years: 30, annualRate: 12 });
    expect(sip.maturity).toBeCloseTo(p.futureCost, 0);
  });
});

describe("goal projections", () => {
  it("cost goal: savings meet the inflated cost in the final year", () => {
    const inputs = { years: 12, currentCost: 2_500_000, inflationRate: 10, annualRate: 12 };
    const path = costGoalPath(inputs);
    expect(path).toHaveLength(12);
    expect(path[0].target).toBeCloseTo(2_750_000, 6);
    expect(path.at(-1)!.value).toBeCloseTo(path.at(-1)!.target, 2);
    expect(path.at(-1)!.target).toBeCloseTo(planGoal(inputs).futureCost, 6);
  });

  it("retirement: flat target equal to the corpus", () => {
    const inputs = {
      currentAge: 40,
      retirementAge: 60,
      lifeExpectancy: 85,
      monthlyExpenses: 50_000,
      inflationRate: 6,
      annualRate: 12,
      postRetirementRate: 8,
    };
    const plan = planRetirement(inputs);
    const path = retirementPath(inputs);
    expect(path).toHaveLength(20);
    expect(path.every((p) => p.target === plan.futureCost)).toBe(true);
    expect(path.at(-1)!.value).toBeCloseTo(plan.futureCost, 0);
  });
});
