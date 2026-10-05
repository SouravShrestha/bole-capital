"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { TestimonialCard } from "./TestimonialCard";
import { ChevronRightIcon } from "@/icons/ChevronRightIcon";
import { useInView } from "@/components/motion/useInView";
import type { Testimonial } from "@/types/testimonial";

type TestimonialsCarouselProps = {
  testimonials: Testimonial[];
  /** Auto-advance interval in ms. */
  interval?: number;
};

// Cards per slide:
//   lg (>=1024px): 1 row x 3 cols
//   md (>=768px):  1 row x 2 cols
//   mobile:        3 rows x 1 col
// Columns are handled by CSS grid classes; JS only decides how many cards
// go into each slide.
const LG_QUERY = "(min-width: 1024px)";
const MD_QUERY = "(min-width: 768px)";

function subscribe(onChange: () => void) {
  const lg = window.matchMedia(LG_QUERY);
  const md = window.matchMedia(MD_QUERY);
  lg.addEventListener("change", onChange);
  md.addEventListener("change", onChange);
  return () => {
    lg.removeEventListener("change", onChange);
    md.removeEventListener("change", onChange);
  };
}

function getPerSlide() {
  if (window.matchMedia(LG_QUERY).matches) return 3;
  if (window.matchMedia(MD_QUERY).matches) return 2;
  return 3;
}

// Server render uses 3 (correct for both lg and mobile); md re-renders after hydration.
const getServerPerSlide = () => 3;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TestimonialsCarousel({
  testimonials,
  interval = 15_000,
}: TestimonialsCarouselProps) {
  const perSlide = useSyncExternalStore(
    subscribe,
    getPerSlide,
    getServerPerSlide,
  );

  const slides = useMemo(() => {
    const out: Testimonial[][] = [];
    for (let i = 0; i < testimonials.length; i += perSlide) {
      out.push(testimonials.slice(i, i + perSlide));
    }
    return out;
  }, [testimonials, perSlide]);

  const slideCount = slides.length;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [rawActive, setActive] = useState(0);
  // Pause only for real mouse hover and keyboard focus. Mouse clicks on the
  // nav buttons also focus them, and touch taps fire emulated mouseenter with
  // no mouseleave, either of which would otherwise pause the carousel forever.
  const [hovered, setHovered] = useState(false);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const paused = hovered || keyboardFocused;
  // Clamp during render: a breakpoint change can shrink the slide count.
  const active = Math.min(rawActive, Math.max(slideCount - 1, 0));

  const goTo = useCallback(
    (index: number) => {
      const el = scrollerRef.current;
      if (!el || slideCount === 0) return;
      // Wrap around in both directions so the carousel loops.
      const target = ((index % slideCount) + slideCount) % slideCount;
      el.scrollTo({
        left: target * el.clientWidth,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      setActive(target);
    },
    [slideCount],
  );

  // Keep the active index in sync with manual (touch/trackpad) scrolling.
  const handleScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActive((prev) => (prev === index ? prev : index));
  }, []);

  // When the breakpoint changes, re-align the scroller with the active slide.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: active * el.clientWidth, behavior: "auto" });
    // Only react to layout changes, not to every active change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideCount]);

  // Auto-advance. Any change to `active` (buttons, dots, swipe) restarts the timer.
  useEffect(() => {
    if (paused || slideCount < 2) return;
    const id = window.setTimeout(() => goTo(active + 1), interval);
    return () => window.clearTimeout(id);
  }, [active, paused, slideCount, interval, goTo]);

  if (slideCount === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      className="relative my-12 sm:my-16 md:my-20"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setHovered(false);
      }}
      onFocus={(e) => {
        if (e.target.matches(":focus-visible")) setKeyboardFocused(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setKeyboardFocused(false);
        }
      }}
    >
      {/* Mirrors the slide grid so the controls line up with the right edge of
          the last card on screen (cards are max-w-sm, centred in their column). */}
      {slideCount > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 mb-2">
          <div className="md:col-start-2 lg:col-start-3 w-full max-w-sm mx-auto flex justify-end gap-2">
            <NavButton label="Previous testimonials" onClick={() => goTo(active - 1)}>
              <ChevronRightIcon className="w-3.5 h-3.5 rotate-180" />
            </NavButton>
            <NavButton label="Next testimonials" onClick={() => goTo(active + 1)}>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </NavButton>
          </div>
        </div>
      )}

      {/* Negative margins cancel the section's horizontal padding so the scroller
          runs edge to edge; each slide re-applies that padding (+ the original
          px-2) so cards sit exactly where they did before. Keep these in sync
          with the section's px-* classes. */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="-mx-5 sm:-mx-8 md:-mx-12 lg:-mx-24 flex overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, slideIndex) => (
          <Slide
            key={`${perSlide}-${slideIndex}`}
            testimonials={slide}
            label={`${slideIndex + 1} of ${slideCount}`}
            hidden={slideIndex !== active}
          />
        ))}
      </div>

    </div>
  );
}

/**
 * One slide of cards. The slide itself is the scroll trigger, so every card in
 * it reveals at once (with a short stagger) instead of each card waiting to
 * scroll into view on its own, which left the last stacked card on mobile
 * hidden until the user scrolled further.
 */
function Slide({
  testimonials,
  label,
  hidden,
}: {
  testimonials: Testimonial[];
  label: string;
  hidden: boolean;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      aria-hidden={hidden}
      className="w-full shrink-0 snap-start grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 px-7 sm:px-10 md:px-14 lg:px-26 py-4"
    >
      {testimonials.map((t, cardIndex) => (
        // Same attributes <Reveal> sets; styles live in globals.css.
        <div
          key={t.name}
          data-reveal="scale"
          data-revealed={inView ? "" : undefined}
          style={{ "--reveal-delay": `${cardIndex * 140}ms` } as CSSProperties}
        >
          <TestimonialCard {...t} />
        </div>
      ))}
    </div>
  );
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full border transition-opacity duration-200 opacity-70 hover:opacity-100 hover:cursor-pointer active:scale-95"
      style={{ borderColor: "var(--card-border)", color: "var(--fg)" }}
    >
      {children}
    </button>
  );
}
