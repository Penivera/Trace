import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/** Translucent navy card used for every workspace section (Figma: Desktop - 8). */
export function Panel({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "relative rounded-[16px] border border-[rgb(0_36_114/0.55)] backdrop-blur-[8px]",
        "bg-[linear-gradient(135deg,rgb(1_27_85/0.5),rgb(0_6_20/0.72))]",
        "shadow-[0_10px_35px_-5px_rgb(0_6_20/0.8),0_0_1px_1px_rgb(255_255_255/0.05),inset_0_1px_0_rgb(255_255_255/0.1)]",
        className,
      )}
      {...props}
    />
  );
}

/** Section label, e.g. "CASE PROGRESS": JetBrains Mono, or Roboto italic. */
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
        "flex items-center gap-2 text-[12px] leading-4 tracking-[0.6px] uppercase",
        italic ? "font-roboto font-semibold italic" : "font-mono font-bold",
        tone === "accent" ? "text-accent" : "text-[#94a3b8]",
      )}
    >
      {Icon && <Icon className="size-4" strokeWidth={2} />}
      {children}
    </h2>
  );
}
