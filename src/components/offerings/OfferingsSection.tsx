import { OfferingCard } from "./OfferingCard";
import { DoubleUnderlineIcon } from "@/icons/DoubleUnderlineIcon";

// Import images
import mutualFundsImg from "@/assets/images/mutual-funds.png";
import portfolioReviewImg from "@/assets/images/portfolio-review.png";
import goalBasedInvestingImg from "@/assets/images/goal-based-investing.png";
import pmsSifImg from "@/assets/images/pms-sif.png";
import insuranceImg from "@/assets/images/insurance.png";
import npsImg from "@/assets/images/nps.png";

export function OfferingsSection() {
  const offerings = [
    {
      title: "Mutual Funds",
      description:
        "Build diversified portfolios aligned with your goals, time horizon and risk profile.",
      linkText: "Learn more",
      image: mutualFundsImg,
      variant: "light" as const,
      href: "/services#mutual-funds",
    },
    {
      title: "Portfolio Review",
      description:
        "Understand what you own, where risks overlap and whether your investments remain aligned.",
      linkText: "Review my portfolio",
      image: portfolioReviewImg,
      variant: "dark" as const,
      href: "/services#portfolio-review",
    },
    {
      title: "Goal-based Investing",
      description:
        "For investors seeking professionally managed portfolio strategies, subject to suitability and eligibility.",
      linkText: "Learn more",
      image: goalBasedInvestingImg,
      variant: "light" as const,
      href: "/services#goal-based-investing",
    },
    {
      title: "PMS / SIF",
      description:
        "Access newer investment structures designed for investors seeking differentiated strategies.",
      linkText: "Learn more",
      image: pmsSifImg,
      variant: "dark" as const,
      href: "/services#pms-sif",
    },
    {
      title: "Insurance",
      description:
        "Protect your income, health, family and assets against financial shocks.",
      linkText: "Learn more",
      image: insuranceImg,
      variant: "light" as const,
      href: "/services#insurance",
    },
    {
      title: "NPS",
      description:
        "A structured approach to long-term retirement accumulation.",
      linkText: "Learn more",
      image: npsImg,
      variant: "dark" as const,
      href: "/services#nps",
    },
  ];

  return (
    <section className="py-8 sm:py-16 px-5 sm:px-8 md:px-12 lg:px-24 mx-auto w-full mt-8 sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-12 mb-12 sm:mb-16">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-medium whitespace-nowrap"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          What do we{" "}
          <span className="relative inline-block">
            offer?
            <DoubleUnderlineIcon
              className="absolute left-0 -bottom-2 sm:-bottom-3 w-full h-auto text-[var(--fg)]"
              color="currentColor"
            />
          </span>
        </h2>
        <p
          className="text-sm sm:text-xs md:text-sm max-w-xl text-left md:text-right md:ml-auto mt-2"
          style={{ fontFamily: "var(--font-poppins)", opacity: 0.8 }}
        >
          From building wealth to protecting it, Bole Capital brings together
          solutions across different stages of your financial journey.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 md:mt-20 lg:mt-24 ">
        {offerings.map((offering, index) => (
          <OfferingCard key={index} {...offering} />
        ))}
      </div>
    </section>
  );
}
