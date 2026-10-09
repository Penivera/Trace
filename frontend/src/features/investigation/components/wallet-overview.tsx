import { ArrowRight, ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { formatSol } from "@/lib/solana/format";

import type { Workspace } from "../data";
import { Panel } from "./panel";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <dt className="font-mono text-[11px] leading-[16.5px] font-medium tracking-[0.55px] text-[#94a3b8] uppercase">
        {label}
      </dt>
      <dd className="font-roboto text-[19px] leading-8 font-black whitespace-nowrap sm:text-[24px]">
        {value}
      </dd>
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
    <Panel
      aria-labelledby="investigating-wallet"
      className="flex flex-col gap-1 p-[25px] font-roboto"
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-[21px]">
        <div>
          <p className="text-[10px] leading-[15px] font-bold tracking-[0.5px] text-accent uppercase">
            Investigating
          </p>
          <h2
            id="investigating-wallet"
            className="text-[20px] leading-7 font-bold tracking-[0.5px]"
          >
            {wallet.label}
          </h2>
        </div>
        <Link
          href={walletHref}
          className="flex items-center gap-1.5 rounded-[8px] border border-white/10 bg-[rgb(0_36_114/0.4)] px-[15px] py-[7px] text-[12px] leading-4 font-bold shadow-[0_1px_2px_rgb(0_0_0/0.05)] transition-colors hover:border-white/25"
        >
          Open Wallet
          <ArrowRight className="size-3.5 text-accent" strokeWidth={2} />
        </Link>
      </div>

      <dl className="grid grid-cols-3 divide-x divide-white/5 py-4">
        <Stat label="Balance" value={`${formatSol(wallet.balanceLamports)} SOL`} />
        <Stat label="Transactions" value={wallet.transactionCount.toLocaleString("en-US")} />
        <Stat label="Tokens" value={wallet.tokenCount.toLocaleString("en-US")} />
      </dl>

      <div className="flex items-center justify-between border-t border-white/5 pt-[13px]">
        <span className="font-mono text-[12px] leading-4 text-[#cbd5e1]">{wallet.address}</span>
        <Link
          href={walletHref}
          className="flex items-center gap-1 text-[12px] leading-4 font-medium text-accent hover:underline"
        >
          Details
          <ChevronRight className="size-3.5" strokeWidth={2} />
        </Link>
      </div>
    </Panel>
  );
}
