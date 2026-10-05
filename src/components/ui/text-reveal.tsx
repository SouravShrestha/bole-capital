"use client";

import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from "motion/react";
import { useState, type CSSProperties, type JSX, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  buildTextRevealVariants,
  type TextRevealPer,
  type TextRevealPreset,
} from "./text-reveal-presets";

export type { TextRevealPer, TextRevealPreset } from "./text-reveal-presets";

type Tag = keyof JSX.IntrinsicElements;

/** Shrinks the viewport bottom so text reveals slightly after it enters. */
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

export type TextRevealProps = {
  children: string;
  per?: TextRevealPer;
  as?: Tag;
  variants?: { container?: Variants; item?: Variants };
  className?: string;
  preset?: TextRevealPreset;
  delay?: number;
  speedReveal?: number;
  speedSegment?: number;
  trigger?: boolean;
  /** Wait until scrolled into view instead of animating on mount. */
  inView?: boolean;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  segmentWrapperClassName?: string;
  containerTransition?: Transition;
  segmentTransition?: Transition;
  style?: CSSProperties;
};

function splitText(text: string, per: TextRevealPer) {
  if (per === "line") return text.split("\n");
  return text.split(/(\s+)/);
}

function SegmentItem({
  segment,
  variants,
  per,
  wrapperClassName,
}: {
  segment: string;
  variants: Variants;
  per: TextRevealPer;
  wrapperClassName?: string;
}) {
  const content =
    per === "line" ? (
      <motion.span className="block" variants={variants}>
        {segment}
      </motion.span>
    ) : per === "word" ? (
      <motion.span
        aria-hidden="true"
        className="inline-block whitespace-pre"
        variants={variants}
      >
        {segment}
      </motion.span>
    ) : (
      <motion.span className="inline-block whitespace-pre">
        {segment.split("").map((char, i) => (
          <motion.span
            aria-hidden="true"
            className="inline-block whitespace-pre"
            key={i}
            variants={variants}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );

  if (!wrapperClassName) return content;

  return (
    <span
      className={cn(
        per === "line" ? "block" : "inline-block",
        wrapperClassName,
      )}
    >
      {content}
    </span>
  );
}

/** Animates a plain string segment by segment (word, char or line). */
export function TextReveal({
  children,
  per = "word",
  as = "p",
  variants,
  className,
  preset = "fade",
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  inView = false,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  style,
}: TextRevealProps) {
  const segments = splitText(children, per);
  const MotionTag = motion[as as "div"];
  const computed = buildTextRevealVariants({
    preset,
    per,
    delay,
    speedReveal,
    speedSegment,
    containerTransition,
    segmentTransition,
    variants,
  });

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <MotionTag
          {...(inView
            ? { whileInView: "visible", viewport: VIEWPORT }
            : { animate: "visible" })}
          className={className}
          exit="exit"
          initial="hidden"
          onAnimationComplete={onAnimationComplete}
          onAnimationStart={onAnimationStart}
          style={style}
          variants={computed.container}
        >
          {per !== "line" ? <span className="sr-only">{children}</span> : null}
          {segments.map((segment, index) => (
            <SegmentItem
              key={`${per}-${index}-${segment}`}
              per={per}
              segment={segment}
              variants={computed.item}
              wrapperClassName={segmentWrapperClassName}
            />
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  );
}

export type TextRevealRootProps = {
  id?: string;
  as?: Tag;
  /** Container variants, usually from `buildTextRevealVariants`. */
  variants: Variants;
  /** `"load"` animates on mount, `"inView"` waits until scrolled into view. */
  trigger?: "load" | "inView";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Container for content that was already split into `motion.span` segments
 * (see `motion/splitWords`). It never inspects its children, so they can be
 * split on the server and passed through from Server Components safely.
 *
 * Sets `data-revealed` once the reveal starts so CSS can draw in decorative
 * SVGs (underlines, highlights) after the words land.
 */
export function TextRevealRoot({
  id,
  as = "h2",
  variants,
  trigger = "inView",
  className,
  style,
  children,
}: TextRevealRootProps) {
  const [revealed, setRevealed] = useState(false);
  const MotionTag = motion[as as "div"];

  return (
    <MotionTag
      id={id}
      data-reveal-text=""
      data-revealed={revealed ? "" : undefined}
      initial="hidden"
      {...(trigger === "inView"
        ? {
            whileInView: "visible",
            viewport: VIEWPORT,
            onViewportEnter: () => setRevealed(true),
          }
        : { animate: "visible", onAnimationStart: () => setRevealed(true) })}
      variants={variants}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}

export default TextReveal;
