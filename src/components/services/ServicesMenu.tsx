"use client";

import { useEffect, useState } from "react";
import { services } from "./servicesData";

export function ServicesMenu() {
  const [activeId, setActiveId] = useState(services[0].id);

  useEffect(() => {
    // Handle initial hash for cross-page smooth scroll
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setActiveId(id);
        }
      }, 100);
    }

    const elements = services
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    // A section is "active" while it crosses a band near the top of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
              <a
                href={`#${service.id}`}
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
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
