/**
 * Client-only renderer that turns a calculator plan into a branded report and
 * exports it as PNG (single tall image) or PDF (paginated A4).
 *
 * The report is drawn directly onto a <canvas> rather than screenshotting the
 * DOM, so the output is identical regardless of theme, viewport or which
 * chart/tab the user currently has open. jsPDF is loaded lazily on demand.
 */
import { SIP_INFO_POINTS } from "@/components/sip-calculator/SipInfo";
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/icons/LogoIcon";
import { SITE_URL } from "@/lib/seo";
import { COMPLIANCE, MARKET_RISK_DISCLAIMER } from "@/lib/compliance";
import {
  calculate,
  formatRupees,
  formatRupeesCompact,
  type CalculatorInputs,
  type CalculatorResult,
} from "@/lib/sipCalculator";

/* ------------------------------------------------------------------ */
/* Layout constants (logical px; A4 at 96dpi)                          */
/* ------------------------------------------------------------------ */

const PAGE_W = 794;
const PAGE_H = 1123;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_H = 48;
/** Device pixels per logical px. 2x keeps text crisp when zoomed/printed. */
const SCALE = 2;

/** PDF pages are embedded as JPEG; high enough that text edges stay clean. */
const JPEG_QUALITY = 0.95;

const EXTEND_OPTIONS = [5, 7, 10] as const;

const COLORS = {
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

const DISCLAIMER = MARKET_RISK_DISCLAIMER;
const DISTRIBUTOR_LINE = `Bole Capital · ${COMPLIANCE.legalName}, AMFI-registered Mutual Fund Distributor (${COMPLIANCE.arn})`;
const SITE_LABEL = `www.${SITE_URL.replace(/^https?:\/\/(www\.)?/, "")}`;

/* ------------------------------------------------------------------ */
/* Drawing helpers                                                     */
/* ------------------------------------------------------------------ */

type Ctx = CanvasRenderingContext2D;

let fontFamily = "Poppins, system-ui, sans-serif";

function font(ctx: Ctx, size: number, weight: 400 | 500 | 600 | 700 = 400) {
  ctx.font = `${weight} ${size}px ${fontFamily}`;
}

function text(
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

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

function card(ctx: Ctx, x: number, y: number, w: number, h: number) {
  roundRect(ctx, x, y, w, h, 14);
  ctx.fillStyle = COLORS.card;
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = COLORS.border;
  ctx.stroke();
}

function hLine(ctx: Ctx, x1: number, x2: number, y: number, color = COLORS.border) {
  ctx.beginPath();
  ctx.moveTo(x1, y + 0.5);
  ctx.lineTo(x2, y + 0.5);
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function swatch(ctx: Ctx, x: number, y: number, color: string) {
  roundRect(ctx, x, y, 10, 10, 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function wrapLines(ctx: Ctx, value: string, maxWidth: number): string[] {
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

/* ------------------------------------------------------------------ */
/* Report model                                                        */
/* ------------------------------------------------------------------ */

/** A vertical slice of the report. Pagination never splits a block. */
interface Block {
  height: number;
  draw: (ctx: Ctx, y: number) => void;
  /** Redrawn at the top of a page when this block starts a new page. */
  repeatHeader?: Block;
}

const yearsLabel = (n: number) => `${n} ${n === 1 ? "year" : "years"}`;

function planSummary(inputs: CalculatorInputs): string {
  const period = `${yearsLabel(inputs.years)} at ${inputs.annualRate}% p.a. expected return`;
  if (inputs.mode === "lumpsum") {
    return `One-time investment of ${formatRupees(inputs.amount)} for ${period}.`;
  }
  const stepUp =
    inputs.annualStepUp > 0
      ? `, stepping up by ${formatRupees(inputs.annualStepUp)} every year`
      : "";
  return `${formatRupees(inputs.amount)} every month for ${period}${stepUp}.`;
}

function buildBlocks(
  inputs: CalculatorInputs,
  result: CalculatorResult,
  generatedOn: Date
): Block[] {
  const isSip = inputs.mode === "sip";
  const x0 = MARGIN;
  const x1 = PAGE_W - MARGIN;
  const blocks: Block[] = [];

  // ---------- Header ----------
  blocks.push({
    height: 72,
    draw(ctx, y) {
      drawLogo(ctx, x0, y, 36);
      text(ctx, "Investment Calculator Report", x1, y + 16, {
        size: 12,
        weight: 600,
        align: "right",
      });
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
  });

  // ---------- Title ----------
  blocks.push({
    height: 76,
    draw(ctx, y) {
      text(ctx, isSip ? "SIP PROJECTION" : "LUMPSUM PROJECTION", x0, y + 12, {
        size: 9,
        weight: 500,
        color: COLORS.muted,
      });
      text(ctx, isSip ? "Your SIP plan" : "Your lumpsum plan", x0, y + 40, {
        size: 24,
        weight: 600,
      });
      text(ctx, planSummary(inputs), x0, y + 62, { size: 11, color: COLORS.muted });
    },
  });

  // ---------- Input stats ----------
  const stats: [string, string][] = [
    [isSip ? "Monthly investment" : "Total investment", formatRupees(inputs.amount)],
    ...(isSip
      ? ([["Annual step-up", inputs.annualStepUp > 0 ? formatRupees(inputs.annualStepUp) : "None"]] as [string, string][])
      : []),
    ["Investment period", yearsLabel(inputs.years)],
    ["Expected return", `${inputs.annualRate}% p.a.`],
  ];
  blocks.push({
    height: 88,
    draw(ctx, y) {
      const gap = 12;
      const w = (CONTENT_W - gap * (stats.length - 1)) / stats.length;
      stats.forEach(([label, value], i) => {
        const x = x0 + i * (w + gap);
        card(ctx, x, y, w, 68);
        text(ctx, label, x + 16, y + 26, { size: 10, color: COLORS.muted });
        text(ctx, value, x + 16, y + 50, { size: 16, weight: 600 });
      });
    },
  });

  // ---------- Results: donut + figures ----------
  blocks.push({
    height: 236,
    draw(ctx, y) {
      card(ctx, x0, y, CONTENT_W, 216);

      // Donut, matching the on-page chart: returns ring with invested arc on top.
      const cx = x0 + 128;
      const cy = y + 108;
      const r = 70;
      const total = result.invested + Math.max(result.returns, 0);
      const share = total > 0 ? result.invested / total : 1;
      ctx.lineWidth = 22;
      ctx.lineCap = "butt";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = COLORS.returns;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + share * Math.PI * 2);
      ctx.strokeStyle = COLORS.invested;
      ctx.stroke();
      text(ctx, "Returns", cx, cy - 4, { size: 9, color: COLORS.muted, align: "center" });
      text(ctx, `${result.returnsPercent.toFixed(1)}%`, cx, cy + 14, {
        size: 15,
        weight: 600,
        align: "center",
      });

      // Figures
      const fx = x0 + 272;
      text(ctx, "Maturity amount", fx, y + 46, { size: 11, color: COLORS.muted });
      text(ctx, formatRupees(result.maturity), fx, y + 82, { size: 30, weight: 600 });
      text(ctx, `(${formatRupeesCompact(result.maturity)})`, fx, y + 102, {
        size: 10,
        color: COLORS.subtle,
      });

      const rows: [string, string, string][] = [
        ["Total investment", formatRupees(result.invested), COLORS.invested],
        ["Estimated returns", formatRupees(result.returns), COLORS.returns],
      ];
      rows.forEach(([label, value, color], i) => {
        const rx = fx + i * 200;
        swatch(ctx, rx, y + 134, color);
        text(ctx, label, rx + 18, y + 143, { size: 10, color: COLORS.muted });
        text(ctx, value, rx, y + 170, { size: 16, weight: 600 });
      });
    },
  });

  // ---------- Growth chart ----------
  blocks.push({
    height: 262,
    draw(ctx, y) {
      card(ctx, x0, y, CONTENT_W, 242);
      text(ctx, "Growth over time", x0 + 24, y + 34, { size: 14, weight: 600 });

      // Legend
      const legend: [string, string][] = [
        ["Invested", COLORS.invested],
        ["Returns", COLORS.returns],
      ];
      let lx = x1 - 24;
      font(ctx, 10);
      for (const [label, color] of [...legend].reverse()) {
        const w = ctx.measureText(label).width;
        lx -= w;
        text(ctx, label, lx, y + 33, { size: 10, color: COLORS.muted });
        swatch(ctx, lx - 16, y + 24, color);
        lx -= 32;
      }

      const yearly = result.yearly;
      const axisW = 64;
      const left = x0 + 24 + axisW;
      const right = x1 - 24;
      const top = y + 58;
      const bottom = y + 206;
      const chartH = bottom - top;
      const max = Math.max(...yearly.map((p) => p.value), 1);

      // Gridlines with compact labels
      for (let i = 0; i <= 4; i++) {
        const gy = bottom - (chartH * i) / 4;
        hLine(ctx, left, right, gy, i === 0 ? COLORS.border : "rgba(14,14,14,0.06)");
        text(ctx, formatRupeesCompact((max * i) / 4), left - 10, gy + 3, {
          size: 8,
          color: COLORS.subtle,
          align: "right",
        });
      }

      const gap = yearly.length > 25 ? 2 : 4;
      const barW = (right - left - gap * (yearly.length - 1)) / yearly.length;
      const labelEvery = Math.max(1, Math.ceil(yearly.length / 8));
      yearly.forEach((p, idx) => {
        const x = left + idx * (barW + gap);
        const totalH = (p.value / max) * chartH;
        const investedH = (Math.min(p.invested, p.value) / max) * chartH;
        ctx.fillStyle = COLORS.returns;
        roundRect(ctx, x, bottom - totalH, barW, totalH - investedH, 1.5);
        ctx.fill();
        ctx.fillStyle = COLORS.invested;
        roundRect(ctx, x, bottom - investedH, barW, investedH, 1.5);
        ctx.fill();
        if (p.year % labelEvery === 0 || idx === 0) {
          text(ctx, `${p.year}y`, x + barW / 2, bottom + 16, {
            size: 8,
            color: COLORS.subtle,
            align: "center",
          });
        }
      });
    },
  });

  // ---------- Tables ----------
  const col = {
    label: x0 + 16,
    invested: x0 + 360,
    returns: x0 + 520,
    value: x1 - 16,
  };

  const tableHeader = (labels: [string, string, string, string]): Block => ({
    height: 32,
    draw(ctx, y) {
      const ty = y + 20;
      const opts = { size: 10, weight: 500 as const, color: COLORS.muted };
      text(ctx, labels[0], col.label, ty, opts);
      text(ctx, labels[1], col.invested, ty, { ...opts, align: "right" });
      text(ctx, labels[2], col.returns, ty, { ...opts, align: "right" });
      text(ctx, labels[3], col.value, ty, { ...opts, align: "right" });
      hLine(ctx, x0, x1, y + 31);
    },
  });

  const tableRow = (
    cells: [string, number, number, number],
    opts: { shaded: boolean; bold?: boolean; header: Block }
  ): Block => ({
    height: 28,
    repeatHeader: opts.header,
    draw(ctx, y) {
      if (opts.shaded) {
        ctx.fillStyle = "rgba(14,14,14,0.025)";
        ctx.fillRect(x0, y, CONTENT_W, 28);
      }
      const ty = y + 18;
      const weight = opts.bold ? 600 : 400;
      text(ctx, cells[0], col.label, ty, { size: 11, weight });
      text(ctx, formatRupees(cells[1]), col.invested, ty, { size: 11, weight, align: "right" });
      text(ctx, formatRupees(cells[2]), col.returns, ty, {
        size: 11,
        weight,
        color: COLORS.returnsText,
        align: "right",
      });
      text(ctx, formatRupees(cells[3]), col.value, ty, { size: 11, weight: 600, align: "right" });
      hLine(ctx, x0, x1, y + 27, "rgba(14,14,14,0.06)");
    },
  });

  const sectionTitle = (title: string, subtitle?: string): Block => ({
    height: subtitle ? 58 : 40,
    draw(ctx, y) {
      text(ctx, title, x0, y + 24, { size: 16, weight: 600 });
      if (subtitle) text(ctx, subtitle, x0, y + 44, { size: 10, color: COLORS.muted });
    },
  });

  /** Groups a title and table header so they never end a page alone. */
  const keepWithNext = (parts: Block[], next: Block): Block => {
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
  };

  // "What if I stay invested longer?"
  const extendHeader = tableHeader(["Period", "Invested", "Growth", "Maturity"]);
  const extendRows = [
    { label: `Your plan (${yearsLabel(inputs.years)})`, r: result, bold: true },
    ...EXTEND_OPTIONS.map((n) => {
      const total = inputs.years + n;
      return {
        label: `+${n} yrs (${yearsLabel(total)})`,
        r: calculate({ ...inputs, years: total }),
        bold: false,
      };
    }),
  ].map(({ label, r, bold }, i) =>
    tableRow([label, r.invested, r.returns, r.maturity], {
      shaded: i % 2 === 1,
      bold,
      header: extendHeader,
    })
  );
  blocks.push(
    keepWithNext(
      [
        { height: 16, draw() {} },
        sectionTitle(
          `What if you ${isSip ? "keep investing" : "stay invested"} longer?`,
          "Same inputs, extended investment period."
        ),
        extendHeader,
      ],
      extendRows[0]
    ),
    ...extendRows.slice(1)
  );

  // Year-by-year breakdown
  const yearlyHeader = tableHeader(["Year", "Invested", "Returns", "Value"]);
  const yearlyRows = result.yearly.map((p, i) =>
    tableRow([String(p.year), p.invested, p.value - p.invested, p.value], {
      shaded: i % 2 === 1,
      header: yearlyHeader,
    })
  );
  blocks.push(
    keepWithNext(
      [{ height: 24, draw() {} }, sectionTitle("Year-by-year breakdown"), yearlyHeader],
      yearlyRows[0]
    ),
    ...yearlyRows.slice(1)
  );

  // ---------- Explainer cards (same copy as the page's SipInfo section) ----------
  const measure = document.createElement("canvas").getContext("2d");
  if (!measure) throw new Error("Canvas 2D context is not available");
  const infoGap = 12;
  const infoPad = 20;
  const infoW = (CONTENT_W - infoGap * (SIP_INFO_POINTS.length - 1)) / SIP_INFO_POINTS.length;
  const infoLineH = 15;
  font(measure, 10);
  const infoBodies = SIP_INFO_POINTS.map((p) => wrapLines(measure, p.body, infoW - infoPad * 2));
  const infoCardH = infoPad + 18 + 14 + Math.max(...infoBodies.map((l) => l.length)) * infoLineH + infoPad - 4;
  blocks.push({
    height: 32 + infoCardH,
    draw(ctx, y) {
      const top = y + 32;
      SIP_INFO_POINTS.forEach((p, i) => {
        const x = x0 + i * (infoW + infoGap);
        card(ctx, x, top, infoW, infoCardH);
        text(ctx, p.title, x + infoPad, top + infoPad + 12, { size: 12, weight: 600 });
        infoBodies[i].forEach((line, li) => {
          text(ctx, line, x + infoPad, top + infoPad + 38 + li * infoLineH, {
            size: 10,
            color: COLORS.muted,
          });
        });
      });
    },
  });

  // ---------- The formula ----------
  blocks.push({
    height: 24 + 236,
    draw(ctx, y) {
      const top = y + 24;
      const pad = 24;
      card(ctx, x0, top, CONTENT_W, 236);
      text(ctx, "The formula", x0 + pad, top + 34, { size: 14, weight: 600 });

      // Hand-drawn underline, same path as the page (viewBox 120x8 → 80x8).
      ctx.save();
      ctx.translate(x0 + pad, top + 40);
      ctx.scale(80 / 120, 1);
      ctx.strokeStyle = COLORS.fg;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.stroke(new Path2D("M2 5 C 20 1, 40 7, 60 4 S 100 2, 118 5"));
      ctx.restore();

      text(ctx, "For a fixed monthly SIP invested at the start of each month:", x0 + pad, top + 70, {
        size: 10,
        color: COLORS.muted,
      });

      // FV = P × [(1 + i)ⁿ − 1] / i × (1 + i), laid out by measuring each piece.
      const size = 16;
      const supSize = 10;
      const gap = 10;
      font(ctx, size, 500);
      const w = (s: string) => ctx.measureText(s).width;
      const numA = "(1 + i)";
      const numB = " − 1";
      font(ctx, supSize, 500);
      const supW = ctx.measureText("n").width;
      font(ctx, size, 500);
      const numW = w(numA) + supW + w(numB) + 12;
      const parts = ["FV", "=", "P", "×"];
      const tail = ["×", "(1 + i)"];
      const total =
        [...parts, ...tail].reduce((s, p) => s + w(p) + gap, 0) + numW;
      const mid = top + 124;
      let cx = x0 + (CONTENT_W - total) / 2;
      const op = { size, weight: 500 as const };
      for (const p of parts) {
        text(ctx, p, cx, mid + 6, op);
        cx += w(p) + gap;
      }
      // Numerator, fraction bar, denominator
      let nx = cx + 6;
      text(ctx, numA, nx, mid - 8, op);
      nx += w(numA);
      text(ctx, "n", nx, mid - 16, { size: supSize, weight: 500 });
      nx += supW;
      text(ctx, numB, nx, mid - 8, op);
      ctx.fillStyle = COLORS.fg;
      ctx.fillRect(cx, mid, numW, 1.5);
      text(ctx, "i", cx + numW / 2, mid + 20, { ...op, align: "center" });
      cx += numW + gap;
      for (const p of tail) {
        text(ctx, p, cx, mid + 6, op);
        cx += w(p) + gap;
      }

      // Legend
      const legend: [string, string, string?][] = [
        ["P", "monthly investment"],
        ["i", "monthly rate = (1 + annual rate)", "1/12"],
        ["n", "number of months"],
      ];
      legend.forEach(([sym, desc, sup], li) => {
        const ly = top + 184 + li * 16;
        const lo = { size: 10, color: COLORS.muted };
        text(ctx, sym, x0 + pad, ly, lo);
        text(ctx, "=", x0 + pad + 14, ly, lo);
        text(ctx, desc, x0 + pad + 28, ly, lo);
        if (sup) {
          font(ctx, 10);
          const dx = ctx.measureText(desc).width;
          text(ctx, sup, x0 + pad + 28 + dx + 1, ly - 5, { size: 7, color: COLORS.muted });
          font(ctx, 7);
          const sx = ctx.measureText(sup).width;
          text(ctx, " − 1", x0 + pad + 28 + dx + 2 + sx, ly, lo);
        }
      });
    },
  });

  // ---------- Notes ----------
  const notes = [
    `This report is illustrative. It assumes a constant ${inputs.annualRate}% annual return, ${
      isSip
        ? "compounded monthly, with each SIP instalment invested at the start of the month"
        : "compounded annually"
    }. Actual returns vary with market conditions and are not guaranteed.`,
    DISCLAIMER,
  ];
  blocks.push({
    // Height is estimated generously; wrapping is measured at draw time.
    height: 32 + notes.length * 36,
    draw(ctx, y) {
      let ny = y + 32;
      font(ctx, 9);
      for (const note of notes) {
        for (const line of wrapLines(ctx, note, CONTENT_W)) {
          text(ctx, line, x0, ny, { size: 9, color: COLORS.muted });
          ny += 14;
        }
        ny += 8;
      }
    },
  });

  return blocks;
}

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
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export type ReportFormat = "pdf" | "png";

function fileName(inputs: CalculatorInputs, ext: ReportFormat, date: Date) {
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
  return `bole-capital-${inputs.mode}-plan-${stamp}.${ext}`;
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
  inputs: CalculatorInputs,
  result: CalculatorResult,
  now: Date,
  signal: AbortSignal | undefined,
  report: Report
): Promise<Blob> {
  report({ stage: "drawing", fraction: 0.2, page: 1, pages: 1 });
  await checkpoint(signal);
  const blocks = buildBlocks(inputs, result, now);
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
  inputs: CalculatorInputs,
  result: CalculatorResult,
  now: Date,
  signal: AbortSignal | undefined,
  report: Report
): Promise<Blob> {
  report({ stage: "engine", fraction: 0.1 });
  const { jsPDF } = await loadPdfEngine();
  await checkpoint(signal);
  const blocks = buildBlocks(inputs, result, now);
  const footerY = PAGE_H - MARGIN + 8 - FOOTER_H / 2;
  const { pages } = paginate(blocks, footerY - 12);

  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait", compress: true });
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();
  const toPt = pdfW / PAGE_W;

  pdf.setProperties({
    title: `${inputs.mode === "sip" ? "SIP" : "Lumpsum"} plan - Bole Capital`,
    subject: "Investment calculator report",
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

/**
 * Renders the plan and triggers a file download in the browser.
 * If cancelled, rejects with the signal's reason (an "AbortError" DOMException)
 * and no file is saved.
 */
export async function exportSipReport(
  inputs: CalculatorInputs,
  format: ReportFormat,
  { signal, onProgress, minDurationMs = 0 }: ExportOptions = {}
) {
  const startedAt = performance.now();
  const now = new Date();
  const name = fileName(inputs, format, now);
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

  const result = calculate(inputs);
  const blob =
    format === "png"
      ? await renderPng(inputs, result, now, signal, report)
      : await renderPdf(inputs, result, now, signal, report);

  report({ stage: "saving", fraction: 1 });
  const remaining = minDurationMs - (performance.now() - startedAt);
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
  await checkpoint(signal);
  downloadBlob(blob, name);
}
