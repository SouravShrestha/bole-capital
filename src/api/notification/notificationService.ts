import type { INotificationService, SubscribePayload } from "./INotificationService";
import { env } from "@/lib/env";

const TELEGRAM_API = `https://api.telegram.org/bot${env.telegramBotToken}/sendMessage`;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const notificationService: INotificationService = {
  async sendSubscribeNotification(payload: SubscribePayload): Promise<void> {
    const { email } = payload;

    const text = [
      `✨ <b>New Subscriber - Bole Capital</b>`,
      ``,
      `📧 <b>Email:</b> ${escapeHtml(email)}`,
    ].join("\n");

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
  },
};

export default notificationService;
