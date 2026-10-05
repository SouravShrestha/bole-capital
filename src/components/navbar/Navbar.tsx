"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavLogo } from "./NavLogo";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { ExpandIcon } from "@/icons/ExpandIcon";
import { CloseIcon } from "@/icons/CloseIcon";

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu on route change - adjusted during render (not in an
  // effect) so it applies before paint, avoiding an extra render pass.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
  }

  // Lock scroll (including mobile Safari, which scrolls <html> rather than
  // <body>) while the mobile menu is open.
  useEffect(() => {
    if (!isMenuOpen) return;

    const scrollY = window.scrollY;
    const { style: htmlStyle } = document.documentElement;
    const { style: bodyStyle } = document.body;

    const prevHtmlOverflow = htmlStyle.overflow;
    const prevBodyOverflow = bodyStyle.overflow;
    const prevBodyPosition = bodyStyle.position;
    const prevBodyTop = bodyStyle.top;
    const prevBodyWidth = bodyStyle.width;

    htmlStyle.overflow = "hidden";
    bodyStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = "100%";

    return () => {
      htmlStyle.overflow = prevHtmlOverflow;
      bodyStyle.overflow = prevBodyOverflow;
      bodyStyle.position = prevBodyPosition;
      bodyStyle.top = prevBodyTop;
      bodyStyle.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isMenuOpen]);

  return (
    <header
      className="relative top-0 z-50 w-full"
      style={{
        borderBottom: "0px solid color-mix(in srgb, var(--fg) 8%, transparent)",
      }}
    >
      <div
        className="relative flex items-center justify-between h-20 px-6 md:px-12 lg:px-20 mx-auto"
        style={{ maxWidth: "1280px" }}
      >
        <NavLogo />

        {/* Absolutely centered so it stays true-center regardless of logo/CTA widths */}
        <div className="absolute inset-x-0 flex justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <NavLinks />
          </div>
        </div>

        {/* Desktop: theme toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-menu"
            className="flex items-center justify-center w-10 h-10 bg-transparent border-none cursor-pointer"
            style={{ color: "var(--fg)" }}
          >
            {isMenuOpen ? (
              <CloseIcon width={20} height={20} />
            ) : (
              <ExpandIcon className="w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown - outside the max-width container so it spans the full viewport */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
