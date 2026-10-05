import { describe, expect, it } from "vitest";
import { formatRetryMessage } from "./formMessages";

describe("formatRetryMessage", () => {
  it("uses the Retry-After seconds", () => {
    expect(formatRetryMessage("42")).toContain("wait 42 seconds");
  });

  it("uses the singular for 1 second", () => {
    expect(formatRetryMessage("1")).toContain("wait 1 second before");
  });

  it("falls back to 60 seconds for missing or invalid values", () => {
    expect(formatRetryMessage(null)).toContain("wait 60 seconds");
    expect(formatRetryMessage("abc")).toContain("wait 60 seconds");
    expect(formatRetryMessage("-5")).toContain("wait 60 seconds");
  });
});
