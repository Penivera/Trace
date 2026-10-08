"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

/** Vertical game navigation, large screens. */
export function DashboardSidebar() {
  const isActive = useIsActive();

  return (
    <aside
      className={cn(
        "relative hidden h-[837px] w-[294px] shrink-0 rounded-[28px] lg:block",
        "border border-white/5 bg-linear-to-b from-[#01040d] via-[#040c2c] via-55% to-[#0b2c94]",
        "shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)]",
      )}
    >
      <nav aria-label="Game">
        <ul className="mt-16 flex flex-col gap-[18px] px-4">
          {dashboardNav.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href} className="relative">
                {active && (
                  <span
                    aria-hidden
                    className="absolute top-1/2 -left-[11px] h-[19px] w-[5px] -translate-y-1/2 rounded-r-sm bg-accent"
                  />
                )}
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-[43px] items-center gap-[14px] rounded-full border px-[19px]",
                    "font-display text-[13px] font-black tracking-wide uppercase transition-colors",
                    active
                      ? "border-accent bg-linear-to-r from-[#0b1d5e] to-[#050d2e]/40 text-accent"
                      : "border-transparent text-[#9298a8] hover:text-foreground",
                  )}
                >
                  <Icon className="size-[17px]" strokeWidth={1.75} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

/** Horizontal, scrollable version of the same navigation below `lg`. */
export function DashboardTabs() {
  const isActive = useIsActive();

  return (
    <nav
      aria-label="Game"
      className="-mx-4 [scrollbar-width:none] overflow-x-auto px-4 lg:hidden [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex gap-2">
        {dashboardNav.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-full border px-4 whitespace-nowrap",
                  "font-display text-[11px] font-black tracking-wide uppercase",
                  active
                    ? "border-accent bg-[#0b1d5e] text-accent"
                    : "border-white/10 bg-background/60 text-[#a5aab8]",
                )}
              >
                <Icon className="size-4" strokeWidth={1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
