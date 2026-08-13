interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

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
