import { ArrowRight, ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { formatSol } from "@/lib/solana/format";

import type { Workspace } from "../data";
import { Panel } from "./panel";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-2 py-[18px]">
      <dt className="font-mono text-[9.5px] tracking-[0.12em] text-[#8f98b3] uppercase">{label}</dt>
      <dd className="text-lg leading-none font-bold">{value}</dd>
    </div>
  );
}

type WalletOverviewProps = {
  wallet: Workspace["investigating"];
  walletHref: Route;
};

/** The wallet currently under investigation: headline numbers and address. */
export function WalletOverview({ wallet, walletHref }: WalletOverviewProps) {
  return (
    <Panel aria-labelledby="investigating-wallet" className="px-[22px]">
      <div className="flex items-center justify-between gap-4 pt-[22px] pb-[18px]">
        <div>
          <p className="font-display text-[8.5px] font-black tracking-[0.12em] text-accent uppercase">
            Investigating
          </p>
          <h2 id="investigating-wallet" className="mt-1 text-base font-semibold">
            {wallet.label}
          </h2>
        </div>
        <Link
          href={walletHref}
          className="flex h-6 items-center gap-1.5 rounded-md border border-white/10 bg-[#0b1d5e] px-3 text-[10px] font-medium transition-colors hover:border-white/25"
        >
          Open Wallet
          <ArrowRight className="size-3 text-accent" />
        </Link>
      </div>

      <dl className="grid grid-cols-3 divide-x divide-white/[0.07] border-y border-white/[0.07]">
        <Stat label="Balance" value={`${formatSol(wallet.balanceLamports)} SOL`} />
        <Stat label="Transactions" value={wallet.transactionCount.toLocaleString("en-US")} />
        <Stat label="Tokens" value={wallet.tokenCount.toLocaleString("en-US")} />
      </dl>

      <div className="flex items-center justify-between py-4">
        <span className="font-mono text-[10px] text-[#8f98b3]">{wallet.address}</span>
        <Link
          href={walletHref}
          className="flex items-center gap-1 text-[10px] font-semibold text-accent hover:underline"
        >
          Details
          <ChevronRight className="size-3" />
        </Link>
      </div>
    </Panel>
  );
}
