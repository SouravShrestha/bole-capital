import type { Transition, Variants } from "motion/react";

/*
 * Variant presets for `TextReveal`. Kept out of the "use client" module so
 * Server Components (see `motion/RevealText`) can build variants on the
 * server and pass them down as plain, serialisable objects.
 */

export type TextRevealPreset =
  | "blur"
  | "fade-in-blur"
  | "scale"
  | "fade"
  | "slide";

export type TextRevealPer = "word" | "char" | "line";

export const defaultStaggerTimes: Record<TextRevealPer, number> = {
  char: 0.03,
  line: 0.1,
  word: 0.05,
};

const defaultContainerVariants: Variants = {
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const defaultItemVariants: Variants = {
  exit: { opacity: 0 },
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const presetVariants: Record<
  TextRevealPreset,
  { container: Variants; item: Variants }
> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      exit: { filter: "blur(12px)", opacity: 0 },
      hidden: { filter: "blur(12px)", opacity: 0 },
      visible: { filter: "blur(0px)", opacity: 1 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0 },
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  "fade-in-blur": {
    container: defaultContainerVariants,
    item: {
      exit: { filter: "blur(12px)", opacity: 0, y: 20 },
      hidden: { filter: "blur(12px)", opacity: 0, y: 20 },
      visible: { filter: "blur(0px)", opacity: 1, y: 0 },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0, scale: 0 },
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0, y: 20 },
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
};

export type BuildVariantsOptions = {
  preset?: TextRevealPreset;
  per?: TextRevealPer;
  /** Delay before the first segment starts (seconds). */
  delay?: number;
  speedReveal?: number;
  speedSegment?: number;
  /** Explicit gap between segments (seconds). Overrides `speedReveal`. */
  stagger?: number;
  containerTransition?: Transition;
  segmentTransition?: Transition;
  variants?: { container?: Variants; item?: Variants };
};

/** Resolves a preset plus timing options into container/item variants. */
export function buildTextRevealVariants({
  preset = "fade",
  per = "word",
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  stagger,
  containerTransition,
  segmentTransition,
  variants,
}: BuildVariantsOptions = {}) {
  const base = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };

  const staggerChildren = stagger ?? defaultStaggerTimes[per] / speedReveal;
  const baseDuration = 0.3 / speedSegment;

  const container: Variants = {
    ...base.container,
    visible: {
      ...(base.container.visible as object),
      transition: {
        delayChildren: delay,
        staggerChildren,
        ...containerTransition,
      },
    },
    ...variants?.container,
  };

  const item: Variants = {
    ...base.item,
    visible: {
      ...(base.item.visible as object),
      transition: { duration: baseDuration, ...segmentTransition },
    },
    ...variants?.item,
  };

  return { container, item };
}
