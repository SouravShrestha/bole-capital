import type {
  ContactPayload,
  INotificationService,
  SubscribePayload,
} from "./INotificationService";
import { env } from "@/lib/env";

const TELEGRAM_API = `https://api.telegram.org/bot${env.telegramBotToken}/sendMessage`;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendToTelegram(text: string): Promise<void> {
  const chatIds = env.telegramChatId
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  await Promise.all(
    chatIds.map(async (chatId) => {
      const response = await fetch(TELEGRAM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Telegram API error for chat_id ${chatId}:`, error);
        throw new Error(`Telegram API error: ${error}`);
      }
    })
  );
}

const notificationService: INotificationService = {
  async sendSubscribeNotification(payload: SubscribePayload): Promise<void> {
    const { email, name, phone } = payload;

    const lines = [`✨ <b>New Subscriber - Bole Capital</b>`, ``];
    if (name) lines.push(`👤 <b>Name:</b> ${escapeHtml(name)}`);
    lines.push(`📧 <b>Email:</b> ${escapeHtml(email)}`);
    if (phone) lines.push(`📱 <b>Phone:</b> ${escapeHtml(phone)}`);

    await sendToTelegram(lines.join("\n"));
  },

  async sendContactNotification(payload: ContactPayload): Promise<void> {
    const { name, phone, message, email } = payload;

    const lines = [
      `💬 <b>New Contact Message - Bole Capital</b>`,
      ``,
      `👤 <b>Name:</b> ${escapeHtml(name)}`,
    ];
    if (email) lines.push(`📧 <b>Email:</b> ${escapeHtml(email)}`);
    lines.push(`📱 <b>Phone:</b> ${escapeHtml(phone)}`);
    lines.push(``, `📝 <b>Message:</b>`, escapeHtml(message));

    await sendToTelegram(lines.join("\n"));
  },
};

export default notificationService;
