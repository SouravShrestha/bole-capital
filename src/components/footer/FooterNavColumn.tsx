"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type Props = {
  heading: string;
  links: FooterLink[];
};

export function FooterNavColumn({ heading, links }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4">
      <h3
        className="text-xs tracking-widest opacity-50"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        {heading}
      </h3>
      <ul className="flex flex-col gap-4 list-none p-0 mt-2">
        {links.map(({ label, href, external }) => {
          const isActive =
            !external &&
            (href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`));
          return (
            <li key={label}>
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm no-underline opacity-70 hover:opacity-100 transition-opacity"
                  style={{
                    color: "var(--fg)",
                    fontFamily: "var(--font-poppins), sans-serif",
                  }}
                >
                  {label}
                </a>
              ) : (
                <Link
                  href={href}
                  className={`text-sm no-underline hover:opacity-100 transition-opacity ${
                    isActive ? "opacity-100 font-medium" : "opacity-70"
                  }`}
                  style={{
                    color: "var(--fg)",
                    fontFamily: "var(--font-poppins), sans-serif",
                  }}
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
