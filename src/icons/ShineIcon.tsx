import type { SVGProps } from "react";

interface ShineIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

export function ShineIcon({ color = "currentColor", ...props }: ShineIconProps) {
  return (
    <svg
      width="159"
      height="89"
      viewBox="0 0 159 89"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M8.83334 9.88889C6.56838 7.16945 4.07693 4.53241 1.35898 1.97778M149.215 17.8L151.526 15.3278M92.4103 11.125C92.7727 8.15834 93.2256 5.27408 93.7692 2.47223M24.3256 78.6167C21.3359 79.6056 18.618 81.707 16.0359 83.1903M95.1282 80.3472L96.4872 87.7639M151.933 70.3347C154.017 71.1588 156.01 72.1065 157.913 73.1778"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
