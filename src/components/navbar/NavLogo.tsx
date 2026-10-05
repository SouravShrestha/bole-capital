import Link from "next/link";
import { LogoIcon } from "@/icons/LogoIcon";

export function NavLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 no-underline shrink-0 hover:cursor-pointer"
      aria-label="Bole Capital - Home"
      style={{ color: "var(--fg)" }}
    >
      <LogoIcon className="w-7 h-7 shrink-0" />
      <span
        className="text-xs leading-tight tracking-wide"
        style={{ fontFamily: "var(--font-uber-medium), sans-serif" }}
      >
        Bole
        <br />
        Capital
      </span>
    </Link>
  );
}
