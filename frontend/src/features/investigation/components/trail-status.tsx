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
    <Panel aria-labelledby="trail-status" className="flex flex-col gap-4 p-[21px] font-roboto">
      <PanelLabel id="trail-status" icon={Zap}>
        Trail status
      </PanelLabel>

      <ol className="relative flex flex-col gap-3">
        {/* Connector running through the step numbers. */}
        <span aria-hidden className="absolute top-8 bottom-6 left-5 w-0.5 bg-[rgb(0_36_114/0.8)]" />
        {trail.map((wallet, i) => {
          const current = !solved && wallet.id === currentWalletId;
          const lit = current || solved;
          return (
            <li key={wallet.id} className="relative">
              <Link
                href={walletHref(wallet.id)}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-[12px] border p-[13px] transition-colors",
                  lit
                    ? "border-accent/50 bg-linear-to-r from-[#011b55] to-[rgb(0_36_114/0.4)] shadow-[0_0_15px_rgb(252_163_17/0.1)] hover:border-accent"
                    : "border-white/5 bg-[rgb(0_6_20/0.5)] hover:border-white/15",
                )}
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[12px] leading-4",
                    lit
                      ? "border-accent bg-accent font-bold text-[#000614] drop-shadow-[0_0_4px_rgb(252_163_17/0.4)]"
                      : "border-white/10 bg-[#011b55] font-semibold text-[#cbd5e1]",
                  )}
                >
                  {i + 1}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span
                    className={cn(
                      "truncate text-[14px] leading-[17.5px]",
                      lit ? "font-bold text-white" : "font-medium text-[#e2e8f0]",
                    )}
                  >
                    {wallet.label}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[11px] leading-[16.5px]",
                      lit ? "text-accent" : "text-[#94a3b8]",
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
    <Panel
      aria-labelledby="evidence-summary"
      className="flex flex-col items-start gap-[11.3px] px-[21px] pt-[21px] pb-6 font-roboto"
    >
      <PanelLabel id="evidence-summary" italic>
        Evidence ({count})
      </PanelLabel>
      <p className="text-[12px] leading-[19.5px] text-[#cbd5e1]">
        {count === 0
          ? "No evidence yet. Investigate transactions and wallets, then pin what matters."
          : `${count} item${count === 1 ? "" : "s"} pinned to your notebook.`}
      </p>
      <Link
        href={notebookHref}
        className="inline-flex items-center gap-1.5 pt-[9.7px] text-[12px] leading-4 font-bold text-accent hover:underline"
      >
        Open Notebook
        <ArrowRight className="size-3.5" strokeWidth={2} />
      </Link>
    </Panel>
  );
}
