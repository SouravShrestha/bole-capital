import type { CSSProperties, JSX, ReactNode } from "react";
import { TextRevealRoot } from "@/components/ui/text-reveal";
import {
  buildTextRevealVariants,
  type TextRevealPreset,
} from "@/components/ui/text-reveal-presets";
import { splitWords, svgDrawDelay } from "./splitWords";

export type RevealTextProps = {
  /** Element to render. Defaults to `h2`. */
  as?: keyof JSX.IntrinsicElements;
  /** Delay before the first word starts (ms). */
  delay?: number;
  /** Gap between consecutive words (ms). */
  stagger?: number;
  /** Visual preset, see `text-reveal-presets`. Defaults to `fade-in-blur`. */
  preset?: TextRevealPreset;
  /** Duration of each word's animation (ms). */
  duration?: number;
  /** `"inView"` (default) waits for scroll, `"load"` animates on mount. */
  trigger?: "inView" | "load";
  id?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Heading/text that reveals word by word: each word fades up out of a blur,
 * with no clipping mask, so descenders and decorations are never cut off.
 *
 * Deliberately not a client module: words are split wherever the caller
 * renders (on the server for Server Components) and only the already-split
 * output is handed to the client `TextRevealRoot`. That keeps server and
 * client markup identical.
 */
export function RevealText({
  as = "h2",
  delay = 0,
  stagger = 55,
  preset = "fade-in-blur",
  duration = 500,
  trigger = "inView",
  style,
  id,
  children,
  className,
}: RevealTextProps) {
  const variants = buildTextRevealVariants({
    preset,
    per: "word",
    delay: delay / 1000,
    stagger: stagger / 1000,
    segmentTransition: { duration: duration / 1000, ease: [0.16, 1, 0.3, 1] },
  });
  const { content, wordCount } = splitWords(children, variants.item);

  return (
    <TextRevealRoot
      as={as}
      id={id}
      trigger={trigger}
      variants={variants.container}
      className={className}
      style={{ ...svgDrawDelay(delay, stagger, wordCount), ...style }}
    >
      {content}
    </TextRevealRoot>
  );
}
