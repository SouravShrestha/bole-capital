import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => {
    throw new Error("not in a Workers request");
  },
}));

const { checkMemoryRateLimit, checkRateLimit } = await import("./rateLimiter");

const OPTS = { maxRequests: 1, windowMs: 60_000 };
const uniqueKey = (p: string) => `${p}:${Math.random()}`;

describe("checkMemoryRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("allows the first request and blocks the second within the window", () => {
    const key = uniqueKey("t1");
    expect(checkMemoryRateLimit(key, OPTS)).toEqual({ allowed: true, retryAfterMs: 0 });

    vi.advanceTimersByTime(10_000);
    const blocked = checkMemoryRateLimit(key, OPTS);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBe(50_000);
  });

  it("allows again once the window has passed", () => {
    const key = uniqueKey("t2");
    checkMemoryRateLimit(key, OPTS);
    vi.advanceTimersByTime(60_001);
    expect(checkMemoryRateLimit(key, OPTS).allowed).toBe(true);
  });

  it("tracks keys independently", () => {
    expect(checkMemoryRateLimit(uniqueKey("a"), OPTS).allowed).toBe(true);
    expect(checkMemoryRateLimit(uniqueKey("b"), OPTS).allowed).toBe(true);
  });
});

describe("checkRateLimit", () => {
  it("uses the Workers binding when present", async () => {
    const limit = vi.fn().mockResolvedValueOnce({ success: true }).mockResolvedValueOnce({ success: false });
    const key = uniqueKey("binding");

    expect(await checkRateLimit(key, OPTS, { limit })).toEqual({ allowed: true, retryAfterMs: 0 });
    expect(await checkRateLimit(key, OPTS, { limit })).toEqual({ allowed: false, retryAfterMs: 60_000 });
    expect(limit).toHaveBeenCalledWith({ key });
  });

  it("falls back to memory when there is no binding", async () => {
    const key = uniqueKey("fallback");
    expect((await checkRateLimit(key, OPTS)).allowed).toBe(true);
    expect((await checkRateLimit(key, OPTS)).allowed).toBe(false);
  });

  it("falls back to memory when the binding throws", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const limit = vi.fn().mockRejectedValue(new Error("boom"));
    const key = uniqueKey("throws");
    expect((await checkRateLimit(key, OPTS, { limit })).allowed).toBe(true);
    expect((await checkRateLimit(key, OPTS, { limit })).allowed).toBe(false);
  });
});
