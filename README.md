# Bole Capital

Bole Capital's "coming soon" landing page - a themed hero section where visitors can subscribe to be notified when the full site launches. Subscriptions are forwarded to Telegram in real time.

## Getting Started

### Installation steps

1. Clone this repository: `git clone https://github.com/SouravShrestha/bole-capital.git`
2. Navigate into the project directory: `cd bole-capital`
3. Install the dependencies: `npm install`
4. Copy `.env.local` and set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` (see [Environment variables](#environment-variables))
5. Start the development server: `npm run dev`
6. Open your browser and go to `http://localhost:3000`

## How it works

1. **Landing page**: Visitors see a hero section with a dark/light theme toggle (persisted in `localStorage`) and an email subscribe form.
2. **Subscribe**: Submitting a valid email hits `POST /api/subscribe`, which rate-limits by IP (1 request/60s), validates the email, and sends a Telegram notification to the configured chat(s).
3. **No data is stored**: Emails are forwarded to Telegram only - there is no database or persistence layer.

## Stack

- Next.js 16 (App Router, React 19)
- Tailwind CSS v4
- TypeScript
- Cloudflare Workers (via OpenNext)
- Telegram Bot API for subscriber notifications

## Environment variables

Set these as Cloudflare Worker secrets per environment (not as CI/CD secrets, since they're only read at runtime):

| Variable | Description |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Bot token from Telegram's BotFather |
| `TELEGRAM_CHAT_ID` | Chat ID(s) to notify on new subscribers; comma-separated for multiple |

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN --env test
npx wrangler secret put TELEGRAM_CHAT_ID --env test

npx wrangler secret put TELEGRAM_BOT_TOKEN --env production
npx wrangler secret put TELEGRAM_CHAT_ID --env production
```

For local development, add them to `.env.local` instead.

## Development Commands

- Run Development Server: `npm run dev`
- Build for Production: `npm run build`
- Preview on Cloudflare Workers locally: `npm run preview`
- Deploy: `npm run deploy`
- Run ESLint: `npm run lint`

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

## License

Private/proprietary - no license file is currently included in this repository.
