"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { GlossaryTerm } from "@/types/glossary";
import { SearchBar } from "@/components/ui/SearchBar";
import { HighlightText } from "@/components/ui/HighlightText";
import { LoadReveal, LoadRevealText } from "@/components/motion/LoadReveal";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type Props = {
  terms: GlossaryTerm[];
};

/** Groups terms by first letter, sorted A-Z. */
function groupByLetter(terms: GlossaryTerm[]) {
  const groups = new Map<string, GlossaryTerm[]>();
  [...terms]
    .sort((a, b) => a.term.localeCompare(b.term))
    .forEach((t) => {
      const letter = t.term.charAt(0).toUpperCase();
      groups.set(letter, [...(groups.get(letter) ?? []), t]);
    });
  return groups;
}

export function GlossaryMain({ terms }: Props) {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? terms.filter(
          (t) =>
            t.term.toLowerCase().includes(q) ||
            t.definition.toLowerCase().includes(q)
        )
      : terms;
    return groupByLetter(filtered);
  }, [terms, query]);

  return (
    <main id="main-content"
      className="min-h-screen pt-32 pb-32 md:pb-48 px-6 md:px-12 lg:px-24 text-(--fg)"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <LoadReveal
            as="p"
            variant="fade"
            className="text-sm font-normal tracking-widest opacity-60 md:mb-6 mb-4"
          >
            Resources
          </LoadReveal>
          <LoadRevealText as="h1" delay={100} className="text-4xl md:text-5xl font-medium tracking-wide">
            Glossary
          </LoadRevealText>
          <LoadReveal
            as="p"
            delay={350}
            className="mt-6 md:mt-8 text-sm md:text-base opacity-70 max-w-xl mx-auto"
          >
            Plain-language explanations of the investing terms you&apos;ll come
            across in fund documents, statements and our conversations.
          </LoadReveal>
        </div>

        <div className="mb-10">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="E.g. NAV, Expense ratio"
          />
        </div>

        {/* A-Z jump list. Letters with no (matching) terms are shown but inert. */}
        <nav aria-label="Jump to letter" className="mb-16 md:mb-24">
          <ul className="flex flex-wrap justify-center gap-1 list-none p-0">
            {ALPHABET.map((letter) => {
              const enabled = groups.has(letter);
              return (
                <li key={letter}>
                  {enabled ? (
                    <a
                      href={`#letter-${letter}`}
                      className="flex w-8 h-8 items-center justify-center rounded-lg text-sm no-underline hover:bg-[rgba(var(--fg-rgb),0.1)] hover:cursor-pointer transition-colors"
                      style={{ color: "var(--fg)" }}
                    >
                      {letter}
                    </a>
                  ) : (
                    <span
                      className="flex w-8 h-8 items-center justify-center text-sm opacity-25"
                      aria-hidden="true"
                    >
                      {letter}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {groups.size === 0 ? (
          <p className="text-center opacity-70">
            No term matches that search. <br />
            Please{" "}
            <Link
              href="/contact"
              className="underline hover:opacity-80 hover:cursor-pointer transition-opacity underline-offset-3"
            >
              ask us directly
            </Link>
            .
          </p>
        ) : (
          [...groups.entries()].map(([letter, items]) => (
            <section
              key={letter}
              id={`letter-${letter}`}
              aria-labelledby={`letter-${letter}-heading`}
              className="mb-24 md:mb-14 scroll-mt-6"
            >
              <h2
                id={`letter-${letter}-heading`}
                className="text-sm tracking-widest opacity-70 mb-4"
              >
                {letter}
              </h2>
              <dl
                className="border-t"
                style={{ borderColor: "var(--card-border)" }}
              >
                {items.map((t) => (
                  <div
                    key={t.id}
                    id={t.id}
                    className="border-b last:border-b-0 py-6 md:py-8 scroll-mt-6"
                    style={{ borderColor: "var(--card-border)" }}
                  >
                    <dt className="text-base md:text-lg font-medium">
                      <HighlightText text={t.term} query={query} />
                    </dt>
                    <dd className="mt-2 text-sm md:text-base leading-relaxed opacity-70 max-w-2xl font-inter">
                      <HighlightText text={t.definition} query={query} />
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))
        )}
      </div>
    </main>
  );
}
