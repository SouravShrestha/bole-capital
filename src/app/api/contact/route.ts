import { NextRequest, NextResponse } from "next/server";
import notificationService from "@/api/notification/notificationService";
import type { ContactPayload } from "@/api/notification/INotificationService";
import { checkRateLimit } from "@/lib/rateLimiter";

const RATE_LIMIT = { maxRequests: 1, windowMs: 60_000 };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 300;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";

  const { allowed, retryAfterMs } = checkRateLimit(`contact:${ip}`, RATE_LIMIT);

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
    const body = (await req.json()) as ContactPayload;
    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const message = body.message?.trim();
    const email = body.email?.trim() || undefined;

    if (!name || !phone || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }

    if (email && !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    await notificationService.sendContactNotification({ name, phone, message, email });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Failed to send notification." }, { status: 500 });
  }
}
