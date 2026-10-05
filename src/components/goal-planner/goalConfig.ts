import type { RangeMark } from "@/components/sip-calculator/RangeField";
import type { CostGoalType, GoalInputs, GoalType, RetirementInputs } from "@/lib/goalPlanner";

/** Plain data (no client code) so server components can import it too. */

type Limits = { min: number; max: number; step: number };

export type CostGoalConfig = {
  /** Noun used in copy, e.g. "dream home". */
  noun: string;
  yearsLabel: string;
  costLabel: string;
  years: Limits;
  cost: Limits;
  yearMarks: RangeMark[];
  costMarks: RangeMark[];
  inflationMarks: RangeMark[];
};

/** Toggle labels and the one-line pitch shown with each plan. */
export const GOAL_META: Record<GoalType, { label: string; title: string; tagline: string }> = {
  education: {
    label: "Education",
    title: "Child's education",
    tagline: "Their dreams shouldn't wait for your savings to catch up.",
  },
  retirement: {
    label: "Retirement",
    title: "Retirement",
    tagline: "Retire on your terms, not on a tight budget.",
  },
  house: {
    label: "Home",
    title: "Dream home",
    tagline: "Get the keys to your dream home, without the EMI weighing you down.",
  },
  car: {
    label: "Car",
    title: "Dream car",
    tagline: "Drive your dream car home, paid for by your own plan.",
  },
};

export const GOAL_ORDER: GoalType[] = ["education", "retirement", "house", "car"];

/** Legend label for the target line in the projection chart. */
export const targetLabel = (goal: GoalType) => (goal === "retirement" ? "Target corpus" : "Goal cost");

/** Explainer cards below the planner; also drawn into the downloaded report. */
export const GOAL_INFO_POINTS = [
  {
    title: "Give every goal a number",
    body: "A goal with an amount and a date is a plan. Without them, it's just a wish. Pick what matters most, set a timeline and let the maths do the rest.",
    rotation: -1,
  },
  {
    title: "Plan for tomorrow's prices",
    body: "Inflation quietly moves the goalpost. A course that costs ₹25 L today could cost over ₹75 L in 12 years at 10% a year. Planning with future prices keeps you from falling short.",
    rotation: 3,
  },
  {
    title: "Start early, stress less",
    body: "The sooner you begin, the more compounding does the heavy lifting and the smaller your monthly SIP needs to be. Waiting even a few years can make the same goal much harder to reach.",
    rotation: 0,
  },
];

/** "How we work it out" rows; also drawn into the downloaded report. */
export const GOAL_METHOD_STEPS = [
  { label: "Future cost", formula: "Today's cost × (1 + inflation)^years" },
  { label: "Monthly SIP", formula: "Future cost ÷ [((1 + i)^n − 1) ÷ i × (1 + i)]" },
  { label: "Lumpsum", formula: "Future cost ÷ (1 + return)^years" },
  {
    label: "Retirement corpus",
    formula:
      "Every year's inflation-adjusted expenses until your chosen age, discounted at the post-retirement return",
  },
];

export const GOAL_METHOD_NOTE =
  "Here i is the monthly rate, (1 + annual return)^(1/12) − 1, and n is the number of months. SIPs are invested at the start of each month, the same way as our SIP calculator.";

const STANDARD_INFLATION_MARKS: RangeMark[] = [
  { value: 4, label: "4%" },
  { value: 6, label: "6%" },
  { value: 8, label: "8%" },
  { value: 10, label: "10%" },
];

export const COST_GOAL_CONFIG: Record<CostGoalType, CostGoalConfig> = {
  education: {
    noun: "child's education",
    yearsLabel: "Years until your child starts college",
    costLabel: "Current cost of the course",
    years: { min: 1, max: 25, step: 1 },
    cost: { min: 100000, max: 50000000, step: 10000 },
    yearMarks: [
      { value: 5, label: "5Y" },
      { value: 10, label: "10Y" },
      { value: 15, label: "15Y" },
      { value: 18, label: "18Y" },
    ],
    costMarks: [
      { value: 1000000, label: "10L" },
      { value: 2500000, label: "25L" },
      { value: 5000000, label: "50L" },
      { value: 10000000, label: "1Cr" },
    ],
    // Education costs in India have tended to rise faster than general prices.
    inflationMarks: [
      { value: 6, label: "6%" },
      { value: 8, label: "8%" },
      { value: 10, label: "10%" },
      { value: 12, label: "12%" },
    ],
  },
  house: {
    noun: "dream home",
    yearsLabel: "Years until you buy your home",
    costLabel: "Current cost of the house",
    years: { min: 1, max: 30, step: 1 },
    cost: { min: 500000, max: 150000000, step: 50000 },
    yearMarks: [
      { value: 5, label: "5Y" },
      { value: 10, label: "10Y" },
      { value: 15, label: "15Y" },
      { value: 20, label: "20Y" },
    ],
    costMarks: [
      { value: 2500000, label: "25L" },
      { value: 5000000, label: "50L" },
      { value: 10000000, label: "1Cr" },
      { value: 30000000, label: "3Cr" },
    ],
    inflationMarks: STANDARD_INFLATION_MARKS,
  },
  car: {
    noun: "dream car",
    yearsLabel: "Years until you buy your car",
    costLabel: "Current cost of the car",
    years: { min: 1, max: 10, step: 1 },
    cost: { min: 100000, max: 50000000, step: 10000 },
    yearMarks: [
      { value: 2, label: "2Y" },
      { value: 4, label: "4Y" },
      { value: 6, label: "6Y" },
      { value: 8, label: "8Y" },
    ],
    costMarks: [
      { value: 500000, label: "5L" },
      { value: 1000000, label: "10L" },
      { value: 2500000, label: "25L" },
      { value: 5000000, label: "50L" },
    ],
    inflationMarks: STANDARD_INFLATION_MARKS,
  },
};

export const COST_GOAL_DEFAULTS: Record<CostGoalType, GoalInputs> = {
  education: { years: 12, currentCost: 2500000, inflationRate: 10, annualRate: 12 },
  house: { years: 20, currentCost: 5000000, inflationRate: 6, annualRate: 10 },
  car: { years: 5, currentCost: 1000000, inflationRate: 6, annualRate: 12 },
};

export const RETIREMENT_DEFAULTS: RetirementInputs = {
  currentAge: 30,
  retirementAge: 60,
  lifeExpectancy: 85,
  monthlyExpenses: 50000,
  inflationRate: 6,
  annualRate: 12,
  postRetirementRate: 8,
};

export const RETIREMENT_LIMITS = {
  currentAge: { min: 18, max: 69, step: 1 },
  retirementAge: { min: 19, max: 75, step: 1 },
  lifeExpectancy: { min: 20, max: 100, step: 1 },
  monthlyExpenses: { min: 5000, max: 1000000, step: 1000 },
} as const satisfies Record<string, Limits>;

export const RETIREMENT_MARKS = {
  currentAge: [
    { value: 25, label: "25" },
    { value: 30, label: "30" },
    { value: 40, label: "40" },
    { value: 50, label: "50" },
  ],
  retirementAge: [
    { value: 45, label: "45" },
    { value: 55, label: "55" },
    { value: 60, label: "60" },
    { value: 65, label: "65" },
  ],
  lifeExpectancy: [
    { value: 75, label: "75" },
    { value: 80, label: "80" },
    { value: 85, label: "85" },
    { value: 90, label: "90" },
  ],
  monthlyExpenses: [
    { value: 25000, label: "25K" },
    { value: 50000, label: "50K" },
    { value: 100000, label: "1L" },
    { value: 200000, label: "2L" },
  ],
  postRetirementRate: [
    { value: 6, label: "6%" },
    { value: 7, label: "7%" },
    { value: 8, label: "8%" },
    { value: 9, label: "9%" },
  ],
} satisfies Record<string, RangeMark[]>;

export const INFLATION_LIMITS: Limits = { min: 0, max: 20, step: 0.5 };
export const RATE_LIMITS: Limits = { min: 1, max: 30, step: 0.5 };
export const INFLATION_MARKS = STANDARD_INFLATION_MARKS;
export const RATE_MARKS: RangeMark[] = [
  { value: 10, label: "10%" },
  { value: 12, label: "12%" },
  { value: 14, label: "14%" },
  { value: 16, label: "16%" },
];
