import { ArrowUpRight, Check, ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { formatSol } from "@/lib/solana/format";
import { cn } from "@/lib/utils/cn";

import type { TimelineEntry } from "../data";
import { Panel, PanelLabel } from "./panel";

function EntryIcon({ entry }: { entry: TimelineEntry }) {
  const incoming = entry.direction === "in";
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-[8px] border",
        incoming && "border-[rgb(16_185_129/0.25)] bg-[rgb(16_185_129/0.1)] text-[#34d399]",
        !incoming && entry.flagged && "border-accent bg-accent/25 text-accent",
        !incoming && !entry.flagged && "border-white/10 bg-[rgb(51_65_85/0.3)] text-[#94a3b8]",
      )}
    >
      {incoming ? (
        <Check className="size-3.5" strokeWidth={2.5} />
      ) : (
        <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
      )}
    </span>
  );
}

type ActivityTimelineProps = {
  entries: TimelineEntry[];
  /** Case solved: the heading turns amber. */
  solved?: boolean;
  entryHref: (entryId: string) => Route;
};

/** Transfers in and out of the wallet under investigation, oldest first. */
export function ActivityTimeline({ entries, entryHref, solved = false }: ActivityTimelineProps) {
  return (
    <Panel aria-labelledby="activity-timeline" className="flex flex-col gap-4 p-[25px]">
      <PanelLabel id="activity-timeline" tone={solved ? "accent" : "muted"}>
        Activity timeline
      </PanelLabel>

      <ol className="flex flex-col gap-3">
        {entries.map((entry) => {
          const incoming = entry.direction === "in";
          const amount = `${incoming ? "+" : "-"}${formatSol(entry.amountLamports)} SOL`;
          return (
            <li key={entry.id}>
              <Link
                href={entryHref(entry.id)}
                className={cn(
                  "flex items-center gap-3.5 rounded-[12px] border p-[15px] transition-colors",
                  entry.flagged
                    ? "border-accent bg-linear-to-r from-accent/15 via-[rgb(1_27_85/0.4)] to-transparent shadow-[0_0_20px_rgb(252_163_17/0.18)]"
                    : "border-white/5 bg-[rgb(0_6_20/0.4)] hover:border-white/15",
                )}
              >
                <EntryIcon entry={entry} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p
                    className={cn(
                      "flex items-center gap-2 font-mono text-[12px] leading-4",
                      entry.flagged ? "text-[#cbd5e1]" : "text-[#94a3b8]",
                    )}
                  >
                    <time>{entry.time}</time>
                    {entry.flagged && (
                      <span className="rounded-[4px] border border-accent/60 bg-accent/20 px-[7px] py-[3px] text-[10px] leading-[15px] font-bold tracking-[0.5px] text-accent uppercase shadow-[0_0_8px_rgb(252_163_17/0.25)]">
                        Suspicious
                      </span>
                    )}
                  </p>
                  <p className="flex min-w-0 items-center gap-1.5">
                    <span
                      className={cn(
                        "font-roboto text-[14px] leading-5",
                        incoming
                          ? "font-bold text-[#34d399]"
                          : entry.flagged
                            ? "font-bold text-accent"
                            : "font-medium text-[#cbd5e1]",
                      )}
                    >
                      {amount}
                    </span>
                    <span
                      className={cn(
                        "truncate font-mono text-[12px] leading-4",
                        entry.flagged
                          ? "text-[#e2e8f0]"
                          : entry.counterparty
                            ? "text-[#cbd5e1]"
                            : "text-[#94a3b8]",
                      )}
                    >
                      {incoming ? "from" : "to"} {entry.counterparty ?? "..."}
                    </span>
                  </p>
                </div>
                <ChevronRight
                  className={cn("size-4", entry.flagged ? "text-accent" : "text-[#64748b]")}
                  strokeWidth={2}
                />
              </Link>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
