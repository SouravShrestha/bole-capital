import Image from "next/image";
import { TextHighlightIcon } from "@/icons/TextHighlightIcon";
import planBeforeProductsImg from "@/assets/images/plan-before-products.png";
import clearCommunicationImg from "@/assets/images/clear-communication.png";
import ongoingReviewImg from "@/assets/images/ongoing-review.png";
import simpleOnlineInvestingImg from "@/assets/images/simple-online-investing.png";

const reasons = [
  {
    title: "Plan before investing",
    description:
      "Every portfolio starts with your goals, time horizon and risk profile, so each investment has a clear reason to be there.",
    image: planBeforeProductsImg,
  },
  {
    title: "Clear communication",
    description:
      "No jargon and no pressure. We explain what you own, why you own it and what role it plays in your plan.",
    image: clearCommunicationImg,
  },
  {
    title: "Ongoing review",
    description:
      "Markets and goals change. We review your portfolio regularly and rebalance when your plan calls for it.",
    image: ongoingReviewImg,
  },
  {
    title: "Simple, online investing",
    description:
      "Invest and track your portfolio online through our platform partner, AssetPlus, with us beside you on strategy and questions.",
    image: simpleOnlineInvestingImg,
  },
];

export function AboutWhyChooseUs() {
  return (
    <section
      id="why-bole-capital"
      className="w-full bg-[#222222] text-light"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-24 py-16 sm:py-32 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20 mt-6 md:mt-8">
        <h2 className="text-3xl sm:text-4xl font-medium leading-snug">
          Why our clients choose us as
          <span className="relative inline-block mt-2">
            <TextHighlightIcon
              color="#87ED82"
              className="absolute inset-0 w-full h-full"
            />
            <span className="relative z-10 px-2.5 text-dark">partners?</span>
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12 mt-10 sm:mt-0">
          {reasons.map(({ title, description, image }) => (
            <div
              key={title}
              className="flex flex-col gap-6 items-center sm:items-start"
            >
              <Image
                src={image}
                alt=""
                className="w-20 h-20 object-contain object-left"
              />
              <h3 className="text-lg sm:text-xl font-medium">{title}</h3>
              <p className="text-sm leading-relaxed opacity-90 text-center sm:text-left">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
