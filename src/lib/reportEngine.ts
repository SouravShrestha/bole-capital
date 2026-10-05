/**
 * Shared, client-only engine for the downloadable calculator reports
 * (src/lib/sipReport.ts, src/lib/goalReport.ts).
 *
 * Reports are drawn directly onto a <canvas> rather than screenshotting the
 * DOM, so the output is identical regardless of theme, viewport or which
 * chart/tab the user currently has open. A report is a list of `Block`s that
 * are stacked into one tall PNG or paginated into A4 PDF pages. jsPDF is
 * loaded lazily on demand.
 */
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/icons/LogoIcon";
import { SITE_URL } from "@/lib/seo";
import { COMPLIANCE } from "@/lib/compliance";

/* ------------------------------------------------------------------ */
/* Layout constants (logical px; A4 at 96dpi)                          */
/* ------------------------------------------------------------------ */

export const PAGE_W = 794;
export const PAGE_H = 1123;
export const MARGIN = 48;
export const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_H = 48;
/** Device pixels per logical px. 2x keeps text crisp when zoomed/printed. */
const SCALE = 2;

/** PDF pages are embedded as JPEG; high enough that text edges stay clean. */
const JPEG_QUALITY = 0.95;

export const COLORS = {
  bg: "#FFFFFF",
  fg: "#0E0E0E",
  muted: "rgba(14, 14, 14, 0.6)",
  subtle: "rgba(14, 14, 14, 0.4)",
  card: "#F5F5F5",
  border: "#DFDFDF",
  invested: "#F2C94C",
  returns: "#22a352",
  /** Darker brand green for text, so it stays readable on white. */
  returnsText: "#1a7f40",
};

const DISTRIBUTOR_LINE = `Bole Capital · ${COMPLIANCE.legalName}, AMFI-registered Mutual Fund Distributor (${COMPLIANCE.arn})`;
const SITE_LABEL = `www.${SITE_URL.replace(/^https?:\/\/(www\.)?/, "")}`;

/* ------------------------------------------------------------------ */
/* Drawing helpers                                                     */
/* ------------------------------------------------------------------ */

export type Ctx = CanvasRenderingContext2D;

let fontFamily = "Poppins, system-ui, sans-serif";

export function font(ctx: Ctx, size: number, weight: 400 | 500 | 600 | 700 = 400) {
  ctx.font = `${weight} ${size}px ${fontFamily}`;
}

export function text(
  ctx: Ctx,
  value: string,
  x: number,
  y: number,
  opts: {
    size?: number;
    weight?: 400 | 500 | 600 | 700;
    color?: string;
    align?: CanvasTextAlign;
  } = {}
) {
  font(ctx, opts.size ?? 12, opts.weight ?? 400);
  ctx.fillStyle = opts.color ?? COLORS.fg;
  ctx.textAlign = opts.align ?? "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(value, x, y);
}

export function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

export function card(ctx: Ctx, x: number, y: number, w: number, h: number) {
  roundRect(ctx, x, y, w, h, 14);
  ctx.fillStyle = COLORS.card;
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = COLORS.border;
  ctx.stroke();
}

export function hLine(ctx: Ctx, x1: number, x2: number, y: number, color = COLORS.border) {
  ctx.beginPath();
  ctx.moveTo(x1, y + 0.5);
  ctx.lineTo(x2, y + 0.5);
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;
  ctx.stroke();
}

export function swatch(ctx: Ctx, x: number, y: number, color: string) {
  roundRect(ctx, x, y, 10, 10, 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export function wrapLines(ctx: Ctx, value: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of value.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawLogo(ctx: Ctx, x: number, y: number, height: number) {
  const s = height / LOGO_VIEWBOX.height;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = COLORS.fg;
  for (const d of LOGO_PATHS) ctx.fill(new Path2D(d));
  ctx.restore();
}

/** Off-screen context for measuring text while laying out blocks. */
export function measureContext(): Ctx {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is not available");
  return ctx;
}

/** Hand-drawn underline used under section titles (page SVG path, viewBox 120x8 → 80x8). */
export function drawUnderline(ctx: Ctx, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(80 / 120, 1);
  ctx.strokeStyle = COLORS.fg;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.stroke(new Path2D("M2 5 C 20 1, 40 7, 60 4 S 100 2, 118 5"));
  ctx.restore();
}

/** Chart legend aligned to the right edge `rightX`. */
export function drawLegendRight(ctx: Ctx, items: [string, string][], rightX: number, y: number) {
  let lx = rightX;
  font(ctx, 10);
  for (const [label, color] of [...items].reverse()) {
    const w = ctx.measureText(label).width;
    lx -= w;
    text(ctx, label, lx, y + 9, { size: 10, color: COLORS.muted });
    swatch(ctx, lx - 16, y, color);
    lx -= 32;
  }
}

/* ------------------------------------------------------------------ */
/* Report model and reusable blocks                                    */
/* ------------------------------------------------------------------ */

/** A vertical slice of the report. Pagination never splits a block. */
export interface Block {
  height: number;
  draw: (ctx: Ctx, y: number) => void;
  /** Redrawn at the top of a page when this block starts a new page. */
  repeatHeader?: Block;
}

export const yearsLabel = (n: number) => `${n} ${n === 1 ? "year" : "years"}`;

export const spacer = (height: number): Block => ({ height, draw() {} });

/** Logo, report name and generation date. */
export function headerBlock(reportName: string, generatedOn: Date): Block {
  const x0 = MARGIN;
  const x1 = PAGE_W - MARGIN;
  return {
    height: 72,
    draw(ctx, y) {
      drawLogo(ctx, x0, y, 36);
      text(ctx, reportName, x1, y + 16, { size: 12, weight: 600, align: "right" });
      const date = generatedOn.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      text(ctx, `Generated on ${date}`, x1, y + 33, {
        size: 10,
        color: COLORS.muted,
        align: "right",
      });
      hLine(ctx, x0, x1, y + 56);
    },
  };
}

/** Small caps eyebrow, large title and a one-line summary. */
export function titleBlock(eyebrow: string, title: string, summary: string): Block {
  return {
    height: 76,
    draw(ctx, y) {
      text(ctx, eyebrow, MARGIN, y + 12, { size: 9, weight: 500, color: COLORS.muted });
      text(ctx, title, MARGIN, y + 40, { size: 24, weight: 600 });
      text(ctx, summary, MARGIN, y + 62, { size: 11, color: COLORS.muted });
    },
  };
}

/** Row(s) of small input cards, at most `perRow` per row. */
export function statsBlock(stats: [string, string][], perRow = 4): Block {
  const gap = 12;
  const cardH = 68;
  const rows = Math.ceil(stats.length / perRow);
  const cols = Math.min(stats.length, perRow);
  const w = (CONTENT_W - gap * (cols - 1)) / cols;
  return {
    height: rows * (cardH + gap) + 8,
    draw(ctx, y) {
      stats.forEach(([label, value], i) => {
        const x = MARGIN + (i % perRow) * (w + gap);
        const cy = y + Math.floor(i / perRow) * (cardH + gap);
        card(ctx, x, cy, w, cardH);
        text(ctx, label, x + 16, cy + 26, { size: 10, color: COLORS.muted });
        text(ctx, value, x + 16, cy + 50, { size: 16, weight: 600 });
      });
    },
  };
}

export function sectionTitle(title: string, subtitle?: string): Block {
  return {
    height: subtitle ? 58 : 40,
    draw(ctx, y) {
      text(ctx, title, MARGIN, y + 24, { size: 16, weight: 600 });
      if (subtitle) text(ctx, subtitle, MARGIN, y + 44, { size: 10, color: COLORS.muted });
    },
  };
}

/** Groups a title and table header so they never end a page alone. */
export function keepWithNext(parts: Block[], next: Block): Block {
  const height = parts.reduce((h, b) => h + b.height, 0);
  return {
    height: height + next.height,
    draw(ctx, y) {
      let cy = y;
      for (const b of parts) {
        b.draw(ctx, cy);
        cy += b.height;
      }
      next.draw(ctx, cy);
    },
  };
}

/** Row of explainer cards, matching the tilted cards on the page. */
export function infoCardsBlock(points: { title: string; body: string }[]): Block {
  const measure = measureContext();
  const gap = 12;
  const pad = 20;
  const w = (CONTENT_W - gap * (points.length - 1)) / points.length;
  const lineH = 15;
  font(measure, 10);
  const bodies = points.map((p) => wrapLines(measure, p.body, w - pad * 2));
  const cardH = pad + 18 + 14 + Math.max(...bodies.map((l) => l.length)) * lineH + pad - 4;
  return {
    height: 32 + cardH,
    draw(ctx, y) {
      const top = y + 32;
      points.forEach((p, i) => {
        const x = MARGIN + i * (w + gap);
        card(ctx, x, top, w, cardH);
        text(ctx, p.title, x + pad, top + pad + 12, { size: 12, weight: 600 });
        bodies[i].forEach((line, li) => {
          text(ctx, line, x + pad, top + pad + 38 + li * lineH, { size: 10, color: COLORS.muted });
        });
      });
    },
  };
}

/** Small-print notes (assumptions, disclaimers). Wrapping is measured at draw time. */
export function notesBlock(notes: string[]): Block {
  return {
    // Height is estimated generously.
    height: 32 + notes.length * 36,
    draw(ctx, y) {
      let ny = y + 32;
      font(ctx, 9);
      for (const note of notes) {
        for (const line of wrapLines(ctx, note, CONTENT_W)) {
          text(ctx, line, MARGIN, ny, { size: 9, color: COLORS.muted });
          ny += 14;
        }
        ny += 8;
      }
    },
  };
}

/* ------------------------------------------------------------------ */
/* Pagination and page chrome                                          */
/* ------------------------------------------------------------------ */

/** Splits blocks into pages; `pageBottom` is the last usable y on a page. */
function paginate(blocks: Block[], pageBottom: number) {
  const pages: { block: Block; y: number }[][] = [[]];
  let y = MARGIN;
  for (const block of blocks) {
    if (y + block.height > pageBottom && pages.at(-1)!.length > 0) {
      pages.push([]);
      y = MARGIN;
      if (block.repeatHeader) {
        pages.at(-1)!.push({ block: block.repeatHeader, y });
        y += block.repeatHeader.height;
      }
    }
    pages.at(-1)!.push({ block, y });
    y += block.height;
  }
  return { pages, endY: y };
}

/**
 * Faint diagonal site watermark, drawn last so cards don't cover it.
 * Tall PNGs get one per A4-height segment so it shows throughout.
 */
function drawWatermark(ctx: Ctx, height: number) {
  const count = Math.max(1, Math.round(height / PAGE_H));
  const segment = height / count;
  // Bottom-left to top-right, along the A4 page diagonal.
  const angle = -Math.atan2(PAGE_H, PAGE_W);
  ctx.save();
  ctx.globalAlpha = 0.06;
  font(ctx, 64, 600);
  ctx.fillStyle = COLORS.fg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < count; i++) {
    ctx.save();
    ctx.translate(PAGE_W / 2, segment * (i + 0.5));
    ctx.rotate(angle);
    ctx.fillText(SITE_LABEL, 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

function drawFooter(ctx: Ctx, y: number, pageLabel?: string) {
  hLine(ctx, MARGIN, PAGE_W - MARGIN, y);
  text(ctx, `${DISTRIBUTOR_LINE} · ${SITE_LABEL}`, MARGIN, y + 22, {
    size: 9,
    color: COLORS.muted,
  });
  if (pageLabel) {
    text(ctx, pageLabel, PAGE_W - MARGIN, y + 22, {
      size: 9,
      color: COLORS.muted,
      align: "right",
    });
  }
}

function createCanvas(height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = PAGE_W * SCALE;
  canvas.height = Math.ceil(height * SCALE);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is not available");
  ctx.scale(SCALE, SCALE);
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, PAGE_W, height);
  return { canvas, ctx };
}

/** Uses the site's Poppins (next/font) and waits for it before drawing. */
async function prepareFonts() {
  const family = getComputedStyle(document.body).getPropertyValue("--font-poppins").trim();
  fontFamily = `${family ? `${family}, ` : ""}Poppins, system-ui, sans-serif`;
  try {
    await Promise.all(
      ([400, 500, 600] as const).map((w) => document.fonts.load(`${w} 16px ${fontFamily}`))
    );
    await document.fonts.ready;
  } catch {
    // Fall back to system fonts; the report still renders.
  }
}

/* ------------------------------------------------------------------ */
/* Export pipeline                                                     */
/* ------------------------------------------------------------------ */

export type ReportFormat = "pdf" | "png";

export type ExportStage = "preparing" | "engine" | "drawing" | "encoding" | "saving";

export interface ExportProgress {
  stage: ExportStage;
  /** Overall progress, 0 to 1. */
  fraction: number;
  /** Current page while drawing (1-based) and total pages. */
  page?: number;
  pages?: number;
  fileName: string;
}

export interface ExportOptions {
  /** Aborting stops the export before the file is saved. */
  signal?: AbortSignal;
  onProgress?: (progress: ExportProgress) => void;
  /**
   * Hold the download until at least this long after starting, so a progress
   * UI doesn't just flash. Cancelling during the wait still prevents the save.
   */
  minDurationMs?: number;
}

export interface ReportDefinition {
  /** File name without date or extension, e.g. "bole-capital-sip-plan". */
  fileStem: string;
  pdfTitle: string;
  pdfSubject: string;
  /** Builds the report blocks. Called after fonts are ready. */
  build: (generatedOn: Date) => Block[];
}

function fileName(stem: string, ext: ReportFormat, date: Date) {
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
  return `${stem}-${stamp}.${ext}`;
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a moment to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Lets the browser paint and handle input (e.g. a Cancel click), then throws
 * if the export was cancelled. Rendering is synchronous canvas work, so
 * cancellation is checked between steps rather than mid-draw.
 */
async function checkpoint(signal?: AbortSignal) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  signal?.throwIfAborted();
}

/** Native, async canvas encoding (runs off the main thread in most browsers). */
async function encodeCanvas(canvas: HTMLCanvasElement, type: string, quality?: number) {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, quality)
  );
  if (!blob) throw new Error(`Could not encode ${type}`);
  return blob;
}

type Report = (p: Omit<ExportProgress, "fileName">) => void;

async function renderPng(
  def: ReportDefinition,
  now: Date,
  signal: AbortSignal | undefined,
  report: Report
): Promise<Blob> {
  report({ stage: "drawing", fraction: 0.2, page: 1, pages: 1 });
  await checkpoint(signal);
  const blocks = def.build(now);
  const { pages, endY } = paginate(blocks, Number.POSITIVE_INFINITY);
  const height = endY + 8 + FOOTER_H;
  const { canvas, ctx } = createCanvas(height);
  for (const { block, y } of pages[0]) block.draw(ctx, y);
  drawFooter(ctx, endY + 8);
  drawWatermark(ctx, height);

  report({ stage: "encoding", fraction: 0.6 });
  await checkpoint(signal);
  return encodeCanvas(canvas, "image/png");
}

async function renderPdf(
  def: ReportDefinition,
  now: Date,
  signal: AbortSignal | undefined,
  report: Report
): Promise<Blob> {
  report({ stage: "engine", fraction: 0.1 });
  const { jsPDF } = await loadPdfEngine();
  await checkpoint(signal);
  const blocks = def.build(now);
  const footerY = PAGE_H - MARGIN + 8 - FOOTER_H / 2;
  const { pages } = paginate(blocks, footerY - 12);

  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait", compress: true });
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();
  const toPt = pdfW / PAGE_W;

  pdf.setProperties({
    title: def.pdfTitle,
    subject: def.pdfSubject,
    author: "Bole Capital",
    creator: SITE_LABEL,
  });

  for (const [i, page] of pages.entries()) {
    report({
      stage: "drawing",
      page: i + 1,
      pages: pages.length,
      fraction: 0.15 + (0.8 * i) / pages.length,
    });
    await checkpoint(signal);
    const { canvas, ctx } = createCanvas(PAGE_H);
    for (const { block, y } of page) block.draw(ctx, y);
    drawFooter(ctx, footerY, `Page ${i + 1} of ${pages.length}`);
    drawWatermark(ctx, PAGE_H);

    if (i > 0) pdf.addPage();
    // JPEG bytes are embedded as-is (DCTDecode). A canvas or PNG would make
    // jsPDF decode and re-deflate every pixel in JS on the main thread,
    // which was ~8x slower in testing.
    const jpeg = await encodeCanvas(canvas, "image/jpeg", JPEG_QUALITY);
    pdf.addImage(new Uint8Array(await jpeg.arrayBuffer()), "JPEG", 0, 0, pdfW, pdfH);
    // Clickable site link over the footer text.
    pdf.link(MARGIN * toPt, (footerY + 8) * toPt, CONTENT_W * 0.75 * toPt, 20 * toPt, {
      url: SITE_URL,
    });
  }

  return pdf.output("blob");
}

let pdfEngine: Promise<typeof import("jspdf")> | null = null;

/** Loads jsPDF once; later calls reuse the same promise. */
function loadPdfEngine() {
  pdfEngine ??= import("jspdf").catch((err) => {
    pdfEngine = null; // Allow a retry after a failed chunk load.
    throw err;
  });
  return pdfEngine;
}

/** Warm up jsPDF ahead of a likely PDF export (e.g. on hover/focus). */
export function preloadPdfEngine() {
  loadPdfEngine().catch(() => {
    // Ignored here; the real export will retry and surface the error.
  });
}

/**
 * Renders a report and triggers a file download in the browser.
 * If cancelled, rejects with the signal's reason (an "AbortError" DOMException)
 * and no file is saved.
 */
export async function exportReport(
  def: ReportDefinition,
  format: ReportFormat,
  { signal, onProgress, minDurationMs = 0 }: ExportOptions = {}
) {
  const startedAt = performance.now();
  const now = new Date();
  const name = fileName(def.fileStem, format, now);
  // Page counts persist across stages so the UI can keep showing "of N".
  let pageInfo: Pick<ExportProgress, "page" | "pages"> = {};
  const report: Report = (p) => {
    if (p.pages) pageInfo = { page: p.page, pages: p.pages };
    onProgress?.({ ...pageInfo, ...p, fileName: name });
  };

  signal?.throwIfAborted();
  report({ stage: "preparing", fraction: 0 });
  await prepareFonts();
  await checkpoint(signal);

  const blob =
    format === "png"
      ? await renderPng(def, now, signal, report)
      : await renderPdf(def, now, signal, report);

  report({ stage: "saving", fraction: 1 });
  const remaining = minDurationMs - (performance.now() - startedAt);
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
  await checkpoint(signal);
  downloadBlob(blob, name);
}
