import { MARKET_RISK_DISCLAIMER } from "@/lib/compliance";
import { GOAL_INFO_POINTS, GOAL_METHOD_STEPS } from "./goalConfig";



/** Explainer cards and method notes below the goal planner, same style as SipInfo. */
export function GoalPlannerInfo() {
  return (
    <section className="w-full" style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-12 py-20 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {GOAL_INFO_POINTS.map((p) => (
            <div
              key={p.title}
              className="relative w-full max-w-sm mx-auto"
              style={{ transform: `rotate(${p.rotation}deg)` }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-3xl border-2 translate-x-1.5 translate-y-1.5 -rotate-1"
                style={{ backgroundColor: "var(--card-back-bg)", borderColor: "var(--card-border)" }}
              />
              <div
                className="relative h-full rounded-3xl border-2 bg-(--bg) p-8 sm:p-10 flex flex-col gap-4"
                style={{ borderColor: "var(--card-border)", color: "var(--fg)" }}
              >
                <h2 className="text-lg font-medium">{p.title}</h2>
                <p className="text-sm sm:text-base leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-20 md:mt-32 py-6 px-8 sm:p-8 md:rounded-3xl -mx-5"
          style={{ backgroundColor: "var(--card-back-bg)", borderColor: "var(--card-border)" }}
        >
          <h2 className="text-xl font-medium">How we work it out</h2>
          <svg
            aria-hidden="true"
            viewBox="0 0 120 8"
            preserveAspectRatio="none"
            className="mt-1 mb-6 h-2 w-20"
            fill="none"
          >
            <path
              d="M2 5 C 20 1, 40 7, 60 4 S 100 2, 118 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <dl className="grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-x-6 gap-y-4 text-sm">
            {GOAL_METHOD_STEPS.map((s) => (
              <div key={s.label} className="contents">
                <dt className="font-medium">{s.label}</dt>
                <dd className="opacity-70 -mt-3 sm:mt-0">{s.formula}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm opacity-70">
            Here i is the monthly rate, (1 + annual return)<sup>1/12</sup> − 1, and n is
            the number of months. SIPs are invested at the start of each month, the same
            way as our SIP calculator.
          </p>
        </div>

        <p className="mt-8 text-sm leading-relaxed opacity-50 max-w-3xl">
          * This planner is for illustration only. Actual costs and returns depend on
          market conditions and the funds you choose, and are not guaranteed.{" "}
          {MARKET_RISK_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
