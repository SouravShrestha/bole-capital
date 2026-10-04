export type CalculatorMode = "sip" | "lumpsum";

export interface CalculatorInputs {
  mode: CalculatorMode;
  /** Monthly SIP amount, or one-time lumpsum amount. */
  amount: number;
  /** Rupee increase to the monthly SIP applied at the start of each new year. SIP only. */
  annualStepUp: number;
  years: number;
  /** Expected annual return, in percent (e.g. 12 for 12%). */
  annualRate: number;
}

export interface YearlyPoint {
  year: number;
  invested: number;
  value: number;
}

export interface CalculatorResult {
  invested: number;
  maturity: number;
  returns: number;
  /** Returns as a percentage of total invested. */
  returnsPercent: number;
  yearly: YearlyPoint[];
}

/**
 * Converts an annual rate to an equivalent compounded monthly rate.
 * Using the effective rate (rather than annual/12) means 12 months of
 * compounding reproduces the stated annual return exactly.
 */
function monthlyRate(annualRatePercent: number): number {
  return Math.pow(1 + annualRatePercent / 100, 1 / 12) - 1;
}

/**
 * SIP: contributions are made at the start of each month (annuity due).
 * Step-up raises the monthly contribution by a fixed amount every year.
 */
function calculateSip(inputs: CalculatorInputs): CalculatorResult {
  const i = monthlyRate(inputs.annualRate);
  const yearly: YearlyPoint[] = [];
  let value = 0;
  let invested = 0;

  for (let year = 0; year < inputs.years; year++) {
    const contribution = inputs.amount + inputs.annualStepUp * year;
    for (let month = 0; month < 12; month++) {
      value = (value + contribution) * (1 + i);
      invested += contribution;
    }
    yearly.push({ year: year + 1, invested, value });
  }

  return summarise(invested, value, yearly);
}

function calculateLumpsum(inputs: CalculatorInputs): CalculatorResult {
  const r = inputs.annualRate / 100;
  const yearly: YearlyPoint[] = [];
  for (let year = 1; year <= inputs.years; year++) {
    yearly.push({
      year,
      invested: inputs.amount,
      value: inputs.amount * Math.pow(1 + r, year),
    });
  }
  const maturity = yearly.at(-1)?.value ?? inputs.amount;
  return summarise(inputs.amount, maturity, yearly);
}

function summarise(
  invested: number,
  maturity: number,
  yearly: YearlyPoint[]
): CalculatorResult {
  const returns = maturity - invested;
  return {
    invested,
    maturity,
    returns,
    returnsPercent: invested > 0 ? (returns / invested) * 100 : 0,
    yearly,
  };
}

export function calculate(inputs: CalculatorInputs): CalculatorResult {
  return inputs.mode === "sip"
    ? calculateSip(inputs)
    : calculateLumpsum(inputs);
}

const fullFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/** ₹12,34,567 */
export function formatRupees(value: number): string {
  return `₹${fullFormatter.format(Math.round(value))}`;
}

/** ₹13.15 L, ₹2.40 Cr, ₹45,000 */
export function formatRupeesCompact(value: number): string {
  if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)} Cr`;
  if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)} L`;
  return formatRupees(value);
}

/** 12,345 (no currency symbol, for input fields) */
export function formatNumber(value: number): string {
  return fullFormatter.format(value);
}
