import { Plus } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

/** Opens the evidence page for the case (styled as the amber "Add to Evidence" button). */
export function AddToEvidenceLink({ href, className }: { href: Route; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-9 items-center gap-2 rounded-lg bg-accent px-4 text-xs font-semibold text-accent-foreground",
        "shadow-[0_6px_18px_-6px_var(--accent)] transition-[filter] hover:brightness-110",
        className,
      )}
    >
      <Plus className="size-4" strokeWidth={2.5} />
      Add to Evidence
    </Link>
  );
}
