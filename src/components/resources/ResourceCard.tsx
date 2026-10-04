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
      className="group flex flex-col h-full rounded-2xl sm:rounded-3xl border p-5 sm:p-6 transition-all duration-200 shadow-[0_2px_0_0_var(--fg)] hover:translate-y-0.75 hover:shadow-[0_6px_0_0_var(--fg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22a352]"
      style={{
        backgroundColor: "var(--card-back-bg)",
        borderColor: "var(--fg)",
        color: "var(--fg)",
        fontFamily: "var(--font-poppins)",
      }}
    >
      <div className="flex items-center gap-4">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <span className="block text-[11px] tracking-wider opacity-50">
            {eyebrow}
          </span>
          <h2 className="text-xl sm:text-2xl font-medium leading-tight">
            {title}
          </h2>
        </div>
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:rotate-45"
          style={{ backgroundColor: "var(--fg)" }}
          aria-hidden="true"
        >
          <ArrowIcon color="var(--bg)" className="w-3 h-3" />
        </span>
      </div>

      <p className="mt-7 text-sm leading-relaxed opacity-70">{description}</p>

      <div className="mt-7 flex-1">{children}</div>
      <span className="sr-only">{linkText}</span>
    </Link>
  );
}
