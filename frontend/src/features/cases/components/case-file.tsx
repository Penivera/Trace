import { ArrowRight, ArrowRightLeft, Clock3, WalletCards, type LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { renderHighlights } from "@/lib/text/highlight";
import { cn } from "@/lib/utils/cn";

import type { CaseFile as CaseFileData } from "../data";

const STATUS_LABEL: Record<CaseFileData["status"], string> = {
  open: "Open",
  solved: "Solved",
  closed: "Closed",
};

function Label({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="font-display text-[10px] font-black tracking-[0.08em] text-accent uppercase"
    >
      {children}
    </h2>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex h-16 flex-col justify-center gap-2 rounded-lg border border-white/[0.07] bg-[#071538]/80 px-3.5">
      <dt className="flex items-center gap-1.5 font-display text-[8.5px] font-bold tracking-wide text-[#9aa3bd] uppercase italic">
        <Icon className="size-3 text-accent" strokeWidth={2} />
        {label}
      </dt>
      <dd className="font-display text-sm leading-none font-black">{value}</dd>
    </div>
  );
}

type CaseFileProps = {
  caseFile: CaseFileData;
  beginHref: Route;
  className?: string;
};

/** The case dossier: briefing, known facts and objectives, then "Begin investigation". */
export function CaseFile({ caseFile, beginHref, className }: CaseFileProps) {
  const { number, codename, difficulty, status, briefing, knownInformation, objectives } = caseFile;

  return (
    <article
      aria-labelledby="case-file-title"
      className={cn(
        "overflow-hidden rounded-[14px] border border-white/10",
        "bg-linear-to-b from-[#0a1f66]/95 via-[#071750]/95 to-[#050f38]/95",
        "shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)]",
        className,
      )}
    >
      <header className="border-b border-white/[0.07] px-[25px] pt-[46px] pb-[18px]">
        <p className="font-display text-[10px] font-black tracking-[0.08em] text-accent uppercase">
          {number}
        </p>
        <h1
          id="case-file-title"
          className="mt-3 font-display text-[26px] leading-none font-black tracking-tight uppercase"
        >
          {codename}
        </h1>
        <p className="mt-3 flex items-center gap-2 text-[11px] text-[#8e97b0]">
          <span>
            Difficulty: <span className="font-semibold text-foreground">{difficulty}</span>
          </span>
          <span aria-hidden>•</span>
          <span>
            Status: <span className="font-semibold text-accent">{STATUS_LABEL[status]}</span>
          </span>
        </p>
      </header>

      <div className="px-[25px] pt-[28px] pb-[18px]">
        <section aria-labelledby="case-file-briefing">
          <Label id="case-file-briefing">Briefing</Label>
          <div className="mt-2 flex flex-col gap-[14px] text-[11px] leading-[17px] text-foreground/90">
            {briefing.map((paragraph, i) => (
              <p key={i}>{renderHighlights(paragraph)}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="case-file-known" className="mt-6">
          <Label id="case-file-known">Known information</Label>
          <dl className="mt-2.5 grid gap-3 sm:grid-cols-3">
            <InfoCard
              icon={WalletCards}
              label="Initial wallet"
              value={knownInformation.initialWallet}
            />
            <InfoCard
              icon={ArrowRightLeft}
              label="Missing amount"
              value={knownInformation.missingAmount}
            />
            <InfoCard
              icon={Clock3}
              label="Approximate time"
              value={knownInformation.approximateTime}
            />
          </dl>
        </section>

        <section aria-labelledby="case-file-objectives" className="mt-6">
          <Label id="case-file-objectives">Your objectives</Label>
          <ol className="mt-2.5 flex flex-col gap-[9px]">
            {objectives.map((objective, i) => (
              <li
                key={i}
                className="flex h-[43px] items-center gap-3 rounded-md border border-white/[0.06] bg-[#06133f]/70 px-3.5 text-xs"
              >
                <span
                  aria-hidden
                  className="grid size-[19px] shrink-0 place-items-center rounded-full border border-accent/30 bg-[#2a1f12] text-[9px] font-bold text-accent"
                >
                  {i + 1}
                </span>
                {objective}
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-[42px] flex justify-center">
          <Link
            href={beginHref}
            className={buttonVariants({
              className: "h-[49px] w-full max-w-[475px] font-display text-[13px] font-black",
            })}
          >
            Begin investigation
            <ArrowRight className="size-4" strokeWidth={2.25} />
          </Link>
        </div>
      </div>
    </article>
  );
}
