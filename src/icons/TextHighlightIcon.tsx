import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  color?: string;
};

export function TextHighlightIcon({
  color = "#87ED82",
  ...props
}: Props) {
  const gradientId = `paint0_linear_highlight_${color.replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg width="160" height="29" viewBox="3.6 13.5 160 29" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true" {...props}>
      <path d="M5.406 15.8957C19.8291 13.6538 51.1598 14.6975 84.1358 13.9398C117.112 13.1822 145.144 14.0942 162.13 15.3049C163.29 17.9305 161.646 20.285 162.888 23.1871C161.41 26.2328 163.23 29.1337 162.329 32.3166C163.407 35.219 162.177 38.4026 163.336 41.1664C146.851 42.7209 117.169 41.6739 84.1926 42.2932C51.2164 42.9126 21.5368 42.972 5.12862 42.0368C3.80343 38.9966 5.85924 36.3646 4.61677 33.4626C5.84705 30.279 3.94558 27.6549 4.92853 24.4718C3.68578 21.4315 6.48414 19.0746 5.406 15.8957Z" fill={`url(#${gradientId})`}/>
      <defs>
        <linearGradient id={gradientId} x1="4.5775" y1="13.8687" x2="163.281" y2="13.5506" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} stopOpacity="0.35"/>
          <stop offset="0.035" stopColor={color} stopOpacity="0.9"/>
          <stop offset="0.08" stopColor={color}/>
          <stop offset="0.92" stopColor={color}/>
          <stop offset="0.965" stopColor={color} stopOpacity="0.9"/>
          <stop offset="1" stopColor={color} stopOpacity="0.35"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
