import { describe, expect, it } from "vitest";
import { resolveLastUpdated } from "./lastUpdated";

const NOW = () => new Date("2026-01-02T03:04:05.000Z");

describe("resolveLastUpdated", () => {
  it("uses the last commit date from git", () => {
    const exec = (cmd: string) => {
      expect(cmd).toBe("git log -1 --format=%cI");
      return "2026-10-05T18:32:15+05:30\n";
    };
    expect(resolveLastUpdated(exec, NOW)).toBe("2026-10-05T13:02:15.000Z");
  });

  it("falls back to the build date when git fails", () => {
    const exec = () => {
      throw new Error("not a git repository");
    };
    expect(resolveLastUpdated(exec, NOW)).toBe(NOW().toISOString());
  });

  it("falls back when git returns something that isn't a date", () => {
    expect(resolveLastUpdated(() => "", NOW)).toBe(NOW().toISOString());
    expect(resolveLastUpdated(() => "garbage", NOW)).toBe(NOW().toISOString());
  });

  it("works against the real repository", () => {
    expect(Number.isNaN(new Date(resolveLastUpdated()).getTime())).toBe(false);
  });
});
