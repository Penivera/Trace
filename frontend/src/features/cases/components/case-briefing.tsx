import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { renderHighlights } from "@/lib/text/highlight";

import type { CaseBrief } from "../data";

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="inline-block border-b-2 border-accent pb-1.5 font-display text-base font-black tracking-tight uppercase">
      {children}
    </h2>
  );
}

const bone = "rounded-md bg-white/10 motion-safe:animate-pulse";

/** Placeholder with the briefing's proportions while the case loads. */
export function CaseBriefingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading case" className="lg:pt-[75px] lg:pl-[22px]">
      <div className={`${bone} h-[30px] w-40`} />
      <div className={`${bone} mt-[26px] h-[30px] w-full max-w-[405px]`} />
      <div className="mt-[60px] flex max-w-[405px] flex-col gap-4">
        <div className={`${bone} h-5 w-28`} />
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`${bone} h-4`} style={{ width: `${90 - i * 7}%` }} />
        ))}
      </div>
    </div>
  );
}

type CaseBriefingProps = {
  caseBrief: CaseBrief;
  /** Shown beside the objectives, e.g. the player's chosen investigator. */
  companion?: ReactNode;
  /** Next step after reading the brief (the case offer). */
  proceedHref: Route;
};

export function CaseBriefing({ caseBrief, companion, proceedHref }: CaseBriefingProps) {
  return (
    <article className="lg:pt-[75px] lg:pl-[22px]">
      <header>
        <p className="font-display text-[30px] leading-none font-black tracking-tight text-accent uppercase">
          {caseBrief.number}
        </p>
        <h1 className="mt-[26px] font-display text-[clamp(1.5rem,2.1vw,1.875rem)] leading-none font-black tracking-tight uppercase">
          {caseBrief.title}
        </h1>
      </header>

      <div className="mt-[60px] grid gap-12 xl:grid-cols-[minmax(0,405px)_minmax(0,1fr)] xl:gap-x-[157px]">
        <section aria-labelledby="case-brief">
          <SectionHeading>
            <span id="case-brief">Case brief</span>
          </SectionHeading>
          <div className="mt-3 text-[15px] leading-8 text-foreground/95 lg:leading-[35px]">
            {caseBrief.brief.map((paragraph, i) => (
              <p key={i}>{renderHighlights(paragraph)}</p>
            ))}
          </div>
          <Link
            href={proceedHref}
            className={buttonVariants({
              className:
                "mt-[38px] h-[59px] w-full max-w-[320px] font-display text-base font-black",
            })}
          >
            Proceed
            <ArrowRight className="size-4" strokeWidth={2.25} />
          </Link>
        </section>

        <section aria-labelledby="case-objectives" className="relative">
          <SectionHeading>
            <span id="case-objectives">Case objectives</span>
          </SectionHeading>
          <ol className="mt-[18px] flex max-w-[372px] flex-col gap-[17px]">
            {caseBrief.objectives.map((objective, i) => (
              <li key={i} className="flex items-start gap-3 text-[10px] leading-[18px]">
                <span
                  aria-hidden
                  className="mt-0.5 grid size-[14px] shrink-0 place-items-center rounded-full bg-accent text-[8px] font-bold text-accent-foreground"
                >
                  {i + 1}
                </span>
                {objective}
              </li>
            ))}
          </ol>
          {companion && (
            <div className="pointer-events-none absolute top-0 left-[311px] hidden xl:block">
              {companion}
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
