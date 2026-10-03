"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./navConfig";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Nav Menu */}
      <div
        id="mobile-nav-menu"
        className={`md:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-300 ease-in-out z-10 ${
          isOpen ? "max-h-96 opacity-100 pb-9" : "max-h-0 opacity-0"
        }`}
        style={{ backgroundColor: "var(--bg)" }}
      >
        <ul
          className="flex flex-col font-medium tracking-wide text-base px-14 py-2 text-right"
          style={{ color: "var(--fg)" }}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="inline-block pt-3 cursor-pointer transition-colors"
                style={{
                  paddingBottom: "4px",
                  borderBottom:
                    (link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href))
                      ? "1px solid color-mix(in srgb, var(--fg) 30%, transparent)"
                      : "1px solid transparent",
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Backdrop overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`md:hidden absolute left-0 top-full w-full h-[calc(100vh-5rem)] backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "color-mix(in srgb, var(--bg) 30%, transparent)" }}
      />
    </>
  );
}
