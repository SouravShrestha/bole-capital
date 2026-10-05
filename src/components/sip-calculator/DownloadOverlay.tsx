"use client";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ExportProgress, ReportFormat } from "@/lib/reportEngine";

type Props = {
  format: ReportFormat;
  /** performance.now() when the export started. */
  startedAt: number;
  /** The export holds the download at least this long; factored into the ETA. */
  minDurationMs: number;
  progress: ExportProgress | null;
  onCancel: () => void;
};

const TITLES: Record<ReportFormat, string> = {
  pdf: "Preparing your PDF report",
  png: "Preparing your report image",
};

/** Typical durations, shown until there's enough progress to measure. */
const TYPICAL: Record<ReportFormat, string> = {
  pdf: "This usually takes 1 to 3 seconds.",
  png: "This usually takes about a second.",
};

function stageLabel(format: ReportFormat, p: ExportProgress | null): string {
  switch (p?.stage) {
    case "engine":
      return "Loading the PDF tools";
    case "drawing":
      return format === "pdf" && p.pages
        ? `Drawing page ${p.page} of ${p.pages}`
        : "Drawing your report";
    case "encoding":
      return "Compressing the image";
    case "saving":
      return "Starting your download";
    default:
      return "Getting things ready";
  }
}

function etaLabel(
  format: ReportFormat,
  p: ExportProgress | null,
  elapsed: number,
  minDurationMs: number
): string {
  if (p?.stage === "saving") return "Almost done.";
  const fraction = p?.fraction ?? 0;
  // Too early to extrapolate reliably.
  if (fraction < 0.15 || elapsed < 250) return TYPICAL[format];
  const remaining = Math.max(
    (elapsed * (1 - fraction)) / fraction,
    minDurationMs - elapsed
  );
  if (remaining < 1000) return "Less than a second left.";
  const seconds = Math.ceil(remaining / 1000);
  return `About ${seconds} ${seconds === 1 ? "second" : "seconds"} left.`;
}

/**
 * Full-screen blocking overlay shown while a report is being generated.
 * Rendered in a portal on <body> so ancestor transforms can't break `fixed`.
 */
export function DownloadOverlay({ format, startedAt, minDurationMs, progress, onCancel }: Props) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  // Keep the latest handler without re-running the effect on every render.
  const onCancelRef = useRef(onCancel);
  useEffect(() => {
    onCancelRef.current = onCancel;
  });

  // Re-render a few times a second so the ETA and bar keep moving.
  const [now, setNow] = useState(startedAt);
  useEffect(() => {
    const id = window.setInterval(() => setNow(performance.now()), 200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancelRef.current();
      } else if (e.key === "Tab") {
        // Cancel is the only control; keep focus inside the dialog.
        e.preventDefault();
        cancelRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const elapsed = Math.max(0, now - startedAt);
  // The file is ready before the minimum hold ends; pace the bar to the hold
  // so it doesn't sit at 100% while waiting.
  const fraction = Math.min(progress?.fraction ?? 0, minDurationMs > 0 ? elapsed / minDurationMs : 1);
  const percent = Math.round(Math.max(0.04, fraction) * 100);
  const stage = stageLabel(format, progress);
  const pages = format === "pdf" && progress?.pages ? progress.pages : null;

  return createPortal(
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed inset-0 z-[100] flex items-center justify-center px-6 backdrop-blur-sm"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg) 88%, transparent)",
        color: "var(--fg)",
        fontFamily: "var(--font-poppins)",
      }}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div className="download-loader" aria-hidden="true" />

        <div className="flex flex-col gap-2">
          <h2 id={titleId} className="text-lg sm:text-xl font-medium">
            {TITLES[format]}
          </h2>
          <p id={descId} className="text-sm opacity-80">
            Downloading, please don&apos;t switch or close this tab.
          </p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <div
            role="progressbar"
            aria-label="Report progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-valuetext={`${percent}%, ${stage}`}
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--card-border)" }}
          >
            <div
              className="h-full rounded-full bg-[#22a352] transition-[width] duration-200 ease-out motion-reduce:transition-none"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between gap-4 text-xs tabular-nums">
            {/* Stage changes are announced; the ticking ETA is not, to avoid chatter. */}
            <span aria-live="polite" className="opacity-80">
              {stage}
            </span>
            <span className="opacity-60">{etaLabel(format, progress, elapsed, minDurationMs)}</span>
          </div>
        </div>

        <ul className="w-full flex flex-col gap-1.5 rounded-xl border px-4 py-3 text-left text-xs leading-relaxed opacity-70"
          style={{ borderColor: "var(--card-border)" }}
        >
          <li>
            Browsers slow down background tabs, so switching away can stall the download.
          </li>
          <li>Your report is created on this device. Nothing is uploaded.</li>
          {progress?.fileName && (
            <li className="break-all">
              Saving as <span className="font-medium">{progress.fileName}</span>
              {pages ? ` (${pages} ${pages === 1 ? "page" : "pages"})` : ""}
            </li>
          )}
        </ul>

        <button
          ref={cancelRef}
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-80 hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22a352]"
          style={{ borderColor: "var(--card-border)", color: "var(--fg)" }}
        >
          Cancel download
        </button>
      </div>
    </div>,
    document.body
  );
}
