import { describe, expect, it } from "vitest";
import { COMPLIANCE, DISTRIBUTOR_STATEMENT, REGULATORY_LINKS, formatCompliance } from "./compliance";

const BASE = { arnNumber: "366194", legalName: "Hemant Bole", euin: null, arnValidTill: null };

describe("formatCompliance", () => {
  it("omits EUIN and validity while they are null", () => {
    const lines = formatCompliance(BASE);
    expect(lines).toEqual(["ARN: 366194", "Legal Name: Hemant Bole"]);
    expect(lines.join(" ")).not.toMatch(/EUIN|Valid|TODO|null/);
  });

  it("includes EUIN and validity once set", () => {
    const lines = formatCompliance({ ...BASE, euin: "E123456", arnValidTill: "2028-03-31" });
    expect(lines).toContain("EUIN: E123456");
    expect(lines.some((l) => l.startsWith("Valid till:") && l.includes("2028"))).toBe(true);
  });

  it("ignores an invalid validity date", () => {
    expect(formatCompliance({ ...BASE, arnValidTill: "soon" })).toHaveLength(2);
  });
});

describe("compliance constants", () => {
  it("keeps the ARN consistent", () => {
    expect(COMPLIANCE.arn).toBe(`ARN-${COMPLIANCE.arnNumber}`);
    expect(DISTRIBUTOR_STATEMENT).toContain(COMPLIANCE.arn);
  });

  it("uses https for every regulatory link", () => {
    for (const { href } of REGULATORY_LINKS) expect(href).toMatch(/^https:\/\//);
  });
});
