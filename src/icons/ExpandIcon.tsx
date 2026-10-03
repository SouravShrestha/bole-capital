import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  color?: string;
};

export function ExpandIcon({ color = "currentColor", ...props }: Props) {
  return (
    <svg
      width="32"
      height="13"
      viewBox="0 0 32 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <line
        y1={1.5}
        x2={32}
        y2={1.5}
        stroke={color}
        strokeWidth={3}
        fill={color}
      />
      <line
        y1={11.5}
        x2={32}
        y2={11.5}
        stroke={color}
        strokeWidth={3}
        fill={color}
      />
    </svg>
  );
}
