"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { FaqCategory } from "@/types/faq";
import { PlusIcon } from "@/icons/PlusIcon";
import { ChevronRightIcon } from "@/icons/ChevronRightIcon";
import { IconButton } from "@/components/ui/IconButton";
import { SearchBar } from "@/components/ui/SearchBar";
import { HighlightText } from "@/components/ui/HighlightText";
import { LoadReveal, LoadRevealText } from "@/components/motion/LoadReveal";

interface FaqMainProps {
  categories: FaqCategory[];
}

const FaqMain = ({ categories }: FaqMainProps) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const highlightText = (text: string, query: string) => (
    <HighlightText text={text} query={query} />
  );

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;

    return categories
      .map((category) => ({
        ...category,
        faqs: category.faqs?.filter(
          (faq) =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => (category.faqs?.length ?? 0) > 0);
  }, [categories, searchQuery]);

  return (
    <main id="main-content" className="min-h-screen pt-32 pb-32 md:pb-48 px-6 md:px-12 lg:px-24 text-(--fg)">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <LoadReveal
            as="p"
            variant="fade"
            className="text-sm font-normal tracking-widest opacity-60 md:mb-6 mb-4"
          >
            Knowledge Base
          </LoadReveal>
          <LoadRevealText as="h1" delay={100} className="text-4xl md:text-5xl font-medium tracking-wide font-poppins">
            Frequently Asked Questions
          </LoadRevealText>
          <LoadReveal
            as="p"
            delay={350}
            className="mt-6 md:mt-8 text-sm md:text-base opacity-70 max-w-xl mx-auto"
          >
            Find quick answers about Bole Capital&apos;s services, investment
            approach, and how to get started.
          </LoadReveal>
        </div>

        <div className="mb-16 md:mb-32">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="E.g. SIP, Portfolio"
          />
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center">
            <p className="opacity-70">
              {categories.length === 0 ? (
                "No FAQs available at the moment."
              ) : (
                <>
                  No question matches that search. <br />Please{" "}
                  <Link
                    href="/contact"
                    className="underline hover:opacity-80 hover:cursor-pointer transition-opacity underline-offset-3"
                  >
                    ask us directly
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        ) : (
          filteredCategories.map((category, categoryIndex) => (
            <div key={category.id ?? categoryIndex} className="mb-16">
              <div className="mb-6 mt-12">
                <h2 className="text-sm font-regular tracking-widest opacity-70">
                  {categoryIndex + 1}. {category.name}
                </h2>
              </div>
              <div
                className="space-y-0 border-t"
                style={{ borderColor: "var(--card-border)" }}
              >
                {category.faqs?.map((faq, faqIndex) => {
                  const key = `${category.id}-${faq.id}`;
                  const isOpen = openItems[key];
                  return (
                    <div
                      key={faq.id ?? faqIndex}
                      className="border-b hover:cursor-pointer"
                      style={{ borderColor: "var(--card-border)" }}
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full py-6 md:py-8 flex items-start justify-between text-left group hover:cursor-pointer"
                      >
                        <h3 className="text-base md:text-lg font-normal pr-4 group-hover:opacity-80 transition-opacity font-poppins hover:cursor-pointer">
                          {highlightText(faq.question, searchQuery)}
                        </h3>
                        <div className="shrink-0 mt-1">
                          <PlusIcon
                            className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}
                          />
                        </div>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                      >
                        <div className="pb-8">
                          <p className="text-base md:text-lg opacity-70 leading-relaxed max-w-2xl font-inter">
                            {highlightText(faq.answer, searchQuery)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        <div className="mt-32 md:mt-48 text-center">
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-medium mb-4">
              Still have questions?
            </h3>
            <p className="text-base opacity-70 mb-8 max-w-lg mx-auto">
              We&apos;re here to help! Reach out to us directly for personalized
              assistance.
            </p>
          </div>
          <IconButton
            as="link"
            href="/contact"
            className="rounded-2xl"
            icon={
              <ChevronRightIcon
                className="w-4 h-4 mt-[1.2px]"
                color="var(--bg)"
              />
            }
          >
            Contact Us
          </IconButton>
        </div>
      </div>
    </main>
  );
};

export default FaqMain;
