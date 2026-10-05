"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Keep the revealed state once triggered (default) instead of toggling. */
  once?: boolean;
};

// Shrinks the viewport bottom so elements reveal slightly after they enter.
const ROOT_MARGIN = "0px 0px -12% 0px";

// One IntersectionObserver shared by every component on the page, instead of
// one per element. Each element registers a callback keyed by its node.
type Listener = (isIntersecting: boolean) => void;
const listeners = new Map<Element, Listener>();
let sharedObserver: IntersectionObserver | null = null;

function observe(el: Element, listener: Listener) {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          listeners.get(entry.target)?.(entry.isIntersecting);
        }
      },
      { rootMargin: ROOT_MARGIN, threshold: 0 },
    );
  }
  listeners.set(el, listener);
  sharedObserver.observe(el);
}

function unobserve(el: Element) {
  listeners.delete(el);
  sharedObserver?.unobserve(el);
}

/**
 * Tracks whether an element has scrolled into view. Starts `false` on both
 * server and client so the first render never causes a hydration mismatch.
 */
export function useInView<T extends Element>({ once = true }: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    observe(el, (isIntersecting) => {
      if (isIntersecting) {
        setInView(true);
        if (once) unobserve(el);
      } else if (!once) {
        setInView(false);
      }
    });
    return () => unobserve(el);
  }, [once]);

  return [ref, inView] as const;
}
