"use client";

import type { CSSProperties, ElementType, HTMLAttributes } from "react";
import { useInView } from "./useInView";

export type RevealVariant =
  | "up"
  | "fade"
  | "scale"
  | "left"
  | "right"
  | "grow-x";

type RevealProps = HTMLAttributes<HTMLElement> & {
  /** Element to render. Defaults to `div`. */
  as?: ElementType;
  variant?: RevealVariant;
  /** Delay in ms, handy for staggering siblings. */
  delay?: number;
  /** Override the default transition duration (ms). */
  duration?: number;
};

/**
 * Fades/slides its content in the first time it scrolls into view.
 * The visual states live in globals.css (`[data-reveal]`), so this component
 * only flips a data attribute. Respects `prefers-reduced-motion`.
 */
export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  duration,
  style,
  children,
  ...rest
}: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>();

  const vars = {
    "--reveal-delay": `${delay}ms`,
    ...(duration ? { "--reveal-duration": `${duration}ms` } : {}),
  } as CSSProperties;

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-revealed={inView ? "" : undefined}
      style={{ ...vars, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
