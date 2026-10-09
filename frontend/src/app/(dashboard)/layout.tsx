import Link from "next/link";

import { DashboardSidebar, DashboardTabs } from "@/components/layout/dashboard-nav";
import { GameBackdrop } from "@/components/layout/game-backdrop";
import { UserMenu } from "@/components/layout/user-menu";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/features/auth/session";
import { caseRoutes } from "@/features/cases/routes";
import { getDashboardSummary } from "@/features/dashboard/data";

/**
 * Signed-in game shell: sticky header, compact side rail, page content. Pages
 * are built in 1728px-canvas px and scaled down on narrower desktops by
 * `.design-canvas`.
 * - Header 72px; rail 16px in from the left and 16px below the header.
 * - `<main>` starts 32px right of the rail (canvas x=296, y=88). It is the
 *   positioning context for page art, so art stays aligned with the content
 *   whatever the shell measures. Art may overflow it; the root clips with
 *   `overflow-clip` (not `overflow-hidden`, which would make the root a scroll
 *   container and break the sticky header and rail).
 */
export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const [user, progress] = await Promise.all([getCurrentUser(), getDashboardSummary()]);

  return (
    <div className="design-canvas relative isolate flex min-h-svh flex-1 flex-col overflow-clip">
      <GameBackdrop />

      {/* Stays on top while the page scrolls; content blurs and fades out beneath it. */}
      {/* Blur lives on child layers, not the header: an element with
          backdrop-filter becomes a "backdrop root", and the fade strip inside
          it could then only blur the header, not the page. */}
      <header className="sticky top-0 isolate z-40 flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-4 lg:h-[72px] lg:pr-6 lg:pl-8">
        <span
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-r from-[rgb(2_8_28/0.4)] to-[rgb(9_37_130/0.4)] backdrop-blur-[6px]"
        />
        {/* Turns the bar more opaque over the first 120px of scroll (CSS scroll timeline). */}
        <span
          aria-hidden
          className="scroll-solidify absolute inset-0 -z-10 bg-linear-to-r from-[rgb(2_8_28/0.85)] to-[rgb(9_37_130/0.8)] opacity-0"
        />
        {/* Soft edge: a blur that fades from full strength to none below the bar. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-full h-10 bg-linear-to-b from-[rgb(2_8_28/0.55)] to-transparent mask-b-from-0% backdrop-blur-[6px] lg:h-14"
        />
        <Link
          href="/"
          className="font-display text-xl leading-[1.62] font-black tracking-wide uppercase lg:text-[24px]"
        >
          {siteConfig.name}
        </Link>
        <UserMenu displayName={user.displayName} avatar={user.avatar} />
      </header>

      {/* Bottom space lives on <main>, not here: the sticky rail can't move
          past this row's content box, so padding here would cut its travel. */}
      <div className="flex flex-1 flex-col gap-6 px-4 pt-5 lg:flex-row lg:gap-8 lg:pt-4 lg:pr-0 lg:pl-4">
        <DashboardSidebar
          progress={progress}
          resumeHref={progress.activeCase ? caseRoutes.workspace(progress.activeCase.id) : null}
        />
        <DashboardTabs />
        <main className="min-w-0 flex-1 pb-12 lg:relative lg:pb-16">{children}</main>
      </div>
    </div>
  );
}
