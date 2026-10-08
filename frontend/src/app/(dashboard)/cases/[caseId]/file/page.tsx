import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CaseFile } from "@/features/cases/components/case-file";
import { caseIds, getCaseFile } from "@/features/cases/data";
import { caseRoutes } from "@/features/cases/routes";
import { InvestigatorStanding } from "@/features/investigators/components/investigator-standing";
import { getSelectedInvestigator } from "@/features/investigators/selection";

type Props = PageProps<"/cases/[caseId]/file">;

export function generateStaticParams() {
  return caseIds.map((caseId) => ({ caseId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const caseFile = await getCaseFile((await params).caseId);
  return { title: caseFile ? `${caseFile.number}: ${caseFile.codename}` : "Case not found" };
}

async function CaseFileContent({ params }: Pick<Props, "params">) {
  const [{ caseId }, investigator] = await Promise.all([params, getSelectedInvestigator()]);
  const caseFile = await getCaseFile(caseId);
  if (!caseFile) notFound();

  return (
    <div className="relative max-w-[644px] lg:mt-3 lg:ml-[26px]">
      <CaseFile caseFile={caseFile} beginHref={caseRoutes.workspace(caseId)} />
      {/* Stands just off the card's right edge, overlapping it slightly as in the design. */}
      <InvestigatorStanding
        investigator={investigator}
        sizes="328px"
        className="absolute top-0 left-[520px] hidden h-[783px] w-[328px] xl:block"
      />
    </div>
  );
}

export default function CaseFilePage(props: Props) {
  return (
    <Suspense>
      <CaseFileContent {...props} />
    </Suspense>
  );
}
