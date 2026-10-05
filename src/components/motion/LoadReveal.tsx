import type { CSSProperties, ElementType, HTMLAttributes } from "react";
import type { RevealVariant } from "./Reveal";
import { RevealText, type RevealTextProps } from "./RevealText";

type LoadRevealProps = HTMLAttributes<HTMLElement> & {
  /** Element to render. Defaults to `div`. */
  as?: ElementType;
  variant?: Exclude<RevealVariant, "grow-x">;
  /** Delay in ms, handy for staggering siblings. */
  delay?: number;
  /** Override the default animation duration (ms). */
  duration?: number;
};

/**
 * On-load counterpart to `Reveal` for content that is visible on first paint
 * (page heroes). Pure CSS keyframes, so it needs no JS or hydration and
 * starts with the first frame instead of waiting for React. Works in server
 * and client components.
 */
export function LoadReveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  duration,
  style,
  children,
  ...rest
}: LoadRevealProps) {
  const vars = {
    "--reveal-delay": `${delay}ms`,
    ...(duration ? { "--reveal-duration": `${duration}ms` } : {}),
  } as CSSProperties;

  return (
    <Tag data-load-reveal={variant} style={{ ...vars, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * On-load counterpart to `RevealText` for headings visible on first paint.
 * Same word-by-word blur reveal, started on mount instead of on scroll.
 */
export function LoadRevealText({
  as = "h1",
  ...rest
}: Omit<RevealTextProps, "trigger">) {
  return <RevealText as={as} trigger="load" {...rest} />;
}
