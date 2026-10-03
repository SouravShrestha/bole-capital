import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  color?: string;
};

export function ArrowIcon({
  color = "#FAFAFA",
  ...props
}: Props) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <g clipPath="url(#clip0_29_681)">
        <path d="M12.5992 1.56903L6.66056 0.713189L6.51792 1.70296L11.7568 2.45796L0.125196 11.1593L0.724119 11.9599L12.3557 3.25858L11.6007 8.49746L12.5905 8.6401L13.4463 2.70145C13.525 2.15559 13.1451 1.6477 12.5992 1.56903Z" fill={color}/>
      </g>
      <defs>
        <clipPath id="clip0_29_681">
          <rect width="12" height="12" fill="#fafafa" transform="translate(1.71169) rotate(8.20069)"/>
        </clipPath>
      </defs>
    </svg>
  );
}
