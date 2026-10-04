"use client";
import { useId, useState } from "react";
import { formatNumber } from "@/lib/sipCalculator";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** Shown inside the input, e.g. "₹", "Yrs", "%". */
  unit: string;
  /** Format the number shown in the text input (defaults to en-IN grouping). */
  format?: (value: number) => string;
  disabled?: boolean;
  /** Hide the slider, render only the text input. */
  hideSlider?: boolean;
  /** Extra controls rendered next to the label (e.g. a toggle). */
  labelAddon?: React.ReactNode;
};

const ACCENT = "#22a352";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function RangeField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit,
  format = formatNumber,
  disabled = false,
  hideSlider = false,
  labelAddon,
}: Props) {
  const id = useId();
  // While focused, the user's raw text is shown so they can type freely.
  // Otherwise (draft === null) the formatted committed value is shown.
  const [draft, setDraft] = useState<string | null>(null);
  const displayValue = draft ?? format(value);

  const commit = (raw: string) => {
    const parsed = parseFloat(raw.replace(/[^\d.]/g, ""));
    const next = Number.isFinite(parsed) ? clamp(parsed, min, max) : min;
    onChange(next);
    setDraft(null);
  };

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <label htmlFor={id} className="text-sm sm:text-base opacity-90">
            {label}
          </label>
          {labelAddon}
        </div>
        <div
          className="flex items-center gap-1 rounded-lg px-3 py-2 w-32 sm:w-36 border border-transparent focus-within:border-[#22a352] transition-colors"
          style={{
            backgroundColor: "var(--input)",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <input
            id={id}
            type="text"
            inputMode="decimal"
            value={displayValue}
            disabled={disabled}
            onFocus={() => setDraft(String(value))}
            onChange={(e) => {
              setDraft(e.target.value);
              const parsed = parseFloat(e.target.value.replace(/[^\d.]/g, ""));
              // Live-update while typing, but only when the value is in range.
              if (Number.isFinite(parsed) && parsed >= min && parsed <= max) {
                onChange(parsed);
              }
            }}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            className="w-full bg-transparent outline-none text-sm font-medium tabular-nums disabled:cursor-not-allowed"
            style={{ color: "var(--fg)" }}
          />
          <span className="text-xs opacity-50 shrink-0" aria-hidden="true">
            {unit}
          </span>
        </div>
      </div>
      {!hideSlider && (
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="sip-range w-full"
          style={{
            background: `linear-gradient(to right, ${ACCENT} ${percent}%, var(--card-border) ${percent}%)`,
          }}
        />
      )}
    </div>
  );
}
