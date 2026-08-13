import { NextRequest, NextResponse } from "next/server";
import notificationService from "@/api/notification/notificationService";
import type { SubscribePayload } from "@/api/notification/INotificationService";
import { checkRateLimit } from "@/lib/rateLimiter";

const RATE_LIMIT = { maxRequests: 1, windowMs: 60_000 };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";

  const { allowed, retryAfterMs } = checkRateLimit(`subscribe:${ip}`, RATE_LIMIT);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
      }
    );
  }

  try {
    const body = (await req.json()) as SubscribePayload;
    const email = body.email?.trim();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    await notificationService.sendSubscribeNotification({ email });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe API error:", err);
    return NextResponse.json({ error: "Failed to send notification." }, { status: 500 });
  }
}
