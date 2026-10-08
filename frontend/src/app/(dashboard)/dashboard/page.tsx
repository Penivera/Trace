import type { Metadata, Route } from "next";
import Image from "next/image";

import { StatsPanel } from "@/features/dashboard/components/stats-panel";
import { caseRoutes } from "@/features/cases/routes";
import { getDashboardSummary } from "@/features/dashboard/data";
import { InvestigatorPicker } from "@/features/investigators/components/investigator-picker";
import { featuredInvestigator, investigators } from "@/features/investigators/data";

import { selectInvestigator } from "./actions";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <>
      <StatsPanel
        summary={summary}
        resumeHref={
          summary.activeCase
            ? caseRoutes.workspace(summary.activeCase.id)
            : ("/investigation" as Route)
        }
      />

      <h2 className="mt-10 font-display text-2xl font-black tracking-tight uppercase lg:mt-[47px] lg:ml-2">
        Select investigator
      </h2>
      <div className="mt-[17px] lg:ml-[11px]">
        <InvestigatorPicker
          investigators={investigators}
          action={selectInvestigator}
          caseId={summary.activeCase?.id}
        />
      </div>

      {/* Positioned against the dashboard layout root: bottom-right, full-bleed. */}
      <Image
        src={featuredInvestigator.image.src}
        alt={featuredInvestigator.description}
        width={featuredInvestigator.image.width}
        height={featuredInvestigator.image.height}
        sizes="(min-width: 1280px) 520px, 0px"
        className="pointer-events-none absolute right-0 bottom-0 hidden h-[min(756px,52.5vw)] w-auto max-w-none select-none xl:block"
      />
    </>
  );
}
