import Link from "next/link";

import { BrandBackdrop } from "@/components/layout/brand-backdrop";
import { DashboardSidebar, DashboardTabs } from "@/components/layout/dashboard-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/features/auth/session";

/**
 * Signed-in game shell: top bar, sidebar navigation, page content.
 * The root div is the positioning context for full-bleed page art
 * (e.g. the featured investigator on the dashboard), so inner wrappers
 * deliberately avoid `relative`.
 */
export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <div className="relative isolate flex min-h-svh flex-1 flex-col overflow-hidden">
      <BrandBackdrop fadeBottom={false} />

      <header className="z-20 flex h-[74px] shrink-0 items-center justify-between border-b border-white/10 bg-background/60 px-4 backdrop-blur-sm lg:pr-[23px]">
        <Link
          href="/"
          className="font-display text-lg font-black tracking-wider uppercase sm:text-xl"
        >
          {siteConfig.name}
        </Link>
        <UserMenu displayName={user.displayName} avatar={user.avatar} />
      </header>

      <div className="flex flex-1 flex-col gap-6 px-4 pt-5 pb-12 lg:flex-row lg:pt-[51px] lg:pr-[26px] lg:pb-[90px] lg:pl-[31px]">
        <DashboardSidebar />
        <DashboardTabs />
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Decorative base strip from the design; page art may overlap it. */}
      <div
        aria-hidden
        className="h-[53px] shrink-0 border-t border-[#1b3a9e]/70 bg-linear-to-b from-[#0a1f6e] to-[#071856]"
      />
    </div>
  );
}
