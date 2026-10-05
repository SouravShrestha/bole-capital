"use client";

import { useEffect } from "react";

/**
 * Used by /services/<slug> alias pages: same layout as /services, but lands
 * on the matching section. Runs after ScrollToTop (which skips alias paths)
 * and uses "instant" so it doesn't fight the global smooth scroll.
 */
export function ScrollToSection({ id }: { id: string }) {
  useEffect(() => {
    // Wait a frame so layout (images, reveal wrappers) has settled.
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [id]);

  return null;
}
