import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  color?: string;
};

export function DoubleUnderlineIcon({
  color = "currentColor",
  ...props
}: Props) {
  return (
    <svg width="101" height="9" viewBox="0 0 101 9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <g clipPath="url(#clip0_27_272)">
        <path d="M1 3.25998C27.87 -1.06002 67.05 2.36998 100 1.15998M70.77 7.99998C77.14 7.04998 80.44 7.99998 87.04 7.99998" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      </g>
      <defs>
        <clipPath id="clip0_27_272">
          <rect width="101" height="9" fill="#fafafa"/>
        </clipPath>
      </defs>
    </svg>
  );
}
