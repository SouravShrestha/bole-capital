import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
  FormError,
  assertSameOrigin,
  getClientIp,
  isBot,
  optionalString,
  readJsonBody,
  requiredString,
  validateEmail,
  validatePhone,
} from "./formSecurity";
import { HONEYPOT_FIELD } from "./formLimits";

function req(headers: Record<string, string>, body?: string) {
  return new NextRequest("https://bolecapital.in/api/test", {
    method: "POST",
    headers,
    body,
  });
}

function expectFormError(fn: () => unknown, status: number) {
  try {
    fn();
  } catch (err) {
    expect(err).toBeInstanceOf(FormError);
    expect((err as FormError).status).toBe(status);
    return;
  }
  throw new Error("Expected FormError");
}

async function expectAsyncFormError(p: Promise<unknown>, status: number) {
  const err = await p.then(
    () => null,
    (e: unknown) => e
  );
  expect(err).toBeInstanceOf(FormError);
  expect((err as FormError).status).toBe(status);
}

describe("assertSameOrigin", () => {
  it("accepts a matching Origin and Host", () => {
    expect(() =>
      assertSameOrigin(req({ origin: "https://bolecapital.in", host: "bolecapital.in" }))
    ).not.toThrow();
  });

  it("rejects a cross-site Origin", () => {
    expectFormError(
      () => assertSameOrigin(req({ origin: "https://evil.example", host: "bolecapital.in" })),
      403
    );
  });

  it("rejects a missing Origin", () => {
    expectFormError(() => assertSameOrigin(req({ host: "bolecapital.in" })), 403);
  });

  it("rejects a malformed Origin", () => {
    expectFormError(() => assertSameOrigin(req({ origin: "not a url", host: "bolecapital.in" })), 403);
  });
});

describe("getClientIp", () => {
  it("prefers cf-connecting-ip", () => {
    expect(getClientIp(req({ "cf-connecting-ip": "1.2.3.4", "x-forwarded-for": "9.9.9.9" }))).toBe(
      "1.2.3.4"
    );
  });
});

describe("readJsonBody", () => {
  it("parses a JSON object", async () => {
    const body = await readJsonBody(req({ "content-type": "application/json" }, '{"a":1}'));
    expect(body).toEqual({ a: 1 });
  });

  it("rejects non-JSON content types with 415", async () => {
    await expectAsyncFormError(readJsonBody(req({ "content-type": "text/plain" }, "{}")), 415);
  });

  it("rejects bodies over 4KB with 413", async () => {
    const big = JSON.stringify({ x: "a".repeat(5000) });
    await expectAsyncFormError(readJsonBody(req({ "content-type": "application/json" }, big)), 413);
  });

  it("rejects arrays and invalid JSON with 400", async () => {
    await expectAsyncFormError(readJsonBody(req({ "content-type": "application/json" }, "[]")), 400);
    await expectAsyncFormError(readJsonBody(req({ "content-type": "application/json" }, "{oops")), 400);
  });
});

describe("string helpers", () => {
  it("strips control chars and collapses newlines on single-line fields", () => {
    expect(optionalString({ v: "  a\u0000b\r\nc  " }, "v", 50)).toBe("ab c");
  });

  it("keeps newlines on multiline fields", () => {
    expect(optionalString({ v: "a\nb" }, "v", 50, { multiline: true })).toBe("a\nb");
  });

  it("returns undefined for empty or absent values", () => {
    expect(optionalString({ v: "   " }, "v", 10)).toBeUndefined();
    expect(optionalString({}, "v", 10)).toBeUndefined();
  });

  it("rejects wrong types and over-length values", () => {
    expectFormError(() => optionalString({ v: 42 }, "v", 10), 400);
    expectFormError(() => optionalString({ v: "x".repeat(11) }, "v", 10), 400);
  });

  it("requiredString throws when missing", () => {
    expectFormError(() => requiredString({}, "v", 10), 400);
  });
});

describe("validators", () => {
  it("validates emails", () => {
    expect(validateEmail("a@b.co")).toBe("a@b.co");
    expectFormError(() => validateEmail("a@b"), 400);
  });

  it("validates phones", () => {
    expect(validatePhone("+91 98765-43210")).toBe("+91 98765-43210");
    expectFormError(() => validatePhone("12345"), 400);
    expectFormError(() => validatePhone("98765abc43"), 400);
  });

  it("detects the honeypot", () => {
    expect(isBot({ [HONEYPOT_FIELD]: "spam" })).toBe(true);
    expect(isBot({ [HONEYPOT_FIELD]: "  " })).toBe(false);
    expect(isBot({})).toBe(false);
  });
});
