/**
 * Client-only SIP/lumpsum calculator report. Drawing, pagination and the
 * PNG/PDF export pipeline live in src/lib/reportEngine.ts.
 */
import { SIP_INFO_POINTS } from "@/components/sip-calculator/SipInfo";
import { MARKET_RISK_DISCLAIMER } from "@/lib/compliance";
import {
  COLORS,
  CONTENT_W,
  MARGIN,
  PAGE_W,
  card,
  drawLegendRight,
  drawUnderline,
  exportReport,
  font,
  hLine,
  headerBlock,
  infoCardsBlock,
  keepWithNext,
  notesBlock,
  roundRect,
  sectionTitle,
  spacer,
  statsBlock,
  swatch,
  text,
  titleBlock,
  yearsLabel,
  type Block,
  type ExportOptions,
  type ReportFormat,
} from "@/lib/reportEngine";
import {
  calculate,
  formatRupees,
  formatRupeesCompact,
  type CalculatorInputs,
  type CalculatorResult,
} from "@/lib/sipCalculator";

export type { ExportOptions, ExportProgress, ExportStage, ReportFormat } from "@/lib/reportEngine";
export { preloadPdfEngine } from "@/lib/reportEngine";

const EXTEND_OPTIONS = [5, 7, 10] as const;

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

  blocks.push(
    headerBlock("Investment Calculator Report", generatedOn),
    titleBlock(
      isSip ? "SIP PROJECTION" : "LUMPSUM PROJECTION",
      isSip ? "Your SIP plan" : "Your lumpsum plan",
      planSummary(inputs)
    ),
    statsBlock([
      [isSip ? "Monthly investment" : "Total investment", formatRupees(inputs.amount)],
      ...(isSip
        ? ([["Annual step-up", inputs.annualStepUp > 0 ? formatRupees(inputs.annualStepUp) : "None"]] as [string, string][])
        : []),
      ["Investment period", yearsLabel(inputs.years)],
      ["Expected return", `${inputs.annualRate}% p.a.`],
    ])
  );

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
      drawLegendRight(
        ctx,
        [
          ["Invested", COLORS.invested],
          ["Returns", COLORS.returns],
        ],
        x1 - 24,
        y + 24
      );

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
        spacer(16),
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
    keepWithNext([spacer(24), sectionTitle("Year-by-year breakdown"), yearlyHeader], yearlyRows[0]),
    ...yearlyRows.slice(1)
  );

  // ---------- Explainer cards (same copy as the page's SipInfo section) ----------
  blocks.push(infoCardsBlock(SIP_INFO_POINTS));

  // ---------- The formula ----------
  blocks.push({
    height: 24 + 236,
    draw(ctx, y) {
      const top = y + 24;
      const pad = 24;
      card(ctx, x0, top, CONTENT_W, 236);
      text(ctx, "The formula", x0 + pad, top + 34, { size: 14, weight: 600 });
      drawUnderline(ctx, x0 + pad, top + 40);

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
  blocks.push(
    notesBlock([
      `This report is illustrative. It assumes a constant ${inputs.annualRate}% annual return, ${
        isSip
          ? "compounded monthly, with each SIP instalment invested at the start of the month"
          : "compounded annually"
      }. Actual returns vary with market conditions and are not guaranteed.`,
      MARKET_RISK_DISCLAIMER,
    ])
  );

  return blocks;
}

/** Renders the SIP/lumpsum plan and downloads it as PDF or PNG. */
export async function exportSipReport(
  inputs: CalculatorInputs,
  format: ReportFormat,
  options?: ExportOptions
) {
  const result = calculate(inputs);
  await exportReport(
    {
      fileStem: `bole-capital-${inputs.mode}-plan`,
      pdfTitle: `${inputs.mode === "sip" ? "SIP" : "Lumpsum"} plan - Bole Capital`,
      pdfSubject: "Investment calculator report",
      build: (now) => buildBlocks(inputs, result, now),
    },
    format,
    options
  );
}
