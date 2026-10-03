"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { SunIcon } from "@/icons/SunIcon";
import { MoonIcon } from "@/icons/MoonIcon";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="flex items-center justify-center w-9 h-9 bg-transparent border-none cursor-pointer rounded-full transition-opacity hover:opacity-60"
      style={{ color: "var(--fg)" }}
    >
      {theme === "dark" ? (
        <SunIcon width={18} height={18} />
      ) : (
        <MoonIcon width={18} height={18} />
      )}
    </button>
  );
}
