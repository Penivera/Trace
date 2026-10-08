import { Play, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

type CaseOfferProps = {
  agentName: string;
  caseTitle: string;
  rejectHref: Route;
  acceptHref: Route;
};

const iconTile = "grid size-[22px] place-items-center rounded-[5px] bg-background";
const action = "h-[59px] gap-2.5 px-6 font-display text-[15px] font-black tracking-normal";

/** "Agent X, will you take this case?" Accept or reject before the investigation starts. */
export function CaseOffer({ agentName, caseTitle, rejectHref, acceptHref }: CaseOfferProps) {
  return (
    <section aria-labelledby="case-offer-title" className="lg:pt-[159px] lg:pl-[53px]">
      <p className="font-display text-[28px] leading-none font-black tracking-tight text-accent uppercase">
        Agent {agentName}
      </p>
      <h1
        id="case-offer-title"
        className="mt-6 font-display text-[clamp(1.5rem,2vw,1.75rem)] leading-none font-black tracking-tight uppercase lg:mt-[48px]"
      >
        {caseTitle}
      </h1>

      <div className="mt-10 flex flex-wrap gap-4 sm:gap-5 lg:mt-[73px]">
        <Link
          href={rejectHref}
          className={buttonVariants({
            variant: "light",
            className: `${action} w-full uppercase sm:w-[227px]`,
          })}
        >
          <span className={iconTile}>
            <X className="size-3.5 text-white" strokeWidth={3} />
          </span>
          Reject trace
        </Link>
        <Link
          href={acceptHref}
          className={buttonVariants({ className: `${action} w-full sm:w-[280px]` })}
        >
          <span className={iconTile}>
            <Play className="size-3 translate-x-px fill-accent text-accent" />
          </span>
          Accept and play
        </Link>
      </div>
    </section>
  );
}
