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

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

export function checkRateLimit(key: string, { maxRequests, windowMs }: RateLimitOptions): RateLimitResult {
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
