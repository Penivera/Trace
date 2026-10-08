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
        "grid size-[27px] shrink-0 place-items-center rounded-md border",
        incoming && "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
        !incoming && entry.flagged && "border-accent/60 bg-accent/20 text-accent",
        !incoming && !entry.flagged && "border-white/10 bg-white/5 text-white/60",
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
    <Panel aria-labelledby="activity-timeline" className="px-[22px] pt-[22px] pb-[22px]">
      <PanelLabel id="activity-timeline" tone={solved ? "accent" : "muted"}>
        Activity timeline
      </PanelLabel>

      <ol className="mt-4 flex flex-col gap-[13px]">
        {entries.map((entry) => {
          const incoming = entry.direction === "in";
          const amount = `${incoming ? "+" : "-"}${formatSol(entry.amountLamports)} SOL`;
          return (
            <li key={entry.id}>
              <Link
                href={entryHref(entry.id)}
                className={cn(
                  "flex h-[53px] items-center gap-3.5 rounded-[10px] border px-4 transition-colors",
                  entry.flagged
                    ? "border-accent bg-linear-to-r from-accent/10 to-transparent shadow-[0_0_18px_-6px_var(--accent)]"
                    : "border-white/[0.05] bg-[#050f36]/70 hover:border-white/15",
                )}
              >
                <EntryIcon entry={entry} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-mono text-[9.5px] text-[#8f98b3]">
                    <time>{entry.time}</time>
                    {entry.flagged && (
                      <span className="rounded border border-accent/60 bg-accent/10 px-1.5 py-px text-[8px] tracking-wider text-accent uppercase">
                        Suspicious
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-[11px]">
                    <span
                      className={cn(
                        "font-bold",
                        incoming
                          ? "text-emerald-400"
                          : entry.flagged
                            ? "text-accent"
                            : "text-foreground",
                      )}
                    >
                      {amount}
                    </span>{" "}
                    <span className="font-mono text-[10px] text-[#8f98b3]">
                      {incoming ? "from" : "to"} {entry.counterparty ?? "..."}
                    </span>
                  </p>
                </div>
                <ChevronRight
                  className={cn("size-4", entry.flagged ? "text-accent" : "text-white/40")}
                />
              </Link>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
