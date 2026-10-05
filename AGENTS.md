<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` - verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Bole Capital - Agent Notes

Marketing site for Bole Capital, an AMFI-registered mutual fund distributor in Dhanbad. Built on **Next.js 16 App Router**, deployed to **Cloudflare Workers** via OpenNext. All pages are statically prerendered; the only server code is two form API routes.

## Key Architecture Decisions

- **Multi-page static site**: home, about, services (+ per-service aliases), contact, resources (SIP calculator), FAQ, glossary, sitemap, and policy pages (privacy, commission disclosures, grievance redressal, terms of use). Keep pages static: anything that forces per-request rendering (nonce CSP, `headers()`/`cookies()` in pages) is a regression.
- **Two mutation boundaries, both to Telegram**:
  - `POST /api/portfolio-review` - the site-wide "Book My Portfolio Review" CTA (`src/components/cta/CtaSection.tsx`, rendered on every page except /contact via `CtaGate`). Requires name, phone; email optional.
  - `POST /api/contact` - the /contact form. Requires name, phone, message; email optional.
  - Both run: `assertSameOrigin` -> `checkRateLimit` -> `readJsonBody` (JSON only, 4KB cap) -> honeypot (`isBot`, fake 200) -> field validation (`src/lib/formSecurity.ts`) -> `notificationService`. Clients only call these routes via `fetch`, never Telegram directly.
- **Server-only notification layer**: `src/api/notification/notificationService.ts` reads secrets via `src/lib/env.ts` (`requireEnv`, throws if missing). Never import it from client components.
- **Rate limiting** (`src/lib/rateLimiter.ts`): `checkRateLimit` is async. On Workers it uses the `RATE_LIMITER` Workers Rate Limiting binding (1 request/key/60s, per Cloudflare location); without the binding (next dev, tests) or if it errors, it falls back to an in-memory per-isolate sliding window. Keys are `<route>:<cf-connecting-ip>`.
- **Compliance constants** (`src/lib/compliance.ts`): single source for ARN, legal name, EUIN, ARN validity, the AMFI risk disclaimer, distributor statement, testimonial disclaimer and regulator links (SCORES, SmartODR, AMFI ARN lookup, Investor Charter). Never hardcode the ARN elsewhere. `euin` and `arnValidTill` are `null` (TODO) and are hidden until filled; `formatCompliance()` handles that.
- **Service alias pages**: `/services/<slug>` (`src/app/services/[slug]/page.tsx`) renders the exact same `ServicesHero` + `ServicesList` as `/services`, with per-service metadata, hero intro, `Service` + `BreadcrumbList` JSON-LD, and `ScrollToSection` to land on the matching section. Slugs and SEO copy live in `src/lib/servicesSeo.ts` and must match section ids in `src/components/services/servicesData.ts` (the build throws if they drift). `ScrollToTop` skips alias paths. Do **not** add `dynamicParams = false` here: on OpenNext/Workers it causes `NoFallbackError` 404s.
- **SEO**: `pageMetadata()` in `src/lib/seo.ts` builds canonical/OG/Twitter tags and explicitly includes the shared `/opengraph-image` (child `openGraph` objects replace the layout's, dropping file-based images). `sitemap.xml`, the footer and the /sitemap page all derive from `src/lib/siteLinks.ts`. `SITE_URL` comes from the `SITE_URL` build env var (inlined by `next.config.ts`, defaults to `https://bolecapital.in`); CI test builds set `https://test.bolecapital.in` so canonical/OG/sitemap point at the test host, and non-prod builds emit `noindex`. Use `PRODUCTION_SITE_URL` where the brand URL must stay fixed (e.g. SIP reports).
- **"Last updated" date**: `next.config.ts` calls `resolveLastUpdated()` (`src/lib/lastUpdated.ts`, last git commit date, falls back to build date) and inlines it as `process.env.SITE_LAST_UPDATED`. Used by the footer and sitemap `<lastmod>`. `lastUpdated.ts` uses `child_process`, so only import it from `next.config.ts`.
- **Security headers**: set for all routes in `next.config.ts` `headers()` (CSP, HSTS, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy). CSP allows `'unsafe-inline'` scripts to keep pages static. If you add third-party scripts, images, fonts or `fetch` targets, update the CSP.
- **Theme without hydration mismatch**: `src/components/providers/ThemeProvider.tsx` renders with the default (`data-theme="dark"` on `<html>`), then reads `localStorage` in a mount-only effect. Keep that read out of render to avoid SSR/CSR mismatches.
- **No database, no auth**: submissions are only forwarded to Telegram; nothing is stored.

## Project Structure

```
src/
├── app/
│   ├── api/portfolio-review/route.ts  # CTA form -> Telegram
│   ├── api/contact/route.ts           # Contact form -> Telegram
│   ├── services/[slug]/page.tsx        # Service alias pages (same design as /services)
│   ├── grievance-redressal/, terms-of-use/, privacy-policy/, commission-disclosures/
│   ├── opengraph-image.tsx, manifest.ts, sitemap.ts, robots.ts
│   ├── layout.tsx                      # Fonts, metadata, org JSON-LD, skip link, navbar/footer
│   └── page.tsx                        # Home
├── api/notification/                   # Telegram Bot API integration (server-only)
├── components/                         # Feature folders (hero, services, cta, footer, legal, ...)
├── data/                               # JSON content (faqs, glossary, testimonials, commissions)
├── icons/                              # Inline SVG icon components
└── lib/
    ├── compliance.ts                   # ARN/EUIN/disclaimers/regulator links
    ├── formSecurity.ts, formLimits.ts, formMessages.ts
    ├── rateLimiter.ts                  # Workers binding + in-memory fallback
    ├── seo.ts, siteLinks.ts, servicesSeo.ts, servicesJsonLd.ts
    ├── lastUpdated.ts                  # Build-time only (next.config.ts)
    └── sipCalculator.ts, sipReport.ts  # SIP calculator math + PNG/PDF export
```

## Environments & Deployment

- `wrangler.toml` defines `[env.test]` (`bolecapital-test`) and `[env.production]` (`bolecapital-prod`). Bindings are **not** inherited by `[env.*]`, so each env declares its own `[[env.<name>.ratelimits]]` `RATE_LIMITER` (namespace ids 1001 test / 1002 prod; period must be 10 or 60).
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are Worker secrets, set via `wrangler secret put <NAME> --env <test|production>`. They're read at runtime only.
- CI/CD: `.github/workflows/ci-feature.yml` (feature branches -> test) and `ci-main.yml` (main -> test, then `release-please`; a release triggers `cd-prod` -> production). Each job runs `npm ci`, lint, tests, `next build`, `npx opennextjs-cloudflare build` (pinned local devDependency), then deploys.

## Development Commands

```bash
npm run dev       # Local dev server (rate limiter uses in-memory fallback)
npm run build     # Next.js production build
npm test          # Vitest (single run)
npm run lint      # ESLint
npm run preview   # OpenNext build + wrangler preview (local Workers runtime)
npm run deploy    # OpenNext build + wrangler deploy
npx wrangler dev --env test   # After an OpenNext build: local Workers runtime with the RATE_LIMITER binding
```

## Conventions

- Tailwind CSS v4 utility classes for layout; inline `style` only for CSS custom properties (`var(--fg)`, `var(--bg)`, font variables) that drive theming.
- Use `next/link` for internal navigation, never a bare `<a>` (enforced by `@next/next/no-html-link-for-pages`). External links: `target="_blank" rel="noopener noreferrer"` plus an sr-only "(opens in a new tab)".
- Every page renders exactly one `<main id="main-content">` (target of the layout's skip link).
- Form inputs need an accessible name (visible or `sr-only` label), `autocomplete`, and status messages in an always-mounted `role="status"` region.
- Pin dependency versions exactly. Note: `npm install <pkg>` currently hits an npm 10 arborist bug with Vitest's optional peers; use `--legacy-peer-deps` for installs and confirm `npm ci` still succeeds.
- Tests: Vitest, `src/**/*.test.ts`, node environment, `@/` alias in `vitest.config.mts`. Mock `@opennextjs/cloudflare` and `@/lib/env` where needed (see `route.test.ts`). Keep logic in pure modules under `src/lib` so it stays testable (Vitest can't import `.png` assets used by components).
- `src/components/whatsapp/WhatsappFab` is intentionally commented out in `src/app/page.tsx`.
