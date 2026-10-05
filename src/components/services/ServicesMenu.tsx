"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { services } from "./servicesData";
import { getServiceSeo, isServiceAliasPath, servicePath } from "@/lib/servicesSeo";
import { SITE_NAME } from "@/lib/seo";

/**
 * Point the address bar (and tab title) at /services/<id> without a
 * navigation. replaceState, not pushState: switching sections is in-page
 * scrolling, so it shouldn't fill the back button with entries.
 */
function syncUrl(id: string) {
  const path = servicePath(id);
  if (window.location.pathname !== path || window.location.hash) {
    window.history.replaceState(window.history.state, "", path);
  }
  const seo = getServiceSeo(id);
  if (seo) document.title = `${seo.seoTitle} - ${SITE_NAME}`;
}

export function ServicesMenu() {
  const [activeId, setActiveId] = useState(services[0].id);
  // Section we're smooth-scrolling to after a menu click. While set, the
  // observer ignores the sections passed on the way.
  const scrollTarget = useRef<string | null>(null);

  useEffect(() => {
    // Legacy /services#<id> links: scroll there and move to the clean URL.
    const hash = window.location.hash.replace("#", "");
    if (hash && services.some((s) => s.id === hash)) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        setActiveId(hash);
        syncUrl(hash);
      }, 100);
    }

    const elements = services
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    // A section is "active" while it crosses a band near the top of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (!visible) return;
        const id = visible.target.id;

        if (scrollTarget.current) {
          if (id !== scrollTarget.current) return;
          scrollTarget.current = null;
        }

        setActiveId(id);
        // Only follow scrolling once the visitor is on a /services/<slug> URL;
        // plain /services stays as-is until they pick a section.
        if (isServiceAliasPath(window.location.pathname)) syncUrl(id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleClick(e: MouseEvent<HTMLAnchorElement>, id: string) {
    // Let modified clicks (new tab, etc.) behave like normal links.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollTarget.current = id;
    // Fallback in case the observer never reports the target (e.g. already in view).
    setTimeout(() => {
      if (scrollTarget.current === id) scrollTarget.current = null;
    }, 1200);

    target.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth", block: "start" });
    setActiveId(id);
    syncUrl(id);
  }

  return (
    <nav
      aria-label="Services"
      className="hidden lg:block sticky top-12 self-start"
    >
      <ul className="flex flex-col gap-8">
        {services.map((service) => {
          const isActive = service.id === activeId;
          return (
            <li key={service.id}>
              <Link
                href={servicePath(service.id)}
                scroll={false}
                onClick={(e) => handleClick(e, service.id)}
                aria-current={isActive ? "true" : undefined}
                className={`block pb-3 text-sm transition-opacity hover:cursor-pointer ${
                  isActive ? "font-medium" : "opacity-50 hover:opacity-100"
                }`}
                style={{
                  borderBottom: isActive
                    ? "1px solid var(--fg)"
                    : "1px solid transparent",
                }}
              >
                {service.menuLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
