"use client";

import { HatGlasses, Lightbulb } from "lucide-react";
import { useId, useState } from "react";

import type { Workspace } from "../data";
import { Panel } from "./panel";

type InvestigatorStatusProps = Workspace["investigator"] & {
  hint: string;
  /** Overrides the rank line, e.g. "Investigator Diva" once the case is solved. */
  title?: string;
};

/** Rank + state, with an on-demand hint. */
export function InvestigatorStatus({ rank, state, hint, title }: InvestigatorStatusProps) {
  const [showHint, setShowHint] = useState(false);
  const hintId = useId();

  return (
    <Panel aria-label="Investigator status" className="px-[18px] py-[18px]">
      <div className="flex items-center gap-3">
        <span className="grid size-[37px] place-items-center rounded-lg border border-white/10 bg-[#0d1a4a]">
          <HatGlasses className="size-[18px] text-accent" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-xs font-semibold">{title ?? rank}</p>
          <p className="mt-0.5 text-[10px] text-[#8f98b3]">{state}</p>
        </div>
      </div>

      <button
        type="button"
        aria-expanded={showHint}
        aria-controls={hintId}
        onClick={() => setShowHint((v) => !v)}
        className="mt-4 flex h-[35px] w-full items-center justify-center gap-2 rounded-[10px] border border-accent/60 bg-linear-to-b from-[#1d1d2b] to-[#141522] text-[11px] font-bold text-accent transition-colors hover:border-accent"
      >
        <Lightbulb className="size-3.5 fill-current" />
        {showHint ? "Hide hint" : "Need a hint?"}
      </button>

      {showHint && (
        <p
          id={hintId}
          className="mt-3 rounded-md border border-accent/20 bg-accent/5 px-3 py-2 text-[11px] leading-relaxed text-foreground/90"
        >
          {hint}
        </p>
      )}
    </Panel>
  );
}
