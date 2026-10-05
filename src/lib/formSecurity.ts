import { NextRequest, NextResponse } from "next/server";
import { FORM_LIMITS, HONEYPOT_FIELD } from "./formLimits";

/**
 * Shared hardening for public form endpoints (subscribe, contact).
 * Server-only: route handlers don't get the Origin/Host check that
 * Server Actions get automatically, so we do it here.
 */

const MAX_BODY_BYTES = 4 * 1024;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const LIMITS = FORM_LIMITS;

export class FormError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export function errorResponse(err: FormError): NextResponse {
  return NextResponse.json({ error: err.message }, { status: err.status });
}

/**
 * Client IP for rate limiting. On Cloudflare Workers `cf-connecting-ip` is
 * set by the edge and can't be spoofed. `x-forwarded-for` is client-controlled,
 * so it's only trusted outside production (local dev).
 */
export function getClientIp(req: NextRequest): string {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  if (process.env.NODE_ENV !== "production") {
    const xff = req.headers.get("x-forwarded-for")?.split(",")[0].trim();
    if (xff) return xff;
  }
  return "unknown";
}

/**
 * Rejects cross-site requests. Browsers always send `Origin` on cross-origin
 * POSTs, so a mismatch (or absence on a browser fetch) means another site is
 * trying to submit on behalf of a visitor.
 */
export function assertSameOrigin(req: NextRequest): void {
  const origin = req.headers.get("origin");
  // Browsers can't set Host / X-Forwarded-Host, so either is a valid reference.
  const hosts = [req.headers.get("host"), req.headers.get("x-forwarded-host")].filter(Boolean);
  if (!origin || hosts.length === 0) throw new FormError("Forbidden.", 403);

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new FormError("Forbidden.", 403);
  }
  if (!hosts.includes(originHost)) throw new FormError("Forbidden.", 403);
}

/**
 * Requires `application/json` (forces a CORS preflight for cross-origin
 * callers, which we never approve) and reads the body with a size cap.
 */
export async function readJsonBody(req: NextRequest): Promise<Record<string, unknown>> {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new FormError("Unsupported content type.", 415);
  }

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) throw new FormError("Payload too large.", 413);

  const text = await req.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    throw new FormError("Payload too large.", 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new FormError("Invalid request body.");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new FormError("Invalid request body.");
  }
  return parsed as Record<string, unknown>;
}

/** True when the honeypot field was filled, i.e. the submitter is a bot. */
export function isBot(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim() !== "";
}

// Control characters except tab/newline (kept for multi-line messages).
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/**
 * Returns a trimmed, control-char-free string, or undefined if empty/absent.
 * Throws on wrong type or over-length input.
 */
export function optionalString(
  body: Record<string, unknown>,
  key: string,
  maxLength: number,
  { multiline = false } = {}
): string | undefined {
  const raw = body[key];
  if (raw === undefined || raw === null) return undefined;
  if (typeof raw !== "string") throw new FormError(`Invalid ${key}.`);

  let value = raw.replace(CONTROL_CHARS, "");
  if (!multiline) value = value.replace(/[\r\n\t]+/g, " ");
  value = value.trim();

  if (!value) return undefined;
  if (value.length > maxLength) throw new FormError(`The ${key} field is too long.`);
  return value;
}

export function requiredString(
  body: Record<string, unknown>,
  key: string,
  maxLength: number,
  options?: { multiline?: boolean }
): string {
  const value = optionalString(body, key, maxLength, options);
  if (!value) throw new FormError("Missing required fields.");
  return value;
}

export function validateEmail(email: string): string {
  if (!EMAIL_REGEX.test(email)) throw new FormError("Enter a valid email address.");
  return email;
}

export function validatePhone(phone: string): string {
  if (!/^[0-9+\-().\s]+$/.test(phone) || phone.replace(/\D/g, "").length < 7) {
    throw new FormError("Enter a valid phone number.");
  }
  return phone;
}
