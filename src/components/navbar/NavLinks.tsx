"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./navConfig";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="hidden md:block">
      <ul className="flex items-center gap-10 list-none p-0 m-0">
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`group relative text-sm no-underline transition-opacity hover:opacity-100 hover:cursor-pointer ${
                  isActive
                    ? "opacity-100 font-medium"
                    : "opacity-60 font-normal"
                }`}
                style={{
                  color: "var(--fg)",
                  fontFamily: "var(--font-poppins), sans-serif",
                }}
              >
                {label}
                <span
                  className={`absolute -bottom-0.5 left-0 right-0 block h-px origin-left transition-transform duration-200 ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                  style={{ backgroundColor: "var(--fg)" }}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
