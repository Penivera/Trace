import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { caseRoutes } from "@/features/cases/routes";
import { EvidenceForm } from "@/features/evidence/components/evidence-form";
import { evidenceCaseIds, getEvidencePrompt } from "@/features/evidence/data";
import { getWorkspace } from "@/features/investigation/data";
import { InvestigatorPortrait } from "@/features/investigators/components/investigator-portrait";
import { getSelectedInvestigator } from "@/features/investigators/selection";

import { submitEvidence } from "./actions";

type Props = PageProps<"/evidence/[caseId]">;

export function generateStaticParams() {
  return evidenceCaseIds.map((caseId) => ({ caseId }));
}

export const metadata: Metadata = {
  title: "Add evidence",
};

async function EvidenceContent({ params }: Pick<Props, "params">) {
  const { caseId } = await params;
  const [prompt, workspace] = await Promise.all([getEvidencePrompt(caseId), getWorkspace(caseId)]);
  if (!prompt || !workspace) notFound();

  // Wallet choices are labelled from the case trail (single source of names/addresses).
  const destinations = prompt.destinationWalletIds.flatMap((id) => {
    const wallet = workspace.trail.find((w) => w.id === id);
    return wallet
      ? [{ value: id, label: `${wallet.label} (${wallet.address.replace(/\s+/g, "")})` }]
      : [];
  });

  return (
    <div className="relative max-w-[706px] lg:ml-[37px]">
      <Link
        href={caseRoutes.workspace(caseId)}
        aria-label="Back to the investigation workspace"
        className="grid size-[33px] place-items-center rounded-full bg-accent text-accent-foreground shadow-[0_0_14px_-4px_var(--accent)] transition-[filter] hover:brightness-110"
      >
        <ChevronLeft className="size-5" strokeWidth={2.5} />
      </Link>

      <h1 className="mt-[22px] font-display text-[clamp(1.5rem,2.1vw,1.875rem)] leading-none font-black tracking-tight uppercase">
        Add some evidence
      </h1>

      <section
        aria-labelledby="evidence-question"
        className="mt-[22px] rounded-[14px] border border-white/10 bg-linear-to-br from-[#050a24]/95 via-[#061247]/95 to-[#0a1d63]/95 px-5 pt-[33px] pb-[33px] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)] sm:px-[37px]"
      >
        <p className="font-display text-[9px] font-black tracking-[0.12em] text-accent uppercase">
          Build your evidence
        </p>
        <h2
          id="evidence-question"
          className="mt-2.5 font-display text-[26px] leading-none font-black tracking-tight uppercase"
        >
          Where did the{" "}
          <span className="bg-linear-to-r from-[#c9d4ee] to-[#8fa3cf] bg-clip-text text-transparent">
            funds go?
          </span>
        </h2>
        <p className="mt-2 text-xs text-[#8f98b3]">Assemble your evidence into a conclusion.</p>

        <div className="mt-[30px]">
          <EvidenceForm
            action={submitEvidence.bind(null, caseId)}
            destinations={destinations}
            scenarios={prompt.scenarios.map((s) => ({ value: s.id, label: s.label }))}
            theoryPlaceholder={prompt.theoryPlaceholder}
          />
        </div>
      </section>
    </div>
  );
}

export default function EvidencePage(props: Props) {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen" />}>
        <EvidenceContent params={props.params} />
      </Suspense>
      <Suspense fallback={null}>
        <Portrait />
      </Suspense>
    </>
  );
}

/** Positioned against the dashboard layout root, top-right. */
async function Portrait() {
  const investigator = await getSelectedInvestigator();
  return (
    <InvestigatorPortrait
      investigator={investigator}
      className="absolute top-[124px] right-[26px] hidden size-[200px] xl:block"
    />
  );
}
