/** Also rendered into the exported report (src/lib/sipReport.ts). */
export const SIP_INFO_POINTS = [
  {
    title: "What is a SIP?",
    body: "A Systematic Investment Plan lets you invest a fixed amount in a mutual fund every month. You buy more units when markets are low and fewer when they are high, which averages out your cost over time.",
    rotation: -1,
  },
  {
    title: "How is it calculated?",
    body: "Each monthly instalment compounds at the monthly equivalent of your expected annual return. The maturity value is the sum of every instalment plus the growth it earns until the end of the period.",
    rotation: 3,
  },
  {
    title: "Why step up?",
    body: "Raising your SIP each year as your income grows can add a large amount to your final corpus, because the extra money also compounds for the years that remain.",
    rotation: 0,
  },
];

export function SipInfo() {
  return (
    <section
      className="w-full"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-12 py-20 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {SIP_INFO_POINTS.map((p) => (
            <div
              key={p.title}
              className="relative w-full max-w-sm mx-auto"
              style={{ transform: `rotate(${p.rotation}deg)` }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-3xl border-2 translate-x-1.5 translate-y-1.5 -rotate-1"
                style={{
                  backgroundColor: "var(--card-back-bg)",
                  borderColor: "var(--card-border)",
                }}
              />
              <div
                className="relative h-full rounded-3xl border-2 bg-(--bg) p-8 sm:p-10 flex flex-col gap-4"
                style={{
                  borderColor: "var(--card-border)",
                  color: "var(--fg)",
                }}
              >
                <h2 className="text-lg font-medium">{p.title}</h2>
                <p className="text-sm sm:text-base leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-20 md:mt-32 py-6 px-8  sm:p-8 md:rounded-3xl -mx-5"
          style={{
            backgroundColor: "var(--card-back-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <h2 className="text-xl font-medium">The formula</h2>
          <svg
            aria-hidden="true"
            viewBox="0 0 120 8"
            preserveAspectRatio="none"
            className="mt-1 mb-4 h-2 w-20"
            fill="none"
          >
            <path
              d="M2 5 C 20 1, 40 7, 60 4 S 100 2, 118 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-sm opacity-70 mb-8">
            For a fixed monthly SIP invested at the start of each month:
          </p>
          <div
            role="math"
            aria-label="FV equals P times ((1 plus i) to the power n minus 1) divided by i, times (1 plus i)"
            className="overflow-x-auto py-2"
          >
            <div
              className="flex items-center gap-2 sm:gap-3 whitespace-nowrap text-base font-medium sm:text-xl w-max mx-auto tracking-wider"
              style={{
                fontFamily:
                  "'Latin Modern Math', 'STIX Two Math', 'Cambria Math', 'Times New Roman', serif",
              }}
            >
              <span className="font-poppins">FV</span>
              <span className="font-poppins">=</span>
              <span className="font-poppins">P</span>
              <span className="font-poppins">×</span>
              <span className="inline-flex flex-col items-center font-poppins">
                <span className="px-2 pb-1">
                  (1 + i)
                  <sup className="text-base">n</sup> − 1
                </span>
                <span className="w-full text-center border-t-[1.5px] border-current pt-1">
                  i
                </span>
              </span>
              <span className="font-poppins">×</span>
              <span className="font-poppins">(1 + i)</span>
            </div>
          </div>
          <dl className="mt-8 text-sm opacity-70 grid grid-cols-[1.5ch_auto_1fr] gap-x-2 gap-y-1 text-left">
            <dt>P</dt>
            <span aria-hidden="true">=</span>
            <dd>monthly investment</dd>
            <dt>i</dt>
            <span aria-hidden="true">=</span>
            <dd>
              monthly rate = (1 + annual rate)<sup>1/12</sup> − 1
            </dd>
            <dt>n</dt>
            <span aria-hidden="true">=</span>
            <dd>number of months</dd>
          </dl>
        </div>

        <p className="mt-8 text-sm leading-relaxed opacity-50 max-w-3xl">
          * This calculator is for illustration only. Actual returns depend on
          market conditions and the funds you choose, and are not guaranteed.
        </p>
      </div>
    </section>
  );
}
