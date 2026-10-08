import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/** Translucent navy card used for every workspace section. */
export function Panel({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "rounded-[14px] border border-white/10 bg-linear-to-b from-[#0b1d5a]/85 to-[#06123f]/85",
        "shadow-[0_24px_60px_-24px_rgb(0_0_0/0.75)] backdrop-blur-[2px]",
        className,
      )}
      {...props}
    />
  );
}

/** Monospace section label, e.g. "CASE PROGRESS". */
export function PanelLabel({
  icon: Icon,
  tone = "accent",
  italic,
  id,
  children,
}: {
  icon?: LucideIcon;
  tone?: "accent" | "muted";
  italic?: boolean;
  id?: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.18em] uppercase",
        tone === "accent" ? "text-accent" : "text-[#8f98b3]",
        italic && "italic",
      )}
    >
      {Icon && <Icon className="size-3.5" strokeWidth={2} />}
      {children}
    </h2>
  );
}
