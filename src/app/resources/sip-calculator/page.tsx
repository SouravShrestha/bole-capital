import Link from "next/link";
import { SipCalculator } from "@/components/sip-calculator/SipCalculator";
import { SipInfo } from "@/components/sip-calculator/SipInfo";

export const metadata = {
  title: "SIP Calculator - Bole Capital",
  description:
    "Estimate how your monthly SIP or lumpsum investment could grow, with optional annual step-up.",
};

export default function SipCalculatorPage() {
  return (
    <main
      className="bg-(--bg)"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-12 pt-12 sm:pt-16 pb-10">
        <nav aria-label="Breadcrumb" className="text-xs sm:text-sm mb-4">
          <ol className="flex items-center gap-1.5">
            <li className="opacity-60">
              <Link href="/" className="hover:underline underline-offset-4">Home</Link>
            </li>
            <li aria-hidden="true" className="opacity-60">/</li>
            <li className="opacity-60">
              <Link href="/resources" className="hover:underline underline-offset-4">Resources</Link>
            </li>
            <li aria-hidden="true" className="opacity-60">/</li>
            <li aria-current="page" className="text-[#22a352]">SIP Calculator</li>
          </ol>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-medium">
          Investment <span className="opacity-60">Calculator</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm sm:text-base opacity-70 leading-relaxed">
          See how a monthly SIP or a one-time investment could grow over time.
          Adjust the amount, period and expected return to plan your goals.
        </p>
      </div>
      <SipCalculator />
      <SipInfo />
    </main>
  );
}
