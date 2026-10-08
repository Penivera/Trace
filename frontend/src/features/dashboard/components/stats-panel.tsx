import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import type { DashboardSummary } from "../data";

const cardClass = "rounded-[10px] border border-white/[0.07] bg-[#0d1019]";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${cardClass} flex h-[78px] flex-col justify-center gap-2.5 px-[17px]`}>
      <dt className="font-display text-[9.5px] font-bold tracking-[0.12em] text-[#8a8f9c] uppercase">
        {label}
      </dt>
      <dd className="text-lg leading-none font-semibold whitespace-pre text-accent tabular-nums">
        {value}
      </dd>
    </div>
  );
}

export function StatsPanel({
  summary,
  resumeHref,
}: {
  summary: DashboardSummary;
  resumeHref: Route;
}) {
  const { activeCase, objectives, evidenceCount, academy } = summary;
  const percent = objectives.total
    ? Math.round((objectives.completed / objectives.total) * 100)
    : 0;

  return (
    <section
      aria-label="Your progress"
      className="bg-linear-to-r from-[#030817]/95 via-[#051038]/90 to-[#0a226e]/85 px-4 py-5 sm:px-[44px] sm:pt-[31px] sm:pb-[31px] lg:mt-1.5"
    >
      <dl className="grid grid-cols-2 gap-[13px] xl:grid-cols-4">
        <StatCard label="Active case" value={activeCase ? activeCase.label.toUpperCase() : "—"} />
        <StatCard label="Objectives" value={`${objectives.completed} / ${objectives.total}`} />
        <StatCard label="Evidence" value={String(evidenceCount)} />
        <StatCard label="Academy" value={`${academy.completed}  /  ${academy.total}`} />
      </dl>

      {activeCase && (
        <div
          className={`${cardClass} mt-[13px] grid items-center gap-4 px-[17px] py-4 md:h-[64px] md:grid-cols-[minmax(0,285px)_minmax(0,373px)_1fr] md:py-0`}
        >
          <div>
            <p className="text-[13px] font-semibold">Investigation in progress</p>
            <p className="mt-0.5 text-xs text-[#7c8291]">Pick up where you left off.</p>
          </div>

          <div>
            <div className="flex items-center justify-between font-display text-[9px] font-bold uppercase">
              <span>
                {objectives.completed} of {objectives.total} objectives
              </span>
              <span className="text-accent">{percent}%</span>
            </div>
            <div
              role="progressbar"
              aria-label="Case objectives completed"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-[7px] h-[5px] overflow-hidden rounded-full bg-[#1d2130]"
            >
              <div
                className="h-full rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="flex md:justify-end md:pr-[30px]">
            <Link
              href={resumeHref}
              className={buttonVariants({
                size: "sm",
                className: "h-[31px] gap-1.5 px-5 font-display text-[11px] font-black",
              })}
            >
              Resume
              <ArrowRight className="size-3.5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
