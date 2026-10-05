# Bole Capital

Website for Bole Capital, an AMFI-registered mutual fund distributor (ARN-366194) in Dhanbad. Static Next.js site on Cloudflare Workers; form submissions are forwarded to Telegram in real time.

## Getting Started

1. Clone this repository: `git clone https://github.com/SouravShrestha/bole-capital.git`
2. Navigate into the project directory: `cd bole-capital`
3. Install the dependencies: `npm ci`
4. Create `.env.local` with `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` (see [Environment variables](#environment-variables))
5. Start the development server: `npm run dev`
6. Open `http://localhost:3000`

## How it works

- **Pages**: home, about, services (plus `/services/<slug>` alias pages that share the same design), contact, SIP calculator, FAQ, glossary, sitemap, and policy pages (privacy, commission disclosures, grievance redressal, terms of use). All statically prerendered.
- **Forms**: the site-wide "Book My Portfolio Review" CTA posts to `POST /api/portfolio-review`; the contact form posts to `POST /api/contact`. Both check the request origin, rate-limit per IP (1 request/60s via the Workers Rate Limiting binding, in-memory fallback locally), validate input, drop honeypot bot submissions, and send a Telegram message.
- **No data is stored**: submissions are forwarded to Telegram only; there is no database.
- **Compliance**: ARN, EUIN, ARN validity, disclaimers and regulator links live in `src/lib/compliance.ts`. EUIN and ARN validity are placeholders (`null`) and stay hidden until filled in.
- **Last updated**: the footer date and `sitemap.xml` `<lastmod>` come from the last git commit date at build time.
- **Security headers**: CSP, HSTS and related headers are set in `next.config.ts`.

## Stack

- Next.js 16 (App Router, React 19), TypeScript, Tailwind CSS v4
- Cloudflare Workers via OpenNext, Workers Rate Limiting binding
- Telegram Bot API for notifications
- Vitest for unit tests

## Environment variables

Set these as Cloudflare Worker secrets per environment. They're read at runtime only:

| Variable | Description |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Bot token from Telegram's BotFather |
| `TELEGRAM_CHAT_ID` | Chat ID(s) to notify; comma-separated for multiple |

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN --env test
npx wrangler secret put TELEGRAM_CHAT_ID --env test

npx wrangler secret put TELEGRAM_BOT_TOKEN --env production
npx wrangler secret put TELEGRAM_CHAT_ID --env production
```

For local development, add them to `.env.local` instead.

The `RATE_LIMITER` binding is declared per environment in `wrangler.toml`; no extra setup is needed.

## Development Commands

- Development server: `npm run dev`
- Production build: `npm run build`
- Unit tests: `npm test`
- ESLint: `npm run lint`
- Preview on the local Workers runtime: `npm run preview`
- Deploy: `npm run deploy`

CI runs lint, tests and both builds before every deploy.

## Contributing

Contributions are welcome. Please fork the repo and submit a pull request.

## License

Private/proprietary - no license file is currently included in this repository.
