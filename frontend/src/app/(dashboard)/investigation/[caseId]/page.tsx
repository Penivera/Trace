import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/features/auth/session";
import { caseIds } from "@/features/cases/data";
import { caseRoutes } from "@/features/cases/routes";
import { ActivityTimeline } from "@/features/investigation/components/activity-timeline";
import { CaseProgress } from "@/features/investigation/components/case-progress";
import { InvestigatorStatus } from "@/features/investigation/components/investigator-status";
import { LeadDialog } from "@/features/investigation/components/lead-dialog";
import { EvidenceSummary, TrailStatus } from "@/features/investigation/components/trail-status";
import { WalletOverview } from "@/features/investigation/components/wallet-overview";
import { getWorkspace, isSolved } from "@/features/investigation/data";
import { getSelectedInvestigator } from "@/features/investigators/selection";

type Props = PageProps<"/investigation/[caseId]">;

export function generateStaticParams() {
  return caseIds.map((caseId) => ({ caseId }));
}

export const metadata: Metadata = {
  title: "Investigation workspace",
};

async function WorkspaceContent({ params, searchParams }: Props) {
  const [{ caseId }, query, investigator, user] = await Promise.all([
    params,
    searchParams,
    getSelectedInvestigator(),
    getCurrentUser(),
  ]);
  // MOCK: `?preview=solved` shows the finished-case state until the backend tracks progress.
  const workspace = await getWorkspace(caseId, query.preview === "solved" ? "solved" : undefined);
  if (!workspace) notFound();

  const solved = isSolved(workspace);
  const firstName = user.displayName.split(" ")[0] ?? user.displayName;

  const walletHref = (walletId: string) => caseRoutes.wallet(caseId, walletId);

  return (
    <div className="grid gap-6 xl:ml-[3px] xl:grid-cols-[238px_minmax(0,496px)_238px] xl:gap-[27px]">
      {/* Left: who is investigating and how far along they are. */}
      <div className="flex flex-col gap-[29px] xl:order-1">
        <div className="relative hidden h-[126px] xl:block">
          {/* Bust overflows downward; the progress panel covers the lower body. */}
          <Image
            src={investigator.image.src}
            alt={investigator.description}
            width={investigator.image.width}
            height={investigator.image.height}
            sizes="140px"
            loading="eager"
            className="absolute bottom-[-64px] left-[-10px] h-[205px] w-auto max-w-none"
          />
        </div>
        <div className="relative z-10">
          <CaseProgress objectives={workspace.objectives} />
        </div>
        <InvestigatorStatus
          {...workspace.investigator}
          hint={workspace.hint}
          // Solving the case promotes the player from "Rookie Investigator".
          title={solved ? `Investigator ${firstName}` : undefined}
        />
      </div>

      {/* Centre: the wallet under investigation and its activity. */}
      <div className="order-first flex flex-col xl:order-2 xl:pt-[13px]">
        <p className="font-display text-xl font-black tracking-tight text-accent uppercase italic">
          {workspace.caseNumber} — {workspace.codename}
        </p>
        <h1 className="mt-[18px] font-display text-[clamp(1.5rem,2.1vw,1.875rem)] leading-none font-black tracking-tight uppercase">
          Investigation workspace
        </h1>
        <div className="mt-[37px] flex flex-col gap-5">
          <WalletOverview
            wallet={workspace.investigating}
            walletHref={walletHref(workspace.investigating.id)}
          />
          {solved && (
            <Link
              href={caseRoutes.outcome(caseId)}
              className={buttonVariants({
                className: "h-[49px] w-full font-display text-[13px] font-black",
              })}
            >
              See trace outcome
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </Link>
          )}
          <ActivityTimeline
            entries={workspace.timeline}
            entryHref={(id) => caseRoutes.transaction(caseId, id)}
            solved={solved}
          />
        </div>
      </div>

      {/* Right: where the money has been, and what you've pinned. */}
      <div className="flex flex-col gap-[21px] xl:order-3 xl:pt-[126px]">
        <TrailStatus
          trail={workspace.trail}
          currentWalletId={workspace.investigating.id}
          solved={solved}
          walletHref={walletHref}
        />
        <EvidenceSummary
          count={workspace.evidenceCount}
          notebookHref={caseRoutes.evidence(caseId)}
        />
      </div>

      {workspace.lead && (
        <LeadDialog
          lead={workspace.lead}
          actionHref={caseRoutes.target(caseId, workspace.lead.target)}
        />
      )}
    </div>
  );
}

export default function WorkspacePage(props: Props) {
  return (
    <Suspense>
      <WorkspaceContent {...props} />
    </Suspense>
  );
}
