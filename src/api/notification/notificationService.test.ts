import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: { telegramBotToken: "TEST_TOKEN", telegramChatId: "111, 222" },
}));

const { default: notificationService } = await import("./notificationService");

type TelegramBody = { chat_id: string; text: string; parse_mode: string };

function bodies(fetchMock: ReturnType<typeof vi.fn>): TelegramBody[] {
  return fetchMock.mock.calls.map(([, init]) => JSON.parse((init as RequestInit).body as string));
}

describe("notificationService", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("sends a portfolio review request to every chat id", async () => {
    await notificationService.sendPortfolioReviewNotification({
      name: "Asha",
      email: "asha@example.com",
      phone: "+91 90000 00000",
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.telegram.org/botTEST_TOKEN/sendMessage");
    const sent = bodies(fetchMock);
    expect(sent.map((b) => b.chat_id)).toEqual(["111", "222"]);
    expect(sent[0].parse_mode).toBe("HTML");
    expect(sent[0].text).toContain("New Portfolio Review Request");
    expect(sent[0].text).toContain("asha@example.com");
    expect(sent[0].text).toContain("+91 90000 00000");
  });

  it("escapes HTML in user input", async () => {
    await notificationService.sendContactNotification({
      name: "<b>x</b> & co",
      phone: "9999999999",
      message: "<script>",
    });
    const { text } = bodies(fetchMock)[0];
    expect(text).toContain("&lt;b&gt;x&lt;/b&gt; &amp; co");
    expect(text).toContain("&lt;script&gt;");
    expect(text).not.toContain("<script>");
  });

  it("throws when Telegram responds with an error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockImplementation(async () => new Response("bad", { status: 400 }));
    await expect(
      notificationService.sendPortfolioReviewNotification({
        name: "A",
        email: "a@b.co",
        phone: "9999999999",
      })
    ).rejects.toThrow(/Telegram API error/);
  });
});
