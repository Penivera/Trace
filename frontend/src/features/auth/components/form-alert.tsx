import { CircleAlert } from "lucide-react";

/** Form-level message (e.g. a failed submission). Announced by screen readers. */
export function FormAlert({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
    >
      <CircleAlert className="mt-px size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
