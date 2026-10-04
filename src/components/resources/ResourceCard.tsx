import Link from "next/link";
import { ArrowIcon } from "@/icons/ArrowIcon";

type Props = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  linkText: string;
  icon: React.ReactNode;
  /** Visual preview shown at the bottom of the card. */
  children: React.ReactNode;
};

/**
 * Large clickable resource tile. Uses the same outlined, hard-shadow style as
 * the offering cards, but driven by theme variables so it works in both modes.
 */
export function ResourceCard({
  href,
  eyebrow,
  title,
  description,
  linkText,
  icon,
  children,
}: Props) {
  return (
    <Link
      href={href}
      className="group flex flex-col h-full rounded-2xl sm:rounded-3xl border p-6 sm:p-8 transition-all duration-200 shadow-[0_2px_0_0_var(--fg)] hover:translate-y-0.75 hover:shadow-[0_6px_0_0_var(--fg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22a352]"
      style={{
        backgroundColor: "var(--card-back-bg)",
        borderColor: "var(--fg)",
        color: "var(--fg)",
        fontFamily: "var(--font-poppins)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "var(--input)" }}
        >
          {icon}
        </span>
        <span className="text-[11px] tracking-wider opacity-50 pt-1">
          {eyebrow}
        </span>
      </div>

      <h2 className="mt-6 text-2xl sm:text-3xl font-medium">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed opacity-70 max-w-md">
        {description}
      </p>

      <div className="mt-8 flex-1">{children}</div>

      <div className="mt-8 flex items-center gap-3">
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:rotate-45"
          style={{ backgroundColor: "var(--fg)" }}
        >
          <ArrowIcon color="var(--bg)" className="w-3 h-3" />
        </span>
        <span className="text-sm font-medium group-hover:underline underline-offset-4">
          {linkText}
        </span>
      </div>
    </Link>
  );
}
