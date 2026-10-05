import { NextRequest, NextResponse } from "next/server";
import notificationService from "@/api/notification/notificationService";
import { checkRateLimit } from "@/lib/rateLimiter";
import {
  FormError,
  LIMITS,
  assertSameOrigin,
  errorResponse,
  getClientIp,
  isBot,
  optionalString,
  readJsonBody,
  requiredString,
  validateEmail,
  validatePhone,
} from "@/lib/formSecurity";

const RATE_LIMIT = { maxRequests: 1, windowMs: 60_000 };

export async function POST(req: NextRequest) {
  try {
    // Cheap checks first so cross-site/junk requests don't consume rate-limit quota.
    assertSameOrigin(req);

    const { allowed, retryAfterMs } = checkRateLimit(`subscribe:${getClientIp(req)}`, RATE_LIMIT);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }

    const body = await readJsonBody(req);

    // Pretend success so bots don't learn they were filtered.
    if (isBot(body)) {
      console.warn("Subscribe: honeypot triggered, submission dropped");
      return NextResponse.json({ success: true });
    }

    const email = validateEmail(requiredString(body, "email", LIMITS.email));
    const name = optionalString(body, "name", LIMITS.name);
    const rawPhone = optionalString(body, "phone", LIMITS.phone);
    const phone = rawPhone ? validatePhone(rawPhone) : undefined;

    await notificationService.sendSubscribeNotification({ email, name, phone });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof FormError) return errorResponse(err);
    console.error("Subscribe API error:", err);
    return NextResponse.json({ error: "Failed to send notification." }, { status: 500 });
  }
}
