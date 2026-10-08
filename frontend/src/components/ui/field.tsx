import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type FieldProps = {
  /** Must match the `id` of the control rendered in `children`. */
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Label + control + error message. The control must set
 * `aria-describedby={fieldErrorId(id)}` and `aria-invalid` so screen readers
 * announce the error together with the field.
 */
export function Field({ id, label, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-medium text-foreground/90">
        {label}
      </label>
      {children}
      {error && (
        <p id={fieldErrorId(id)} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export const fieldErrorId = (id: string) => `${id}-error`;
