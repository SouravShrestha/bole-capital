import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  color?: string;
};

export function SketchedLineIcon({ color = "currentColor", ...props }: Props) {
  return (
    <svg
      width="200"
      height="10"
      viewBox="0 0 200 10"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M1.5 6.2C22 3.1 46 2.4 74 3.8C102 5.2 128 4 152 2.9C168 2.2 184 2.6 198.5 3.4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
