"use client";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import { DownloadOverlay } from "./DownloadOverlay";
import { DownloadIcon } from "@/icons/DownloadIcon";
import { PdfFileIcon } from "@/icons/PdfFileIcon";
import { PngFileIcon } from "@/icons/PngFileIcon";
import type { CalculatorInputs } from "@/lib/sipCalculator";
import type { ExportProgress, ReportFormat } from "@/lib/sipReport";

const FORMATS: {
  value: ReportFormat;
  label: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { value: "pdf", label: "PDF", description: "Export report as PDF", Icon: PdfFileIcon },
  { value: "png", label: "Image", description: "Export report as PNG image", Icon: PngFileIcon },
];

/** Shortest time the download overlay stays visible, so it never just flickers. */
const MIN_OVERLAY_MS = 800;

/** Event-time clock (kept out of the component body for the React Compiler purity lint). */
const timestamp = () => performance.now();

/** Loaded on demand so the canvas renderer and jsPDF stay out of the page bundle. */
const loadReportModule = () => import("@/lib/sipReport");

/** Download buttons that render the current plan into a PDF or PNG report. */
export function ExportReport({ inputs }: { inputs: CalculatorInputs }) {
  const labelId = useId();
  const [busy, setBusy] = useState<{ format: ReportFormat; startedAt: number } | null>(null);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  // Abort an in-flight export if the component unmounts (e.g. route change).
  useEffect(() => () => controllerRef.current?.abort(), []);

  /** Starts fetching the renderer (and jsPDF for PDF) before the click lands. */
  function preload(format: ReportFormat) {
    loadReportModule()
      .then((m) => {
        if (format === "pdf") m.preloadPdfEngine();
      })
      .catch(() => {
        // Ignored; the click handler retries and reports failures.
      });
  }

  async function handleExport(format: ReportFormat) {
    const controller = new AbortController();
    controllerRef.current = controller;
    const { signal } = controller;
    setBusy({ format, startedAt: timestamp() });
    setProgress(null);
    setError(null);
    try {
      const { exportSipReport } = await loadReportModule();
      signal.throwIfAborted();
      await exportSipReport(inputs, format, {
        signal,
        minDurationMs: MIN_OVERLAY_MS,
        onProgress: (p) => {
          if (!signal.aborted) setProgress(p);
        },
      });
    } catch (err) {
      if (signal.aborted) return; // Cancelled by the user; nothing to report.
      console.error("SIP report export failed", err);
      setError("Couldn't create the file. Please try again.");
    } finally {
      // Only clear state owned by this export (a cancel may already have reset it).
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setBusy(null);
        setProgress(null);
      }
    }
  }

  function handleCancel() {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setBusy(null);
    setProgress(null);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col items-center gap-5">
        {/* Label sits level with the icons; captions hang below them. */}
        <span id={labelId} className="mt-1 h-10 flex items-center gap-2 text-sm opacity-70">
          <DownloadIcon />
          Download this report
        </span>
        <div role="group" aria-labelledby={labelId} className="flex gap-4">
          {FORMATS.map(({ value, label, description, Icon }) => {
            const isBusy = busy?.format === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleExport(value)}
                onPointerEnter={() => preload(value)}
                onFocus={() => preload(value)}
                disabled={busy !== null}
                aria-label={description}
                aria-busy={isBusy}
                className="group flex flex-col items-center gap-1 rounded-lg p-1 transition-opacity hover:cursor-pointer disabled:cursor-wait disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22a352]"
                style={{ color: "var(--fg)" }}
              >
                <Icon
                  className={`h-10 w-10 transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 ${
                    isBusy ? "animate-pulse" : ""
                  }`}
                />
                <span className="text-xs font-medium opacity-80">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
      {busy && (
        <DownloadOverlay
          format={busy.format}
          startedAt={busy.startedAt}
          minDurationMs={MIN_OVERLAY_MS}
          progress={progress}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
