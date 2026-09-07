import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline-light";
type Size = "sm" | "md" | "lg";

const base =
  "focus-ring inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink-soft",
  secondary: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper",
  ghost: "bg-transparent text-ink hover:bg-surface",
  "outline-light": "bg-transparent text-paper border border-paper/60 hover:bg-paper hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs tracking-wide uppercase",
  md: "px-5 py-3 text-xs tracking-wide uppercase",
  lg: "px-7 py-4 text-sm tracking-wide uppercase",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

type LinkButtonProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type Props = LinkButtonProps | NativeButtonProps;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Props) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return <Link href={href} className={classes} {...rest} />;
  }

  return <button className={classes} {...(props as NativeButtonProps)} />;
}
