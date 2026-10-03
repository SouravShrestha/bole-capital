import Link from "next/link";
import React from "react";

type IconButtonBaseProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

type IconButtonAsButton = IconButtonBaseProps & {
  as?: "button";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type IconButtonAsLink = IconButtonBaseProps & {
  as: "link";
  href: string;
  target?: string;
  rel?: string;
};

type IconButtonProps = IconButtonAsButton | IconButtonAsLink;

const baseClassName =
  "inline-flex items-center gap-2 px-6 py-3.5 sm:px-7 sm:py-4 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95";

const baseStyle: React.CSSProperties = {
  backgroundColor: "var(--fg)",
  color: "var(--bg)",
  fontFamily: "var(--font-poppins)",
};

export function IconButton(props: IconButtonProps) {
  const { children, icon, className = "", style } = props;

  const mergedClassName = `${baseClassName} ${className}`.trim();
  const mergedStyle = { ...baseStyle, ...style };

  if (props.as === "link") {
    const { href, target, rel } = props;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={mergedClassName}
        style={mergedStyle}
      >
        {children}
        {icon}
      </Link>
    );
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    as: _as,
    icon: _icon,
    children: _children,
    className: _className,
    style: _style,
    ...buttonProps
  } = props as IconButtonAsButton & { as?: "button" };
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return (
    <button className={mergedClassName} style={mergedStyle} {...buttonProps}>
      {children}
      {icon}
    </button>
  );
}
