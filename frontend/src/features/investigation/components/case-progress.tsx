import { ClipboardList } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { Workspace } from "../data";
import { Panel, PanelLabel } from "./panel";

export function CaseProgress({ objectives }: { objectives: Workspace["objectives"] }) {
  const done = objectives.filter((o) => o.done).length;
  const percent = objectives.length ? Math.round((done / objectives.length) * 100) : 0;

  return (
    <Panel aria-labelledby="case-progress" className="px-[18px] pt-[22px] pb-5">
      <PanelLabel id="case-progress" icon={ClipboardList}>
        Case progress
      </PanelLabel>

      <ol className="mt-3.5 flex flex-col gap-[11px]">
        {objectives.map((objective, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[11px] leading-[15px]">
            <span
              className={cn(
                "mt-px grid size-[13px] shrink-0 place-items-center rounded-full border",
                objective.done ? "border-accent" : "border-white/30",
              )}
            >
              <span className="sr-only">{objective.done ? "Done:" : "To do:"}</span>
            </span>
            <span className={objective.done ? "text-accent" : "text-foreground/90"}>
              {i + 1}. {objective.text}
            </span>
          </li>
        ))}
      </ol>

      <div
        role="progressbar"
        aria-label="Objectives completed"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-[22px] h-1 overflow-hidden rounded-full bg-[#050c26]"
      >
        {/* Minimum width keeps a visible start marker at 0%, as in the design. */}
        <div
          className="h-full min-w-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--accent)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </Panel>
  );
}
