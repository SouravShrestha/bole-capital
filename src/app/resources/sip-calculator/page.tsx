import { SipCalculator } from "@/components/sip-calculator/SipCalculator";
import { pageMetadata } from "@/lib/seo";
import { SipInfo } from "@/components/sip-calculator/SipInfo";
import { LoadReveal, LoadRevealText } from "@/components/motion/LoadReveal";

export const metadata = pageMetadata({
  title: "SIP Calculator",
  description:
    "Free SIP and lumpsum calculator. Estimate how your mutual fund investment could grow, with optional annual step-up and a year-by-year breakdown.",
  path: "/resources/sip-calculator",
  keywords: ["SIP calculator", "lumpsum calculator", "step-up SIP calculator", "mutual fund returns"],
});

export default function SipCalculatorPage() {
  return (
    <main
      className="pb-10 md:pb-16"
      style={{ color: "var(--fg)", fontFamily: "var(--font-poppins)" }}
    >
      <div className="mx-auto w-full max-w-3xl px-6 md:px-12 pt-32 pb-16 md:pb-48 text-center">
        <LoadReveal
          as="p"
          variant="fade"
          className="text-sm font-normal tracking-widest opacity-60 md:mb-6 mb-4"
        >
          Tool
        </LoadReveal>
        <LoadRevealText as="h1" delay={100} className="text-4xl md:text-5xl font-medium tracking-wide font-poppins">
          Investment Calculator
        </LoadRevealText>
        <LoadReveal
          as="p"
          delay={350}
          className="mt-6 md:mt-8 text-sm md:text-base opacity-70 max-w-xl mx-auto"
        >
          See how a monthly SIP or a one-time investment could grow over time.
          Adjust the amount, period and expected return to plan your goals.
        </LoadReveal>
      </div>
      <SipCalculator />
      <SipInfo />
    </main>
  );
}
