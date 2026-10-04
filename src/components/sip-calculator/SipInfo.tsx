const POINTS = [
  {
    title: "What is a SIP?",
    body: "A Systematic Investment Plan lets you invest a fixed amount in a mutual fund every month. You buy more units when markets are low and fewer when they are high, which averages out your cost over time.",
  },
  {
    title: "How is it calculated?",
    body: "Each monthly instalment compounds at the monthly equivalent of your expected annual return. The maturity value is the sum of every instalment plus the growth it earns until the end of the period.",
  },
  {
    title: "Why step up?",
    body: "Raising your SIP each year as your income grows can add a large amount to your final corpus, because the extra money also compounds for the years that remain.",
  },
];

export function SipInfo() {
  return (
    <section
      className="w-full"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-12 py-20 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {POINTS.map((p) => (
            <div key={p.title}>
              <h2 className="text-lg font-medium mb-3">{p.title}</h2>
              <p className="text-sm leading-relaxed opacity-70">{p.body}</p>
            </div>
          ))}
        </div>

        <div
          className="mt-12 rounded-2xl border p-6 sm:p-8"
          style={{ backgroundColor: "var(--card-back-bg)", borderColor: "var(--card-border)" }}
        >
          <h2 className="text-lg font-medium mb-3">The formula</h2>
          <p className="text-sm opacity-70 mb-4">
            For a fixed monthly SIP invested at the start of each month:
          </p>
          <p className="font-mono text-sm sm:text-base overflow-x-auto whitespace-nowrap py-2">
            FV = P × [((1 + i)<sup>n</sup> − 1) / i] × (1 + i)
          </p>
          <ul className="mt-4 text-sm opacity-70 flex flex-col gap-1">
            <li>P = monthly investment</li>
            <li>i = monthly rate, (1 + annual rate)<sup>1/12</sup> − 1</li>
            <li>n = number of months</li>
          </ul>
        </div>

        <p className="mt-8 text-xs leading-relaxed opacity-50 max-w-3xl">
          This calculator is for illustration only. Actual returns depend on
          market conditions and the funds you choose, and are not guaranteed.
          Mutual fund investments are subject to market risks; read all scheme
          related documents carefully before investing.
        </p>
      </div>
    </section>
  );
}
