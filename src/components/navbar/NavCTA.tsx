import Link from "next/link";
import { CTA_LINK } from "./navConfig";

export function NavCTA() {
  return (
    <Link
      href={CTA_LINK.href}
      className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 text-sm no-underline transition-opacity hover:opacity-70 shrink-0"
      style={{
        border: "1px solid color-mix(in srgb, var(--fg) 30%, transparent)",
        borderRadius: "6px",
        color: "var(--fg)",
        fontFamily: "var(--font-poppins), sans-serif",
        fontWeight: 500,
      }}
    >
      {CTA_LINK.label}
      <span aria-hidden="true" className="opacity-60">›</span>
    </Link>
  );
}
