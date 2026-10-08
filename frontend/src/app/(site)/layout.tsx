import { SiteHeader } from "@/components/layout/site-header";

/** Marketing and game pages: full site header with main navigation. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
