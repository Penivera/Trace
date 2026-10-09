import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

/** Light text field for use on navy surfaces. Pass `aria-invalid` to show the error state. */
export function Input({ className, type = "text", ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-10 w-full rounded-md border-2 border-transparent bg-white px-3 text-sm text-background",
        "transition-[border-color,box-shadow] placeholder:text-gray-500",
        "focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_30%,transparent)] focus-visible:outline-none",
        "aria-invalid:border-destructive",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
