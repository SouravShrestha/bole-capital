"use client";

type Option<T extends string> = { value: T; label: React.ReactNode; ariaLabel?: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: "sm" | "md" | "compact";
};

/** Pill-style radio group used for SIP/Lumpsum, Yes/No and chart view switches. */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
}: Props<T>) {
  const padding = {
    sm: "px-3 py-1 text-xs",
    md: "px-6 py-2 text-sm",
    // Tighter on small screens so 4+ options fit inside a card.
    compact: "px-3 sm:px-4 py-2 text-xs sm:text-sm",
  }[size];
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex rounded-full p-1 border"
      style={{ borderColor: "var(--card-border)", backgroundColor: "var(--input)" }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.ariaLabel}
            onClick={() => onChange(opt.value)}
            className={`${padding} rounded-full font-medium transition-colors hover:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22a352] ${
              active ? "bg-[#22a352] text-[#fafafa]" : "opacity-60 hover:opacity-100"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
