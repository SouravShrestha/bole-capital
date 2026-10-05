"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * On a new route, Next.js scrolls to the top of the page segment, which sits
 * below the layout's Navbar, so the Navbar ends up hidden. This scrolls to the
 * very top of the document instead.
 *
 * Skipped for back/forward (keep the browser's restored position) and for
 * hash URLs (let the target section handle its own scroll).
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const isInitialRender = useRef(true);
  const isPopNavigation = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      isPopNavigation.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // useEffect (not useLayoutEffect) so this runs after Next.js's own
  // layout-phase scroll handling and wins.
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (isPopNavigation.current) {
      isPopNavigation.current = false;
      return;
    }
    if (window.location.hash) return;

    // "instant" overrides the global `scroll-behavior: smooth` on <html>.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
