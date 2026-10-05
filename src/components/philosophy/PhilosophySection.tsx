"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ShineIcon } from "@/icons/ShineIcon";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";

const PILLARS = [
  {
    title: "Allocation Over Automation",
    body: [
      "We don't believe investing should run on autopilot.",
      "Your money should adapt to your goals, market conditions, and changing priorities, not simply follow a fixed SIP schedule.",
    ],
  },
  {
    title: "Clarity Over Complexity",
    body: [
      "Good wealth management should make your financial life simpler, not more complicated.",
      "We focus on understanding why you invest before deciding where you invest.",
    ],
  },
  {
    title: "Compounding Over Chasing",
    body: [
      "Wealth is built by staying invested in the right strategy, not by constantly chasing the next opportunity.",
      "Our philosophy is centered on discipline, diversification, and allowing compounding to do its work.",
    ],
  },
];

type Point = { x: number; y: number };

type Geometry = {
  w: number;
  h: number;
  /** One curve per pillar, converging on `join` (desktop only). */
  fan: string[];
  /** Single line carrying the converged thread to the quote. */
  trunk: string;
  dots: Point[];
  join: Point | null;
  end: Point;
};

/**
 * Smooth S-curve that leaves `a` and arrives at `b` horizontally.
 * Both control points sit at the horizontal midpoint, which gives an even,
 * symmetric sweep and a tangent that flows straight into the trunk line.
 */
function sCurve(a: Point, b: Point): string {
  const mx = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

export function PhilosophySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [visible, setVisible] = useState(false);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const list = listRef.current;
    const quote = quoteRef.current;
    if (!container || !list || !quote) return;

    const box = container.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    const quoteBox = quote.getBoundingClientRect();
    const titles = titleRefs.current
      .filter((el): el is HTMLHeadingElement => el !== null)
      .map((el) => el.getBoundingClientRect());
    if (titles.length === 0) return;

    const centerY = (r: DOMRect) => r.top - box.top + r.height / 2;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    if (isDesktop) {
      // Thread runs above the quote (left column); curves fan out from the
      // titles in the right column and converge leftwards.
      const lineY = quoteBox.top - box.top - 22;
      const colLeft = listBox.left - box.left;
      const quoteRight = quoteBox.right - box.left;
      const join = {
        x: Math.max(colLeft * 0.5, quoteRight + 32),
        y: lineY,
      };
      const end = { x: 6, y: lineY };
      const dots = titles.map((r) => ({
        x: Math.max(r.left - box.left - 28, join.x + 80),
        y: centerY(r),
      }));
      setGeo({
        w: box.width,
        h: box.height,
        fan: dots.map((d) => sCurve(d, join)),
        trunk: `M ${join.x} ${join.y} L ${end.x} ${end.y}`,
        dots,
        join,
        end,
      });
    } else {
      // Stacked layout: the quote leads, and a single thread runs down the
      // left gutter from it through each principle.
      const x = 9;
      const dots = titles.map((r) => ({ x, y: centerY(r) }));
      const end = { x, y: quoteBox.top - box.top + 14 };
      setGeo({
        w: box.width,
        h: box.height,
        fan: [],
        trunk: `M ${end.x} ${end.y} L ${x} ${dots[dots.length - 1].y}`,
        dots,
        join: null,
        end,
      });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          intersectionObserver.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    intersectionObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [measure]);

  // Shared stroke-drawing animation props (path length normalised to 1).
  const draw = (delayMs: number, durationMs: number) => ({
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: visible ? 0 : 1,
    style: {
      transition: `stroke-dashoffset ${durationMs}ms cubic-bezier(0.65, 0, 0.35, 1) ${delayMs}ms`,
    },
  });

  const fade = (delayMs: number) => ({
    opacity: visible ? 1 : 0,
    style: { transition: `opacity 400ms ease ${delayMs}ms` },
  });

  // Text that sits next to the thread. Titles and the quote only fade, since
  // their rects are measured above and a transform would offset the dots.
  // Numbers and body copy are free to slide in as well.
  const textIn = (delayMs: number, slide: boolean) => ({
    className: `transition-[opacity,translate] duration-700 ease-(--ease-out-expo) motion-reduce:transition-none ${
      visible
        ? "opacity-100 translate-y-0"
        : `opacity-0 motion-reduce:opacity-100 ${slide ? "translate-y-4 motion-reduce:translate-y-0" : ""}`
    }`,
    style: { transitionDelay: `${delayMs}ms` },
  });

  return (
    <section
      className="py-8 sm:py-16 px-5 sm:px-8 md:px-12 lg:px-24 mx-auto w-full mt-4 sm:mt-6"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <RevealText className="text-2xl sm:text-3xl md:text-4xl font-medium mb-4 sm:mb-6">
        Our{" "}
        <span className="relative inline-block">
          philosophy
          <ShineIcon
            className="absolute left-1/2 top-1/2 -translate-x-1/3 -translate-y-1/2 w-[80%] max-w-none h-auto text-(--fg)"
            color="currentColor"
          />
        </span>
      </RevealText>
      <Reveal as="p" delay={200} className="text-sm sm:text-base opacity-60 max-w-md">
        Three principles that shape every portfolio we build.
      </Reveal>

      <div
        ref={containerRef}
        className="relative mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] gap-y-14"
      >
        {/* Decorative thread, measured from the rendered titles and quote */}
        {geo && (
          <svg
            className="pointer-events-none absolute inset-0 text-(--fg) motion-reduce:**:transition-none!"
            width={geo.w}
            height={geo.h}
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            fill="none"
            aria-hidden="true"
          >
            {geo.fan.map((d, i) => (
              <path
                key={i}
                d={d}
                stroke="currentColor"
                strokeOpacity={0.3}
                strokeWidth={1}
                strokeLinecap="round"
                {...draw(250 + i * 150, 1300)}
              />
            ))}
            <path
              d={geo.trunk}
              stroke="currentColor"
              strokeOpacity={0.7}
              strokeWidth={1.5}
              strokeLinecap="round"
              {...draw(geo.join ? 1500 : 250, geo.join ? 800 : 1600)}
            />
            {geo.dots.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={3.5}
                fill="currentColor"
                {...fade(100 + i * 150)}
              />
            ))}
            {geo.join && (
              <circle
                cx={geo.join.x}
                cy={geo.join.y}
                r={2.5}
                fill="currentColor"
                {...fade(1500)}
              />
            )}
            <circle
              cx={geo.end.x}
              cy={geo.end.y}
              r={5}
              fill="var(--bg)"
              stroke="currentColor"
              strokeWidth={1.5}
              {...fade(geo.join ? 2200 : 1800)}
            />
          </svg>
        )}

        <ol
          ref={listRef}
          className="relative flex flex-col gap-12 sm:gap-14 md:gap-16 pl-8 md:pl-0 md:col-start-2 md:row-start-1"
        >
          {PILLARS.map((pillar, index) => {
            const t = 100 + index * 150;
            const number = textIn(t, true);
            const title = textIn(t + 80, false);
            const body = textIn(t + 160, true);
            return (
              <li key={pillar.title}>
                <span
                  className={`block text-sm tracking-[0.2em] mb-2 ${number.className}`}
                  style={number.style}
                  aria-hidden="true"
                >
                  <span className="opacity-40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>
                <h3
                  ref={(el) => {
                    titleRefs.current[index] = el;
                  }}
                  className={`inline-block text-lg sm:text-xl font-medium mb-3 ${title.className}`}
                  style={title.style}
                >
                  {pillar.title}
                </h3>
                <div
                  className={`flex flex-col gap-2 text-sm sm:text-base leading-relaxed ${body.className}`}
                  style={body.style}
                >
                  {pillar.body.map((line) => (
                    <p key={line} className="opacity-75">
                      {line}
                    </p>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>

        <p
          ref={quoteRef}
          className="relative order-first md:order-0 pl-8 md:pl-0 md:col-start-1 md:row-start-1 md:self-center md:justify-self-start md:text-left md:max-w-56 lg:max-w-xs text-base sm:text-lg md:text-xl italic leading-snug"
        >
          <span
            className={`block ${textIn(300, false).className}`}
            style={textIn(300, false).style}
          >
            <span className="opacity-80">
              &ldquo;Allocate intelligently. Invest purposefully. Compound
              patiently.&rdquo;
            </span>
          </span>
        </p>
      </div>
    </section>
  );
}
