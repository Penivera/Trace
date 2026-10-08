"use client";

import { Check, Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Pins the current item to the evidence notebook.
 * TODO: call the evidence API; until then the "added" state is local to this page view.
 */
export function AddToEvidenceButton({ className }: { className?: string }) {
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setAdded(true)}
      disabled={added}
      aria-live="polite"
      className={cn(
        "flex h-9 items-center gap-2 rounded-lg bg-accent px-4 text-xs font-semibold text-accent-foreground",
        "shadow-[0_6px_18px_-6px_var(--accent)] transition-[filter] hover:brightness-110",
        "disabled:cursor-default disabled:bg-accent/80 disabled:hover:brightness-100",
        className,
      )}
    >
      {added ? (
        <Check className="size-4" strokeWidth={2.5} />
      ) : (
        <Plus className="size-4" strokeWidth={2.5} />
      )}
      {added ? "Added to Evidence" : "Add to Evidence"}
    </button>
  );
}
