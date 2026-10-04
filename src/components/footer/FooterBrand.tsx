import Link from "next/link";
import { LogoIcon } from "@/icons/LogoIcon";
import { AmfiLogoIcon } from "@/icons/AmfiLogoIcon";
import { SITE_LAST_UPDATED } from "@/lib/seo";

const LAST_UPDATED = new Date(SITE_LAST_UPDATED).toLocaleDateString("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

export function FooterBrand() {
  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/"
        className="flex items-center gap-2.5 no-underline w-fit"
        aria-label="Bole Capital Home"
        style={{ color: "var(--fg)" }}
      >
        <LogoIcon className="shrink-0 w-7 h-7" />
        <span
          className="text-xs leading-tight tracking-wide"
          style={{ fontFamily: "var(--font-uber-medium), sans-serif" }}
        >
          Bole
          <br />
          Capital
        </span>
      </Link>

      <p
        className="text-sm leading-relaxed max-w-[240px] opacity-70"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        Bole Capital helps individuals and families build and protect wealth
        through a disciplined, long-term approach.
      </p>

      <a
        href="https://www.amfiindia.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 no-underline w-fit"
        aria-label="AMFI Registered Mutual Fund Distributor"
      >
        <AmfiLogoIcon width={36} height={44} />
        <span
          className="text-xs leading-snug"
          style={{
            color: "#00A888",
            fontFamily: "var(--font-poppins), sans-serif",
          }}
        >
          ARN: 366194
          <br />
          Legal Name: Hemant Bole
          <br />
          Registered Mutual Fund Distributor
        </span>
      </a>

      <div
        className="mt-3 flex flex-col gap-2 opacity-60 text-xs"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        <p>{new Date().getFullYear()} © Bole Capital</p>
        <p>Last updated {LAST_UPDATED}</p>
      </div>
    </div>
  );
}
