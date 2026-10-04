"use client";
import { useState } from "react";
import { formatRupees, type YearlyPoint } from "@/lib/sipCalculator";

const COLLAPSED_ROWS = 5;

export function YearlyBreakdown({ yearly }: { yearly: YearlyPoint[] }) {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? yearly : yearly.slice(0, COLLAPSED_ROWS);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-12 mt-6">
      <div
        className="rounded-2xl border py-6 px-6 sm:p-8"
        style={{ backgroundColor: "var(--card-back-bg)", borderColor: "var(--card-border)" }}
      >
        <h3 className="text-lg font-medium mb-5">Year-by-year breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left tabular-nums">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--card-border)" }}>
                <th scope="col" className="py-3 pr-1 font-medium opacity-60">Year</th>
                <th scope="col" className="py-3 px-3 font-medium opacity-60 text-right">Invested</th>
                <th scope="col" className="py-3 px-3 font-medium opacity-60 text-right">Returns</th>
                <th scope="col" className="py-3 pl-3 font-medium opacity-60 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.year} className="border-b last:border-0" style={{ borderColor: "var(--card-border)" }}>
                  <th scope="row" className="py-3 pr-1 font-normal">{p.year}</th>
                  <td className="py-3 px-3 text-right">{formatRupees(p.invested)}</td>
                  <td className="py-3 px-3 text-right text-[#22a352]">
                    {formatRupees(p.value - p.invested)}
                  </td>
                  <td className="py-3 pl-3 text-right font-medium">{formatRupees(p.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {yearly.length > COLLAPSED_ROWS && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-4 text-sm font-medium text-[#22a352] hover:underline underline-offset-4"
          >
            {expanded ? "Show less" : `Show all ${yearly.length} years`}
          </button>
        )}
      </div>
    </div>
  );
}
