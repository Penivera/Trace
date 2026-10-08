import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-bold tracking-wide whitespace-nowrap uppercase transition-[color,background-color,box-shadow,transform] duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0";

const variants = {
  /** Amber call-to-action. */
  primary:
    "bg-accent text-accent-foreground shadow-[0_0_24px_-6px_var(--accent)] hover:-translate-y-px hover:bg-[color-mix(in_srgb,var(--accent)_88%,white)] hover:shadow-[0_0_32px_-4px_var(--accent)] active:translate-y-0",
  /** Off-white, for secondary actions such as social sign-in. */
  light: "bg-foreground text-background normal-case hover:bg-white",
  /** Text-only, amber. */
  ghost: "text-accent hover:text-[color-mix(in_srgb,var(--accent)_80%,white)]",
} as const;

const sizes = {
  sm: "h-9 px-5 text-xs",
  md: "h-11 px-6 text-xs sm:text-sm",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

/**
 * Button classes, usable on any element. Use this to style a `<Link>` as a
 * button so navigation stays a real anchor (middle-click, prefetch, a11y).
 */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize };

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonVariants({ variant, size, className })} {...props} />;
}
