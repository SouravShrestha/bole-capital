import { describe, expect, it } from "vitest";
import { calculate, formatRupees, formatRupeesCompact } from "./sipCalculator";

describe("calculate (SIP)", () => {
  it("with 0% return, maturity equals total invested", () => {
    const r = calculate({ mode: "sip", amount: 5000, annualStepUp: 0, years: 10, annualRate: 0 });
    expect(r.invested).toBe(600_000);
    expect(r.maturity).toBeCloseTo(600_000, 6);
    expect(r.returns).toBeCloseTo(0, 6);
    expect(r.yearly).toHaveLength(10);
  });

  it("matches the annuity-due formula for a flat SIP", () => {
    const amount = 10_000;
    const years = 10;
    const i = Math.pow(1.12, 1 / 12) - 1;
    const n = years * 12;
    const expected = amount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);

    const r = calculate({ mode: "sip", amount, annualStepUp: 0, years, annualRate: 12 });
    expect(r.invested).toBe(1_200_000);
    expect(r.maturity).toBeCloseTo(expected, 4);
    expect(r.returnsPercent).toBeCloseTo((r.returns / r.invested) * 100, 10);
  });

  it("applies the annual step-up from year 2", () => {
    const r = calculate({ mode: "sip", amount: 1000, annualStepUp: 500, years: 2, annualRate: 0 });
    expect(r.yearly[0].invested).toBe(12_000);
    expect(r.invested).toBe(12_000 + 18_000);
  });

  it("12 months at the effective monthly rate reproduces the annual rate", () => {
    const r = calculate({ mode: "sip", amount: 1000, annualStepUp: 0, years: 1, annualRate: 12 });
    // First contribution compounds for 12 full months.
    expect(r.maturity).toBeGreaterThan(12_000);
    expect(r.maturity).toBeLessThan(12_000 * 1.12);
  });
});

describe("calculate (lumpsum)", () => {
  it("compounds annually", () => {
    const r = calculate({ mode: "lumpsum", amount: 100_000, annualStepUp: 0, years: 2, annualRate: 10 });
    expect(r.maturity).toBeCloseTo(121_000, 6);
    expect(r.invested).toBe(100_000);
  });

  it("returns the principal when years is 0", () => {
    const r = calculate({ mode: "lumpsum", amount: 5000, annualStepUp: 0, years: 0, annualRate: 10 });
    expect(r.maturity).toBe(5000);
    expect(r.yearly).toEqual([]);
  });
});

describe("formatting", () => {
  it("uses Indian digit grouping", () => {
    expect(formatRupees(1234567)).toBe("₹12,34,567");
  });

  it("compacts to lakh and crore", () => {
    expect(formatRupeesCompact(1_315_000)).toBe("₹13.15 L");
    expect(formatRupeesCompact(24_000_000)).toBe("₹2.40 Cr");
    expect(formatRupeesCompact(45_000)).toBe("₹45,000");
  });
});
