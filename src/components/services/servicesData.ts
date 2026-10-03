import type { ComponentType, SVGProps } from "react";
import { CalendarIcon } from "@/icons/CalendarIcon";
import { DocumentIcon } from "@/icons/DocumentIcon";
import { FamilyIcon } from "@/icons/FamilyIcon";
import { LayerIcon } from "@/icons/LayerIcon";
import { LoopIcon } from "@/icons/LoopIcon";
import { NavigateIcon } from "@/icons/NavigateIcon";
import { PiggybankIcon } from "@/icons/PiggybankIcon";
import { ShieldIcon } from "@/icons/ShieldIcon";
import { TargetIcon } from "@/icons/TargetIcon";

export type ServiceIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type ServicePoint = {
  icon: ServiceIcon;
  text: string;
};

export type ServiceItem = {
  id: string;
  menuLabel: string;
  title: string;
  tagline: string;
  description: string;
  points: ServicePoint[];
};

export const services: ServiceItem[] = [
  {
    id: "mutual-funds",
    menuLabel: "Mutual Funds",
    title: "Mutual Funds.",
    tagline: "Built around your goals.",
    description:
      "With a clear plan behind every fund, your portfolio stays diversified, purposeful and aligned with your time horizon.",
    points: [
      {
        icon: ShieldIcon,
        text: "Matched to your risk profile and comfort with market ups and downs",
      },
      {
        icon: LayerIcon,
        text: "Diversified across categories, so no single fund carries the whole plan",
      },
      {
        icon: LoopIcon,
        text: "Reviewed regularly and rebalanced when your goals or markets change",
      },
    ],
  },
  {
    id: "portfolio-review",
    menuLabel: "Portfolio Review",
    title: "Portfolio Review.",
    tagline: "Know what you own.",
    description:
      "We look at your existing investments and show you where they overlap, where risk is concentrated and whether they still match your goals.",
    points: [
      {
        icon: LayerIcon,
        text: "Overlap check across funds, so you see what is duplicated",
      },
      {
        icon: ShieldIcon,
        text: "Risk review against your comfort level and time horizon",
      },
      {
        icon: LoopIcon,
        text: "A clear summary of what to keep, review or rebalance",
      },
    ],
  },
  {
    id: "goal-based-investing",
    menuLabel: "Goal-based Investing",
    title: "Goal-based Investing.",
    tagline: "Every rupee, a purpose.",
    description:
      "Instead of investing without direction, we link each investment to a goal, such as a home, education or retirement, with a timeline and a plan.",
    points: [
      {
        icon: TargetIcon,
        text: "Goals defined by amount, timeline and priority",
      },
      {
        icon: CalendarIcon,
        text: "Investments matched to when you will need the money",
      },
      {
        icon: LoopIcon,
        text: "Progress checked at regular reviews, with adjustments as life changes",
      },
    ],
  },
  {
    id: "pms-sif",
    menuLabel: "PMS / SIF",
    title: "PMS & SIF.",
    tagline: "Specialised strategies, explained clearly.",
    description:
      "For eligible investors seeking professionally managed or differentiated strategies, we explain how they work, what they cost and where they may fit within a wider portfolio.",
    points: [
      {
        icon: NavigateIcon,
        text: "Suitability and eligibility checked before anything is considered",
      },
      {
        icon: PiggybankIcon,
        text: "Fees, minimum investment and lock-ins explained upfront",
      },
      {
        icon: ShieldIcon,
        text: "Risks and exit terms covered in plain language",
      },
    ],
  },
  {
    id: "insurance",
    menuLabel: "Insurance",
    title: "Insurance.",
    tagline: "Protect what your plan depends on.",
    description:
      "A good financial plan needs a safety net. We help you look at cover for your income, health and family, so a setback doesn't derail your goals.",
    points: [
      {
        icon: ShieldIcon,
        text: "Life and health cover reviewed against your responsibilities",
      },
      {
        icon: FamilyIcon,
        text: "Protection built around dependants and long-term commitments",
      },
      {
        icon: DocumentIcon,
        text: "Plain-language explanation of what is and isn't covered",
      },
    ],
  },
  {
    id: "nps",
    menuLabel: "NPS",
    title: "NPS.",
    tagline: "Retirement, one disciplined step at a time.",
    description:
      "A structured way to build a retirement corpus through regular contributions, with an asset mix that suits your age and risk comfort.",
    points: [
      {
        icon: CalendarIcon,
        text: "Regular contributions that build the habit of saving",
      },
      {
        icon: LayerIcon,
        text: "Asset mix and fund choices explained in simple terms",
      },
      {
        icon: DocumentIcon,
        text: "Tax benefits and withdrawal rules covered clearly",
      },
    ],
  },
];
