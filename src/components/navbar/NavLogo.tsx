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
      <LogoIcon className="h-7 w-auto shrink-0" />
    </Link>
  );
}
