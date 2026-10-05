// Shared client-side form copy. Keep free of server-only imports.

/** Message for a 429 response, using the server's Retry-After (seconds) when valid. */
export function formatRetryMessage(retryAfter: string | null): string {
  const parsed = Number.parseInt(retryAfter ?? "", 10);
  const seconds = Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
  return `Too many submissions. Please wait ${seconds} second${seconds === 1 ? "" : "s"} before trying again.`;
}
