import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { renderHighlights } from "@/lib/text/highlight";

import type { CaseBrief } from "../data";

/*
 * Case briefing (Figma: Desktop - 5). Desktop offsets are relative to <main>
 * (Figma x=396, y=153): title at x=452/y=225, brief and
 * objectives columns at y=411 (x=452 and x=1127), Proceed at y=880.
 */

function SectionHeading({
  id,
  underline,
  children,
}: {
  id: string;
  underline: number;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-1">
      <h2 id={id} className="font-display text-[20px] leading-[1.62] font-black uppercase">
        {children}
      </h2>
      <span aria-hidden className="h-[3px] bg-accent" style={{ width: underline }} />
    </div>
  );
}

const bone = "rounded-md bg-white/10 motion-safe:animate-pulse";

/** Placeholder with the briefing's proportions while the case loads. */
export function CaseBriefingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading case" className="lg:pt-[72px] lg:pl-[56px]">
      <div className={`${bone} h-[52px] w-56`} />
      <div className={`${bone} mt-3 h-[52px] w-full max-w-[600px]`} />
      <div className="mt-[56px] flex max-w-[490px] flex-col gap-4">
        <div className={`${bone} h-8 w-32`} />
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`${bone} h-5`} style={{ width: `${90 - i * 7}%` }} />
        ))}
      </div>
    </div>
  );
}

type CaseBriefingProps = {
  caseBrief: CaseBrief;
  /** Next step after reading the brief (the case offer). */
  proceedHref: Route;
};

export function CaseBriefing({ caseBrief, proceedHref }: CaseBriefingProps) {
  return (
    <article className="lg:pt-[72px] lg:pl-[56px]">
      <header className="font-display text-[28px] leading-[1.62] font-black uppercase lg:text-[40px]">
        <p className="text-accent">{caseBrief.number}</p>
        <h1>{caseBrief.title}</h1>
      </header>

      <div className="mt-10 flex flex-col gap-12 lg:mt-[56.4px] lg:flex-row lg:gap-[185px]">
        <section aria-labelledby="case-brief" className="lg:w-[490px]">
          <SectionHeading id="case-brief" underline={127.5}>
            Case brief
          </SectionHeading>
          <div className="mt-5 font-roboto text-[17px] leading-[2.03] lg:text-[20px]">
            {caseBrief.brief.map((paragraph, i) => (
              <p key={i}>{renderHighlights(paragraph)}</p>
            ))}
          </div>
          <Link
            href={proceedHref}
            className="mt-[45px] flex h-[71px] w-full max-w-[383px] items-center justify-center gap-2.5 rounded-[32px] bg-accent p-2.5 font-display text-[20px] leading-[1.62] font-black text-[#020512] uppercase transition-[filter] hover:brightness-110"
          >
            Proceed
            <Image
              src="/icons/arrow-line.svg"
              alt=""
              width={24}
              height={24}
              className="size-6 -scale-y-100 -rotate-90"
            />
          </Link>
        </section>

        <section aria-labelledby="case-objectives" className="lg:w-[401px]">
          <SectionHeading id="case-objectives" underline={226}>
            Case objectives
          </SectionHeading>
          <ol className="mt-5 font-roboto">
            {caseBrief.objectives.map((objective, i) => (
              <li key={i} className="flex h-[40.56px] items-center gap-[11px] text-[12px]">
                <span
                  aria-hidden
                  className="grid size-[17px] shrink-0 place-items-center rounded-full bg-accent font-display text-[10px] font-bold text-black"
                >
                  {i + 1}
                </span>
                {objective}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
