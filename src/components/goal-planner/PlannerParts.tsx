import { IconButton } from "@/components/ui/IconButton";
import { ChevronRightIcon } from "@/icons/ChevronRightIcon";
import { ExportReport } from "@/components/sip-calculator/ExportReport";
import type { FundingPlan, GoalRequest, GoalYearPoint } from "@/lib/goalPlanner";
import { GoalProjectionChart } from "./GoalProjectionChart";
import { formatRupees, formatRupeesCompact } from "@/lib/sipCalculator";

export const cardClassName = "rounded-2xl border p-6 sm:p-8";
export const cardStyle: React.CSSProperties = {
  backgroundColor: "var(--card-back-bg)",
  borderColor: "var(--card-border)",
};

export const plain = (v: number) => String(v);

export const yearsText = (years: number) => `${years} ${years === 1 ? "year" : "years"}`;

/** Yellow assumption note at the bottom of the inputs card. */
export function AssumptionNote({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-sm leading-relaxed rounded-lg px-4 py-3"
      style={{ backgroundColor: "rgba(242, 201, 76, 0.1)", color: "var(--fg)" }}
    >
      <span className="opacity-80">{children}</span>
    </p>
  );
}

export function PlanHeader({ title, tagline, meta }: { title: string; tagline: string; meta: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <span className="text-xs opacity-50 shrink-0">{meta}</span>
      </div>
      <p className="text-sm italic opacity-70">{tagline}</p>
    </div>
  );
}

/** The two ways to fund a target: monthly SIP or one lumpsum today. */
export function FundingOptions({ plan, years }: { plan: FundingPlan; years: number }) {
  return (
    <>
      <div className="rounded-xl border p-5" style={{ borderColor: "var(--card-border)" }}>
        <dt className="text-sm opacity-60">Planning through SIP</dt>
        <dd className="mt-1 text-2xl font-semibold tabular-nums text-[#22a352]">
          {formatRupees(plan.monthlySip)}
          <span className="text-sm font-normal opacity-70">/month</span>
        </dd>
        <dd className="mt-2 text-xs opacity-60">
          Total invested {formatRupeesCompact(plan.sipInvested)} over {yearsText(years)}
        </dd>
      </div>

      <div className="rounded-xl border p-5" style={{ borderColor: "var(--card-border)" }}>
        <dt className="text-sm opacity-60">Planning through lumpsum</dt>
        <dd className="mt-1 text-2xl font-semibold tabular-nums text-[#22a352]">
          {formatRupees(plan.lumpsum)}
        </dd>
        <dd className="mt-2 text-xs opacity-60">One-time investment today</dd>
      </div>
    </>
  );
}

/** Projection chart with a small heading, shown under the funding options. */
export function ProjectionSection({ yearly, targetLabel }: { yearly: GoalYearPoint[]; targetLabel: string }) {
  return (
    <div className="border-t pt-6 flex flex-col gap-4" style={{ borderColor: "var(--card-border)" }}>
      <p className="text-sm">How your SIP grows towards the goal</p>
      <GoalProjectionChart yearly={yearly} targetLabel={targetLabel} />
    </div>
  );
}

/** Download report + "Talk to us" link at the bottom of the results card. */
export function PlanActions({ request, message }: { request: GoalRequest; message: string }) {
  return (
    <div className="flex flex-col items-center gap-6 mt-auto border-t border-(--card-border) pt-4">
      <ExportReport
        load={() =>
          import("@/lib/goalReport").then(
            (m) => (format, options) => m.exportGoalReport(request, format, options)
          )
        }
      />
      <IconButton
        as="link"
        href={`/contact?message=${encodeURIComponent(message)}`}
        icon={<ChevronRightIcon />}
      >
        Talk to us about this plan
      </IconButton>
    </div>
  );
}
