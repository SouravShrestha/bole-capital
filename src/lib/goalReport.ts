/**
 * Client-only goal planner report (education, retirement, home, car).
 * Drawing, pagination and the PNG/PDF export pipeline live in
 * src/lib/reportEngine.ts.
 */
import {
  COST_GOAL_CONFIG,
  GOAL_INFO_POINTS,
  GOAL_META,
  GOAL_METHOD_NOTE,
  GOAL_METHOD_STEPS,
  targetLabel,
} from "@/components/goal-planner/goalConfig";
import { MARKET_RISK_DISCLAIMER } from "@/lib/compliance";
import {
  costGoalPath,
  planGoal,
  planRetirement,
  retirementPath,
  type GoalPlan,
  type GoalRequest,
  type GoalYearPoint,
} from "@/lib/goalPlanner";
import {
  COLORS,
  CONTENT_W,
  MARGIN,
  PAGE_W,
  card,
  drawUnderline,
  exportReport,
  font,
  hLine,
  headerBlock,
  infoCardsBlock,
  keepWithNext,
  measureContext,
  notesBlock,
  roundRect,
  sectionTitle,
  spacer,
  statsBlock,
  swatch,
  text,
  titleBlock,
  wrapLines,
  yearsLabel,
  type Block,
  type Ctx,
  type ExportOptions,
  type ReportFormat,
} from "@/lib/reportEngine";
import { formatRupees, formatRupeesCompact } from "@/lib/sipCalculator";

const x0 = MARGIN;
const x1 = PAGE_W - MARGIN;

/** Everything the report needs, derived from the request with the same maths as the page. */
interface GoalSummary {
  title: string;
  noun: string;
  stats: [string, string][];
  plan: GoalPlan;
  years: number;
  annualRate: number;
  headlineLabel: string;
  headlineNote: string;
  yearly: GoalYearPoint[];
  assumption: string;
}

function summarise(req: GoalRequest): GoalSummary {
  if (req.goal === "retirement") {
    const i = req.inputs;
    const plan = planRetirement(i);
    return {
      title: "Your retirement plan",
      noun: "retirement",
      stats: [
        ["Current age", `${i.currentAge} yrs`],
        ["Retire at", `${i.retirementAge} yrs`],
        ["Income until age", `${i.lifeExpectancy} yrs`],
        ["Monthly expenses today", formatRupees(i.monthlyExpenses)],
        ["Expected inflation", `${i.inflationRate}% p.a.`],
        ["Return until retirement", `${i.annualRate}% p.a.`],
        ["Return after retirement", `${i.postRetirementRate}% p.a.`],
      ],
      plan,
      years: plan.yearsToRetire,
      annualRate: i.annualRate,
      headlineLabel: `Corpus needed at age ${i.retirementAge}`,
      headlineNote: `Covers ${formatRupeesCompact(plan.monthlyExpensesAtRetirement)}/month at retirement (${formatRupeesCompact(i.monthlyExpenses)} today), rising with inflation for ${yearsLabel(plan.retirementYears)}.`,
      yearly: retirementPath(i, plan),
      assumption: `The corpus pays for expenses that rise ${i.inflationRate}% a year from age ${i.retirementAge} to ${i.lifeExpectancy}, withdrawn at the start of each year, while the balance earns ${i.postRetirementRate}% a year.`,
    };
  }

  const i = req.inputs;
  const config = COST_GOAL_CONFIG[req.goal];
  const plan = planGoal(i);
  const noun = config.noun;
  return {
    title: `Your ${noun} plan`,
    noun,
    stats: [
      ["Years to goal", yearsLabel(i.years)],
      ["Cost today", formatRupees(i.currentCost)],
      ["Expected inflation", `${i.inflationRate}% p.a.`],
      ["Expected return", `${i.annualRate}% p.a.`],
    ],
    plan,
    years: i.years,
    annualRate: i.annualRate,
    headlineLabel: `${noun.charAt(0).toUpperCase()}${noun.slice(1)} cost after ${yearsLabel(i.years)}`,
    headlineNote: `${formatRupeesCompact(i.currentCost)} today, at ${i.inflationRate}% inflation a year.`,
    yearly: costGoalPath(i, plan),
    assumption: `Today's cost of ${formatRupees(i.currentCost)} is grown by ${i.inflationRate}% a year to estimate the cost in ${yearsLabel(i.years)}.`,
  };
}

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

function resultsBlock(s: GoalSummary): Block {
  const h = 200;
  return {
    height: h + 20,
    draw(ctx, y) {
      card(ctx, x0, y, CONTENT_W, h);
      const pad = 24;
      text(ctx, s.headlineLabel, x0 + pad, y + 40, { size: 11, color: COLORS.muted });
      text(ctx, formatRupees(s.plan.futureCost), x0 + pad, y + 76, { size: 30, weight: 600 });
      text(ctx, `(${formatRupeesCompact(s.plan.futureCost)})  ${s.headlineNote}`, x0 + pad, y + 96, {
        size: 10,
        color: COLORS.subtle,
      });

      hLine(ctx, x0 + pad, x1 - pad, y + 116);
      const colW = (CONTENT_W - pad * 2) / 2;
      const options: [string, string, string][] = [
        [
          "Planning through SIP",
          `${formatRupees(s.plan.monthlySip)}/month`,
          `Total invested ${formatRupeesCompact(s.plan.sipInvested)} over ${yearsLabel(s.years)}`,
        ],
        ["Planning through lumpsum", formatRupees(s.plan.lumpsum), "One-time investment today"],
      ];
      options.forEach(([label, value, note], i) => {
        const cx = x0 + pad + i * colW;
        text(ctx, label, cx, y + 142, { size: 10, color: COLORS.muted });
        text(ctx, value, cx, y + 168, { size: 18, weight: 600, color: COLORS.returnsText });
        text(ctx, note, cx, y + 186, { size: 9, color: COLORS.subtle });
      });
    },
  };
}

function legendItem(ctx: Ctx, x: number, y: number, label: string, kind: "swatch" | "line", color: string) {
  if (kind === "swatch") {
    swatch(ctx, x, y, color);
  } else {
    ctx.beginPath();
    ctx.moveTo(x - 2, y + 5);
    ctx.lineTo(x + 14, y + 5);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 6, y + 5, 3, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.card;
    ctx.fill();
    ctx.lineWidth = 1.25;
    ctx.stroke();
  }
  text(ctx, label, x + 18, y + 9, { size: 10, color: COLORS.muted });
  font(ctx, 10);
  return x + 18 + ctx.measureText(label).width + 20;
}

function chartBlock(s: GoalSummary, lineLabel: string): Block {
  const h = 290;
  return {
    height: h + 20,
    draw(ctx, y) {
      card(ctx, x0, y, CONTENT_W, h);
      text(ctx, "How your SIP grows towards the goal", x0 + 24, y + 34, { size: 14, weight: 600 });

      let lx = x0 + 24;
      lx = legendItem(ctx, lx, y + 48, "Invested", "swatch", COLORS.invested);
      lx = legendItem(ctx, lx, y + 48, "Returns", "swatch", COLORS.returns);
      legendItem(ctx, lx, y + 48, lineLabel, "line", COLORS.fg);

      const yearly = s.yearly;
      const left = x0 + 24 + 64;
      const right = x1 - 24;
      const top = y + 78;
      const bottom = y + h - 34;
      const chartH = bottom - top;
      const max = Math.max(...yearly.map((p) => Math.max(p.value, p.target)), 1) * 1.05;
      const py = (v: number) => bottom - (v / max) * chartH;

      for (let i = 0; i <= 4; i++) {
        const gy = bottom - (chartH * i) / 4;
        hLine(ctx, left, right, gy, i === 0 ? COLORS.border : "rgba(14,14,14,0.06)");
        text(ctx, formatRupeesCompact((max * i) / 4), left - 10, gy + 3, {
          size: 8,
          color: COLORS.subtle,
          align: "right",
        });
      }

      const slot = (right - left) / Math.max(yearly.length, 1);
      const gap = Math.min(6, slot * 0.3);
      const barW = slot - gap;
      const cx = (idx: number) => left + idx * slot + slot / 2;
      const labelEvery = Math.max(1, Math.ceil(yearly.length / 10));

      yearly.forEach((p, idx) => {
        const x = cx(idx) - barW / 2;
        const totalH = bottom - py(p.value);
        const investedH = bottom - py(Math.min(p.invested, p.value));
        ctx.fillStyle = COLORS.returns;
        roundRect(ctx, x, bottom - totalH, barW, totalH - investedH, 1.5);
        ctx.fill();
        ctx.fillStyle = COLORS.invested;
        roundRect(ctx, x, bottom - investedH, barW, investedH, 1.5);
        ctx.fill();
        if (p.year % labelEvery === 0 || idx === 0) {
          text(ctx, `${p.year}y`, cx(idx), bottom + 16, { size: 8, color: COLORS.subtle, align: "center" });
        }
      });

      // Target line with dots
      ctx.beginPath();
      yearly.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(cx(idx), py(p.target));
        else ctx.lineTo(cx(idx), py(p.target));
      });
      ctx.strokeStyle = COLORS.fg;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.stroke();
      const r = yearly.length > 20 ? 2 : 3;
      yearly.forEach((p, idx) => {
        ctx.beginPath();
        ctx.arc(cx(idx), py(p.target), r, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.card;
        ctx.fill();
        ctx.lineWidth = 1.25;
        ctx.stroke();
      });
    },
  };
}

function yearlyTable(s: GoalSummary, lineLabel: string): Block[] {
  const col = { year: x0 + 16, invested: x0 + 330, value: x0 + 500, target: x1 - 16 };
  const header: Block = {
    height: 32,
    draw(ctx, y) {
      const ty = y + 20;
      const o = { size: 10, weight: 500 as const, color: COLORS.muted };
      text(ctx, "Year", col.year, ty, o);
      text(ctx, "Invested", col.invested, ty, { ...o, align: "right" });
      text(ctx, "Savings value", col.value, ty, { ...o, align: "right" });
      text(ctx, lineLabel, col.target, ty, { ...o, align: "right" });
      hLine(ctx, x0, x1, y + 31);
    },
  };
  const rows: Block[] = s.yearly.map((p, i) => ({
    height: 28,
    repeatHeader: header,
    draw(ctx, y) {
      if (i % 2 === 1) {
        ctx.fillStyle = "rgba(14,14,14,0.025)";
        ctx.fillRect(x0, y, CONTENT_W, 28);
      }
      const ty = y + 18;
      text(ctx, String(p.year), col.year, ty, { size: 11 });
      text(ctx, formatRupees(p.invested), col.invested, ty, { size: 11, align: "right" });
      text(ctx, formatRupees(p.value), col.value, ty, {
        size: 11,
        color: COLORS.returnsText,
        align: "right",
      });
      text(ctx, formatRupees(p.target), col.target, ty, { size: 11, weight: 600, align: "right" });
      hLine(ctx, x0, x1, y + 27, "rgba(14,14,14,0.06)");
    },
  }));
  return [
    keepWithNext([spacer(16), sectionTitle("Year-by-year breakdown"), header], rows[0]),
    ...rows.slice(1),
  ];
}

function methodBlock(): Block {
  const measure = measureContext();
  const pad = 24;
  const labelW = 150;
  const formulaW = CONTENT_W - pad * 2 - labelW;
  const lineH = 15;
  font(measure, 10);
  const formulas = GOAL_METHOD_STEPS.map((s) => wrapLines(measure, s.formula, formulaW));
  const note = wrapLines(measure, GOAL_METHOD_NOTE, CONTENT_W - pad * 2);
  const stepsH = formulas.reduce((h, l) => h + l.length * lineH + 10, 0);
  const h = 70 + stepsH + 10 + note.length * lineH + pad;
  return {
    height: 24 + h,
    draw(ctx, y) {
      const top = y + 24;
      card(ctx, x0, top, CONTENT_W, h);
      text(ctx, "How we work it out", x0 + pad, top + 34, { size: 14, weight: 600 });
      drawUnderline(ctx, x0 + pad, top + 40);
      let ry = top + 74;
      GOAL_METHOD_STEPS.forEach((s, i) => {
        text(ctx, s.label, x0 + pad, ry, { size: 10, weight: 600 });
        formulas[i].forEach((line, li) => {
          text(ctx, line, x0 + pad + labelW, ry + li * lineH, { size: 10, color: COLORS.muted });
        });
        ry += formulas[i].length * lineH + 10;
      });
      ry += 10;
      note.forEach((line, li) => {
        text(ctx, line, x0 + pad, ry + li * lineH, { size: 10, color: COLORS.muted });
      });
    },
  };
}

function buildBlocks(req: GoalRequest, generatedOn: Date): Block[] {
  const s = summarise(req);
  const meta = GOAL_META[req.goal];
  const lineLabel = targetLabel(req.goal);
  return [
    headerBlock("Goal Planner Report", generatedOn),
    titleBlock(`${meta.title.toUpperCase()} PLAN`, s.title, meta.tagline),
    statsBlock(s.stats),
    resultsBlock(s),
    chartBlock(s, lineLabel),
    ...yearlyTable(s, lineLabel),
    infoCardsBlock(GOAL_INFO_POINTS),
    methodBlock(),
    notesBlock([
      `This report is illustrative. ${s.assumption} It assumes a constant ${s.annualRate}% annual return, compounded monthly, with each SIP instalment invested at the start of the month. Actual costs and returns vary and are not guaranteed.`,
      MARKET_RISK_DISCLAIMER,
    ]),
  ];
}

/** Renders the goal plan and downloads it as PDF or PNG. */
export async function exportGoalReport(req: GoalRequest, format: ReportFormat, options?: ExportOptions) {
  const meta = GOAL_META[req.goal];
  await exportReport(
    {
      fileStem: `bole-capital-${req.goal}-goal-plan`,
      pdfTitle: `${meta.title} plan - Bole Capital`,
      pdfSubject: "Goal planner report",
      build: (now) => buildBlocks(req, now),
    },
    format,
    options
  );
}
