import { execSync } from "node:child_process";

/**
 * Build-time only (imported by next.config.ts, never by app code).
 * Returns the last git commit date as an ISO string, falling back to "now"
 * when git is unavailable (e.g. a source tarball without .git).
 */
export function resolveLastUpdated(
  exec: (cmd: string) => string = (cmd) =>
    execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }),
  now: () => Date = () => new Date()
): string {
  try {
    const date = new Date(exec("git log -1 --format=%cI").trim());
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  } catch {
    // fall through to the build date
  }
  return now().toISOString();
}
