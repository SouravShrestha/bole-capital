import { INVESTED_COLOR, RETURNS_COLOR } from "@/components/sip-calculator/ResultCharts";
import type { GoalYearPoint } from "@/lib/goalPlanner";
import { formatRupeesCompact } from "@/lib/sipCalculator";

/** Short axis labels: ₹1.2Cr, ₹45L, ₹80K. */
export function axisRupees(value: number): string {
  const trim = (n: number) => String(Number(n.toFixed(1)));
  if (value >= 1e7) return `₹${trim(value / 1e7)}Cr`;
  if (value >= 1e5) return `₹${trim(value / 1e5)}L`;
  if (value >= 1e3) return `₹${trim(value / 1e3)}K`;
  return `₹${Math.round(value)}`;
}

const W = 360;
const H = 220;
const PAD = { left: 46, right: 6, top: 10, bottom: 20 };
const GRID_LINES = 4;

type Props = {
  yearly: GoalYearPoint[];
  /** Legend label for the target line, e.g. "Goal cost". */
  targetLabel: string;
};

/**
 * Year-end SIP balance as stacked bars (invested + returns) with the goal's
 * target drawn as a line; the bars meet the line in the final year.
 */
export function GoalProjectionChart({ yearly, targetLabel }: Props) {
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const bottom = PAD.top + chartH;
  const max = Math.max(...yearly.map((p) => Math.max(p.value, p.target)), 1) * 1.05;
  const y = (v: number) => bottom - (v / max) * chartH;

  const slot = chartW / Math.max(yearly.length, 1);
  const gap = Math.min(4, slot * 0.3);
  const barW = slot - gap;
  const cx = (idx: number) => PAD.left + idx * slot + slot / 2;
  const labelEvery = Math.max(1, Math.ceil(yearly.length / 6));
  const dotR = yearly.length > 20 ? 2 : 3;
  const line = yearly.map((p, i) => `${cx(i)},${y(p.target)}`).join(" ");
  const last = yearly.at(-1);
  const target = targetLabel.toLowerCase();

  return (
    <figure className="flex flex-col gap-3">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={
          last
            ? `Savings grow to ${formatRupeesCompact(last.value)} over ${yearly.length} years, against a ${target} of ${formatRupeesCompact(last.target)}`
            : "Savings projection"
        }
      >
        {/* Gridlines and y-axis labels */}
        {Array.from({ length: GRID_LINES + 1 }, (_, i) => {
          const v = (max / GRID_LINES) * i;
          return (
            <g key={i}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(v)}
                y2={y(v)}
                stroke="currentColor"
                strokeOpacity={i === 0 ? 0.25 : 0.08}
              />
              <text x={PAD.left - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="currentColor" opacity={0.5}>
                {axisRupees(v)}
              </text>
            </g>
          );
        })}

        {/* Stacked bars: invested (bottom) + returns (top) */}
        {yearly.map((p, idx) => {
          const x = cx(idx) - barW / 2;
          const investedH = bottom - y(Math.min(p.invested, p.value));
          const totalH = bottom - y(p.value);
          return (
            <g key={p.year}>
              <title>
                {`Year ${p.year}: invested ${formatRupeesCompact(p.invested)}, value ${formatRupeesCompact(p.value)}, ${target} ${formatRupeesCompact(p.target)}`}
              </title>
              <rect x={x} y={bottom - totalH} width={barW} height={totalH - investedH} fill={RETURNS_COLOR} rx={1.5} />
              <rect x={x} y={bottom - investedH} width={barW} height={investedH} fill={INVESTED_COLOR} rx={1.5} />
              {(p.year % labelEvery === 0 || idx === 0) && (
                <text x={cx(idx)} y={H - 5} textAnchor="middle" fontSize="9" fill="currentColor" opacity={0.5}>
                  {p.year}y
                </text>
              )}
            </g>
          );
        })}

        {/* Target line */}
        <polyline
          points={line}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.8}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        {yearly.map((p, idx) => (
          <circle
            key={p.year}
            cx={cx(idx)}
            cy={y(p.target)}
            r={dotR}
            style={{ fill: "var(--card-back-bg)" }}
            stroke="currentColor"
            strokeWidth={1.25}
          />
        ))}
      </svg>

      <figcaption className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs opacity-70">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: INVESTED_COLOR }} aria-hidden="true" />
          Invested
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: RETURNS_COLOR }} aria-hidden="true" />
          Returns
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true">
            <line x1="0" y1="5" x2="18" y2="5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="9" cy="5" r="3" style={{ fill: "var(--card-back-bg)" }} stroke="currentColor" strokeWidth="1.25" />
          </svg>
          {targetLabel}
        </span>
      </figcaption>
    </figure>
  );
}
