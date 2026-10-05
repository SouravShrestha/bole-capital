"use client";

import type { HTMLAttributes } from "react";
import { useInView } from "./useInView";

/**
 * Gentle idle float for decorative images. The looping animation is paused
 * while the element is off screen so it doesn't keep the compositor busy.
 */
export function Float({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const [ref, inView] = useInView<HTMLDivElement>({ once: false });

  return (
    <div
      ref={ref}
      className={`animate-float motion-reduce:animate-none ${inView ? "" : "[animation-play-state:paused]"} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
