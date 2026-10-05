import { GoalPlannerTool } from "@/components/goal-planner/GoalPlannerTool";
import { GoalPlannerInfo } from "@/components/goal-planner/GoalPlannerInfo";
import { LoadReveal, LoadRevealText } from "@/components/motion/LoadReveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Goal Planner",
  description:
    "Free goal planner for your child's education, retirement, dream home and dream car. See what your goal will cost after inflation and the SIP or lumpsum needed to get there.",
  path: "/resources/goal-planner",
  keywords: [
    "goal planner",
    "child education planning calculator",
    "retirement planning calculator",
    "home planning calculator",
    "car planning calculator",
    "goal-based SIP calculator",
  ],
});

export default function GoalPlannerPage() {
  return (
    <main
      id="main-content"
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
          Goal Planner
        </LoadRevealText>
        <LoadReveal
          as="p"
          delay={350}
          className="mt-6 md:mt-8 text-sm md:text-base opacity-70 max-w-xl mx-auto"
        >
          Every dream has a price tag, and inflation keeps raising it. Find out
          what your child&apos;s education, retirement, home or car will really
          cost, and what to invest today to get there.
        </LoadReveal>
      </div>
      <GoalPlannerTool />
      <GoalPlannerInfo />
    </main>
  );
}
