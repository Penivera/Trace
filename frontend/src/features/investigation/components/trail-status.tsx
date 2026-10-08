import { ArrowRight, Zap } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import type { Workspace } from "../data";
import { Panel, PanelLabel } from "./panel";

type TrailStatusProps = {
  trail: Workspace["trail"];
  currentWalletId: string;
  walletHref: (walletId: string) => Route;
  /** Case solved: the whole trail is revealed. */
  solved?: boolean;
};

/** The wallets the funds passed through, with the one under investigation highlighted. */
export function TrailStatus({
  trail,
  currentWalletId,
  walletHref,
  solved = false,
}: TrailStatusProps) {
  return (
    <Panel aria-labelledby="trail-status" className="px-[18px] pt-[22px] pb-5">
      <PanelLabel id="trail-status" icon={Zap}>
        Trail status
      </PanelLabel>

      <ol className="relative mt-4 flex flex-col gap-[13px]">
        {/* Connector running through the step numbers. */}
        <span aria-hidden className="absolute top-6 bottom-6 left-[27px] w-px bg-[#1e3a8a]" />
        {trail.map((wallet, i) => {
          const current = !solved && wallet.id === currentWalletId;
          const lit = current || solved;
          return (
            <li key={wallet.id} className="relative">
              <Link
                href={walletHref(wallet.id)}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex h-[49px] items-center gap-3 rounded-[10px] border px-[18px] transition-colors",
                  current && "border-accent/80 bg-[#0b1f66]",
                  solved && "border-accent/50 bg-[#0b1f66] hover:border-accent",
                  !lit && "border-transparent bg-[#050f36]/80 hover:border-white/15",
                )}
              >
                <span
                  className={cn(
                    "grid size-[19px] shrink-0 place-items-center rounded-full text-[9px] font-bold",
                    lit ? "bg-accent text-accent-foreground" : "bg-[#0f2470] text-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[11px] font-semibold">{wallet.label}</span>
                  <span
                    className={cn(
                      "block font-mono text-[9px]",
                      lit ? "text-accent/80" : "text-[#8f98b3]",
                    )}
                  >
                    {wallet.address}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}

/** Pinned evidence count with a shortcut to the notebook. */
export function EvidenceSummary({ count, notebookHref }: { count: number; notebookHref: Route }) {
  return (
    <Panel aria-labelledby="evidence-summary" className="px-[18px] py-5">
      <PanelLabel id="evidence-summary" italic>
        Evidence ({count})
      </PanelLabel>
      <p className="mt-3 text-[11px] leading-relaxed text-foreground/85">
        {count === 0
          ? "No evidence yet. Investigate transactions and wallets, then pin what matters."
          : `${count} item${count === 1 ? "" : "s"} pinned to your notebook.`}
      </p>
      <Link
        href={notebookHref}
        className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent hover:underline"
      >
        Open Notebook
        <ArrowRight className="size-3.5" />
      </Link>
    </Panel>
  );
}
