"use client";
import { useId, useState } from "react";
import { formatNumber } from "@/lib/sipCalculator";

export type RangeMark = { value: number; label: string };

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
  /**
   * Break points shown under the slider. When set, the slider uses a
   * piecewise scale so marks are evenly spaced, and it snaps to a mark
   * when dragged close to one.
   */
  marks?: RangeMark[];
};

const ACCENT = "#22a352";
/** Internal resolution of the slider when using a piecewise (marked) scale. */
const SCALE = 1000;
/** Distance (in SCALE units) within which the slider snaps to a mark. */
const SNAP_DISTANCE = 25;
/** Thumb width in px, must match `.sip-range` thumb in globals.css. */
const THUMB = 20;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Map a value to a slider position, treating each gap between stops as an equal segment. */
function valueToPos(value: number, stops: number[]) {
  const segments = stops.length - 1;
  for (let i = 0; i < segments; i++) {
    const lo = stops[i];
    const hi = stops[i + 1];
    if (value <= hi || i === segments - 1) {
      const frac = clamp((value - lo) / (hi - lo), 0, 1);
      return ((i + frac) / segments) * SCALE;
    }
  }
  return 0;
}

function posToValue(pos: number, stops: number[], step: number) {
  const segments = stops.length - 1;
  const t = (pos / SCALE) * segments;
  const i = Math.min(Math.floor(t), segments - 1);
  const raw = stops[i] + (t - i) * (stops[i + 1] - stops[i]);
  return Math.round(raw / step) * step;
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
  marks,
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

  const hasMarks = !!marks && marks.length > 0;
  const stops = hasMarks
    ? [min, ...marks.map((m) => m.value).filter((v) => v > min && v < max), max]
    : [min, max];

  const sliderValue = hasMarks ? valueToPos(value, stops) : value;
  const percent = hasMarks
    ? (sliderValue / SCALE) * 100
    : ((value - min) / (max - min)) * 100;

  const handleSlider = (raw: number) => {
    if (!hasMarks) {
      onChange(raw);
      return;
    }
    const snapped = marks.find(
      (m) => Math.abs(valueToPos(m.value, stops) - raw) <= SNAP_DISTANCE
    );
    onChange(
      snapped ? snapped.value : clamp(posToValue(raw, stops, step), min, max)
    );
  };

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
        <div className="flex flex-col gap-2">
          <input
            type="range"
            aria-label={label}
            aria-valuetext={`${format(value)} ${unit}`}
            min={hasMarks ? 0 : min}
            max={hasMarks ? SCALE : max}
            step={hasMarks ? 1 : step}
            value={sliderValue}
            disabled={disabled}
            onChange={(e) => handleSlider(Number(e.target.value))}
            className="sip-range w-full"
            style={{
              background: `linear-gradient(to right, ${ACCENT} ${percent}%, var(--card-border) ${percent}%)`,
            }}
          />
          {hasMarks && (
            <div className="relative h-5" aria-hidden="true">
              {marks.map((m) => {
                const pos = valueToPos(m.value, stops) / SCALE;
                const active = m.value === value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    tabIndex={-1}
                    disabled={disabled}
                    onClick={() => onChange(m.value)}
                    className={`absolute top-0 -translate-x-1/2 text-xs tabular-nums transition-opacity hover:cursor-pointer disabled:cursor-not-allowed ${
                      active ? "font-semibold text-[#22a352]" : "opacity-50 hover:opacity-100"
                    }`}
                    style={{
                      // Align with the thumb centre, which travels THUMB/2 in from each edge.
                      left: `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${pos})`,
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
