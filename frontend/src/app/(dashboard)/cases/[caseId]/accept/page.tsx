import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getCurrentUser } from "@/features/auth/session";
import { CaseOffer } from "@/features/cases/components/case-offer";
import { caseIds, getCaseBrief } from "@/features/cases/data";
import { caseRoutes } from "@/features/cases/routes";
import { SpotlightInvestigator } from "@/features/investigators/components/spotlight-investigator";
import { getSelectedInvestigator } from "@/features/investigators/selection";

type Props = PageProps<"/cases/[caseId]/accept">;

export function generateStaticParams() {
  return caseIds.map((caseId) => ({ caseId }));
}

export const metadata: Metadata = {
  title: "Accept the case",
};

async function CaseOfferContent({ params }: Pick<Props, "params">) {
  const [{ caseId }, user, investigator] = await Promise.all([
    params,
    getCurrentUser(),
    getSelectedInvestigator(),
  ]);
  const caseBrief = await getCaseBrief(caseId);
  if (!caseBrief) notFound();

  return (
    <>
      <CaseOffer
        agentName={user.displayName.split(" ")[0] ?? user.displayName}
        caseTitle={caseBrief.title}
        rejectHref="/dashboard"
        // TODO: record acceptance with the backend before opening the case file.
        acceptHref={caseRoutes.file(caseId)}
      />
      {/* Relative to <main>; the beam rises up behind the header. */}
      <SpotlightInvestigator
        investigator={investigator}
        className="absolute! top-[-153px] left-[870px] hidden lg:block"
      />
    </>
  );
}

export default function CaseOfferPage(props: Props) {
  return (
    <Suspense>
      <CaseOfferContent {...props} />
    </Suspense>
  );
}
