function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

export const env = {
  telegramBotToken: requireEnv("TELEGRAM_BOT_TOKEN"),
  telegramChatId: requireEnv("TELEGRAM_CHAT_ID"),
};
