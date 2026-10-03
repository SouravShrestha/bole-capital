import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  color?: string;
};

export function SketchedBracketIcon({
  color = "currentColor",
  ...props
}: Props) {
  return (
    <svg
      width="94"
      height="66"
      viewBox="0 0 94 66"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M25 1H11.07C4.04995 1 0.399952 5 1.61995 11.5C3.68995 22.55 3.05995 38.92 1.61995 50C0.519952 58.43 5.11995 61.27 13.33 61C37.45 60.2 63.15 58.67 92.62 59.7M63.8499 65.17C69.6199 64 78.18 63.71 91.73 65.17"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
