import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CaseBriefing, CaseBriefingSkeleton } from "@/features/cases/components/case-briefing";
import { caseIds, getCaseBrief } from "@/features/cases/data";
import { caseRoutes } from "@/features/cases/routes";
import { InvestigatorFigure } from "@/features/investigators/components/investigator-figure";
import { LeadInvestigatorPortrait } from "@/features/investigators/components/lead-investigator-portrait";
import { getSelectedInvestigator } from "@/features/investigators/selection";

type Props = PageProps<"/cases/[caseId]">;

export function generateStaticParams() {
  return caseIds.map((caseId) => ({ caseId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const caseBrief = await getCaseBrief((await params).caseId);
  return { title: caseBrief ? `${caseBrief.number}: ${caseBrief.title}` : "Case not found" };
}

async function CaseBriefingContent({ params }: Pick<Props, "params">) {
  const [{ caseId }, investigator] = await Promise.all([params, getSelectedInvestigator()]);
  const caseBrief = await getCaseBrief(caseId);
  if (!caseBrief) notFound();

  return (
    <CaseBriefing
      caseBrief={caseBrief}
      proceedHref={caseRoutes.offer(caseId)}
      companion={<InvestigatorFigure investigator={investigator} />}
    />
  );
}

/**
 * Not async: request data (`params`, the investigator cookie) is only awaited
 * inside the Suspense boundary, so navigating here shows the shell instantly.
 */
export default function CaseBriefingPage(props: Props) {
  return (
    <>
      <Suspense fallback={<CaseBriefingSkeleton />}>
        <CaseBriefingContent {...props} />
      </Suspense>
      {/* Positioned against the dashboard layout root, top-right. */}
      <LeadInvestigatorPortrait className="absolute top-[101px] right-[38px] hidden xl:block" />
    </>
  );
}
