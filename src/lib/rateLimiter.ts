import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Two layers:
 * - Production/test Workers: the Workers Rate Limiting binding (RATE_LIMITER
 *   in wrangler.toml), shared by every isolate in a Cloudflare location.
 * - Fallback (next dev, unit tests, or if the binding is missing/errors):
 *   an in-memory sliding window, which is per-isolate and best-effort only.
 *
 * The binding's limit and period live in wrangler.toml; keep them in sync with
 * the `RATE_LIMIT` options the routes pass in (used by the fallback).
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Cap memory: evict expired keys periodically, and hard-cap total keys.
const MAX_KEYS = 10_000;
const SWEEP_INTERVAL_MS = 60_000;
let lastSweep = 0;

function sweep(now: number, windowMs: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS && store.size < MAX_KEYS) return;
  lastSweep = now;
  for (const [key, entry] of store) {
    if (!entry.timestamps.some((t) => t > now - windowMs)) store.delete(key);
  }
  // Still over the cap (flood of unique IPs): drop oldest-inserted keys.
  for (const key of store.keys()) {
    if (store.size < MAX_KEYS) break;
    store.delete(key);
  }
}

export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

/** Minimal shape of the Workers Rate Limiting binding. */
export interface RateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export function checkMemoryRateLimit(
  key: string,
  { maxRequests, windowMs }: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;
  sweep(now, windowMs);

  const entry = store.get(key) ?? { timestamps: [] };

  // Drop timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  if (entry.timestamps.length >= maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfterMs = oldestInWindow + windowMs - now;
    store.set(key, entry);
    return { allowed: false, retryAfterMs };
  }

  entry.timestamps.push(now);
  store.set(key, entry);
  return { allowed: true, retryAfterMs: 0 };
}

function getBinding(): RateLimitBinding | undefined {
  try {
    const { env } = getCloudflareContext();
    const binding = (env as { RATE_LIMITER?: RateLimitBinding }).RATE_LIMITER;
    return typeof binding?.limit === "function" ? binding : undefined;
  } catch {
    // Not running inside a Workers request (dev server without bindings, tests).
    return undefined;
  }
}

export async function checkRateLimit(
  key: string,
  options: RateLimitOptions,
  binding: RateLimitBinding | undefined = getBinding()
): Promise<RateLimitResult> {
  if (binding) {
    try {
      const { success } = await binding.limit({ key });
      // The binding doesn't report time remaining; the full window is a safe upper bound.
      return success ? { allowed: true, retryAfterMs: 0 } : { allowed: false, retryAfterMs: options.windowMs };
    } catch (err) {
      console.error("Rate limit binding failed, using in-memory fallback:", err);
    }
  }
  return checkMemoryRateLimit(key, options);
}
