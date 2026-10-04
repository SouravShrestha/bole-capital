import {
  formatRupeesCompact,
  type YearlyPoint,
} from "@/lib/sipCalculator";

export const INVESTED_COLOR = "#F2C94C";
export const RETURNS_COLOR = "#22a352";

type DonutProps = {
  invested: number;
  returns: number;
  returnsPercent: number;
  /** Overrides the default responsive size classes. */
  sizeClassName?: string;
};

/** Donut split of invested vs. returns, with returns % in the centre. */
export function DonutChart({
  invested,
  returns,
  returnsPercent,
  sizeClassName = "w-48 h-48 sm:w-56 sm:h-56",
}: DonutProps) {
  const radius = 70;
  const stroke = 22;
  const circumference = 2 * Math.PI * radius;
  const total = invested + Math.max(returns, 0);
  const investedShare = total > 0 ? invested / total : 1;
  const investedLength = investedShare * circumference;

  return (
    <figure className={`relative shrink-0 ${sizeClassName}`}>
      <svg
        viewBox="0 0 180 180"
        className="w-full h-full -rotate-90"
        role="img"
        aria-label={`Total investment ${formatRupeesCompact(invested)}, returns ${formatRupeesCompact(returns)}`}
      >
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={RETURNS_COLOR}
          strokeWidth={stroke}
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={INVESTED_COLOR}
          strokeWidth={stroke}
          strokeDasharray={`${investedLength} ${circumference}`}
          style={{ transition: "stroke-dasharray 0.4s ease" }}
        />
      </svg>
      <figcaption className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs sm:text-sm opacity-50">Returns</span>
        <span className="text-xl sm:text-2xl font-semibold tabular-nums">
          {returnsPercent.toFixed(1)}%
        </span>
      </figcaption>
    </figure>
  );
}

type BarProps = { yearly: YearlyPoint[] };

/** Stacked yearly bars: invested (bottom) + gains (top). */
export function GrowthBarChart({ yearly }: BarProps) {
  const width = 320;
  const height = 200;
  const padBottom = 20;
  const chartHeight = height - padBottom;
  const max = Math.max(...yearly.map((p) => p.value), 1);
  const gap = yearly.length > 25 ? 1 : 3;
  const barWidth = (width - gap * (yearly.length - 1)) / yearly.length;
  // Label roughly 5 ticks along the x axis.
  const labelEvery = Math.max(1, Math.ceil(yearly.length / 5));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-48 sm:h-56"
      role="img"
      aria-label={`Year-by-year growth over ${yearly.length} years`}
    >
      {yearly.map((p, idx) => {
        const x = idx * (barWidth + gap);
        const totalH = (p.value / max) * chartHeight;
        const investedH = (Math.min(p.invested, p.value) / max) * chartHeight;
        return (
          <g key={p.year}>
            <title>
              {`Year ${p.year}: invested ${formatRupeesCompact(p.invested)}, value ${formatRupeesCompact(p.value)}`}
            </title>
            <rect
              x={x}
              y={chartHeight - totalH}
              width={barWidth}
              height={totalH - investedH}
              fill={RETURNS_COLOR}
              rx={1.5}
            />
            <rect
              x={x}
              y={chartHeight - investedH}
              width={barWidth}
              height={investedH}
              fill={INVESTED_COLOR}
              rx={1.5}
            />
            {(p.year % labelEvery === 0 || idx === 0) && (
              <text
                x={x + barWidth / 2}
                y={height - 4}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                opacity={0.5}
              >
                {p.year}y
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
