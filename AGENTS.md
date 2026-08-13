<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` - verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Bole Capital - Agent Notes

Bole Capital's "coming soon" landing page, built on **Next.js 16 App Router**, deployed to **Cloudflare Workers** via OpenNext.

## Key Architecture Decisions

- **Single landing page**: `src/app/page.tsx` is the entire client-facing product - a themed hero section with an email subscribe form. There is no routing beyond the root page and its API route.
- **Server-only notification layer**: `src/api/notification/notificationService.ts` sends a Telegram message for every new subscriber. It reads secrets via `src/lib/env.ts` (`requireEnv`), which throws if a required var is missing - never import this module in client components.
- **API route as the only mutation boundary**: `src/app/api/subscribe/route.ts` validates the email, applies IP-based rate limiting (`src/lib/rateLimiter.ts`, in-memory, 1 request/60s per IP), then delegates to `notificationService`. Clients only ever call this route via `fetch`, never Telegram directly.
- **Theme toggle without hydration mismatch**: `page.tsx` renders with a default theme, then reads `localStorage` in a mount-only effect before applying `data-theme` to `<html>`. Don't remove the `mounted` flag - it exists specifically to avoid SSR/CSR mismatches.
- **No database, no auth**: This project has no persistence layer. Subscriber emails are only ever forwarded to Telegram; nothing is stored.

## Project Structure

```
src/
├── app/
│   ├── api/subscribe/route.ts   # POST endpoint: validate + rate-limit + notify
│   ├── layout.tsx                # Root layout, local fonts, metadata
│   └── page.tsx                  # The entire landing page (hero, theme toggle, form)
├── api/notification/
│   ├── INotificationService.ts   # SubscribePayload + interface
│   └── notificationService.ts    # Telegram Bot API integration
├── icons/                        # Inline SVG icon components (Logo, Sun, Moon, Email, WhatsApp, Instagram)
└── lib/
    ├── env.ts                    # requireEnv() - throws on missing env vars
    └── rateLimiter.ts             # In-memory sliding-window rate limiter
```

## Environments & Deployment

- Deployed to Cloudflare Workers via `@opennextjs/cloudflare`. `wrangler.toml` defines `[env.test]` (`bolecapital-test`) and `[env.production]` (`bolecapital-prod`).
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are Worker secrets, set per environment via `wrangler secret put <NAME> --env <test|production>`. They are runtime-only - never needed at build time, so CI does not inject them.
- CI/CD: `.github/workflows/ci-feature.yml` runs on feature branches and deploys to `test`. `.github/workflows/ci-main.yml` runs on `main`, deploys to `test`, then runs `release-please`; a release triggers `cd-prod` which deploys to `production`.

## Development Commands

```bash
npm run dev       # Start local dev server
npm run build     # Next.js production build
npm run preview   # Build for Cloudflare + wrangler preview (local Workers runtime)
npm run deploy    # Build for Cloudflare + wrangler deploy
npm run lint       # ESLint
```

## Conventions

- Tailwind CSS v4 utility classes for layout; inline `style` is used only for CSS custom properties (`var(--fg)`, `var(--bg)`, font variables) that drive theming - keep that pattern instead of hardcoding colors.
- `"use client"` is required on `page.tsx` since it uses hooks and `localStorage`.
- Use `next/link` for internal navigation, never a bare `<a>` (enforced by `@next/next/no-html-link-for-pages`).
- No test framework is set up yet. If adding tests, prefer Vitest to match the OpenNext/Next.js ecosystem tooling used elsewhere.
