import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { HONEYPOT_FIELD } from "@/lib/formLimits";

const send = vi.hoisted(() => vi.fn());
vi.mock("@/api/notification/notificationService", () => ({
  default: { sendPortfolioReviewNotification: send, sendContactNotification: vi.fn() },
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: () => {
    throw new Error("not in a Workers request");
  },
}));

const { POST } = await import("./route");

const VALID = { name: "Asha", email: "asha@example.com", phone: "+91 90000 00000" };
let ipCounter = 0;

function makeReq({
  body = VALID as unknown,
  origin = "https://bolecapital.in",
  contentType = "application/json",
  ip,
}: { body?: unknown; origin?: string | null; contentType?: string; ip?: string } = {}) {
  const headers: Record<string, string> = {
    host: "bolecapital.in",
    "content-type": contentType,
    // Unique IP per request so the 1/min rate limit doesn't leak between tests.
    "cf-connecting-ip": ip ?? `10.0.0.${++ipCounter}`,
  };
  if (origin) headers.origin = origin;
  return new NextRequest("https://bolecapital.in/api/portfolio-review", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/portfolio-review", () => {
  beforeEach(() => {
    send.mockReset().mockResolvedValue(undefined);
  });

  it("forwards a valid request", async () => {
    const res = await POST(makeReq());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(send).toHaveBeenCalledWith(VALID);
  });

  it("accepts a request without an email", async () => {
    const res = await POST(makeReq({ body: { name: VALID.name, phone: VALID.phone, email: "" } }));
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledWith({ name: VALID.name, phone: VALID.phone, email: undefined });
  });

  it("rejects cross-site requests with 403", async () => {
    const res = await POST(makeReq({ origin: "https://evil.example" }));
    expect(res.status).toBe(403);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects non-JSON with 415", async () => {
    const res = await POST(makeReq({ contentType: "text/plain" }));
    expect(res.status).toBe(415);
  });

  it("rejects missing or invalid fields with 400", async () => {
    expect((await POST(makeReq({ body: { email: VALID.email, phone: VALID.phone } }))).status).toBe(400);
    expect((await POST(makeReq({ body: { ...VALID, email: "nope" } }))).status).toBe(400);
    expect((await POST(makeReq({ body: { ...VALID, phone: "123" } }))).status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("fakes success for honeypot submissions", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const res = await POST(makeReq({ body: { ...VALID, [HONEYPOT_FIELD]: "bot" } }));
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("rate-limits repeat requests from the same IP with 429 + Retry-After", async () => {
    await POST(makeReq({ ip: "10.9.9.9" }));
    const res = await POST(makeReq({ ip: "10.9.9.9" }));
    expect(res.status).toBe(429);
    expect(Number(res.headers.get("Retry-After"))).toBeGreaterThan(0);
  });

  it("returns 500 when the notification fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    send.mockRejectedValue(new Error("down"));
    const res = await POST(makeReq());
    expect(res.status).toBe(500);
  });
});
