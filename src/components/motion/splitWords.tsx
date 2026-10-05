import {
  cloneElement,
  Fragment,
  isValidElement,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { Variants } from "motion/react";
import * as motion from "motion/react-client";

/**
 * Recursively wraps every word of the text content in a `motion.span` that
 * inherits its hidden/visible state from the nearest `TextRevealRoot`. Host
 * elements (decorated spans, `<br />`) are kept and their text children split
 * too; SVG decorations and custom components are left intact and drawn in
 * after the words via CSS.
 *
 * Pure render logic with no hooks, and `motion/react-client` is safe to
 * render from Server Components, so this works on both sides.
 * Returns the split content and how many words it found.
 */
export function splitWords(children: ReactNode, variants: Variants) {
  const counter = { i: 0 };
  const content = split(children, variants, counter);
  return { content, wordCount: counter.i };
}

function split(
  node: ReactNode,
  variants: Variants,
  counter: { i: number },
): ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
      .split(/(\s+)/)
      .map((part, idx) => {
        if (part === "") return null;
        if (/^\s+$/.test(part)) return part;
        counter.i++;
        return (
          <motion.span
            key={idx}
            data-rt-word=""
            className="inline-block"
            variants={variants}
          >
            {part}
          </motion.span>
        );
      });
  }

  if (Array.isArray(node)) {
    return node.map((child, idx) => (
      <Fragment key={idx}>{split(child, variants, counter)}</Fragment>
    ));
  }

  if (
    isValidElement<{ children?: ReactNode }>(node) &&
    typeof node.type === "string" &&
    node.type !== "svg" &&
    node.props.children != null
  ) {
    return cloneElement(
      node,
      undefined,
      split(node.props.children, variants, counter),
    );
  }

  return node;
}

/** When decorative SVGs should start drawing in: after the last word lands. */
export function svgDrawDelay(
  delayMs: number,
  staggerMs: number,
  wordCount: number,
): CSSProperties {
  return {
    "--rt-after": `${delayMs + wordCount * staggerMs + 200}ms`,
  } as CSSProperties;
}
