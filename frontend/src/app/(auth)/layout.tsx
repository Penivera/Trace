import Link from "next/link";

import { BrandBackdrop } from "@/components/layout/brand-backdrop";
import { siteConfig } from "@/config/site";

/** Login / sign-up: logo only, no main navigation, so the form is the single focus. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative isolate flex min-h-svh flex-1 flex-col overflow-hidden">
      <BrandBackdrop fadeBottom={false} />
      <header className="relative z-20 mx-auto flex h-20 w-full max-w-7xl items-center px-5 sm:px-8">
        <Link
          href="/"
          className="font-display text-lg font-black tracking-wider uppercase sm:text-xl"
        >
          {siteConfig.name}
        </Link>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
