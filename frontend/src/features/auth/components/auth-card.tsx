import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/** Navy glass panel that frames the login and sign-up forms. */
export function AuthCard({ title, description, children, footer, className }: AuthCardProps) {
  return (
    <section
      className={cn(
        "relative w-full max-w-sm rounded-[28px] border border-white/10 p-7 sm:p-8",
        "bg-linear-to-b from-primary/95 to-[color-mix(in_srgb,var(--primary)_55%,var(--background))]/95",
        "shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7),inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-md",
        className,
      )}
    >
      <h1 className="font-display text-xl font-black tracking-tight uppercase sm:text-2xl">
        {title}
      </h1>
      <p className="mt-2 text-xs text-foreground/75">{description}</p>
      <div className="mt-6">{children}</div>
      {footer && <div className="mt-5 text-center text-xs text-foreground/75">{footer}</div>}
    </section>
  );
}
