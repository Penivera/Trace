import { ClipboardList } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import type { Workspace } from "../data";
import { Panel, PanelLabel } from "./panel";

export function CaseProgress({ objectives }: { objectives: Workspace["objectives"] }) {
  const done = objectives.filter((o) => o.done).length;
  const percent = objectives.length ? Math.round((done / objectives.length) * 100) : 0;

  return (
    <Panel aria-labelledby="case-progress" className="flex flex-col gap-4 p-[21px]">
      <PanelLabel id="case-progress" icon={ClipboardList}>
        Case progress
      </PanelLabel>

      <ol className="flex flex-col gap-4 pb-2 font-roboto">
        {objectives.map((objective, i) => (
          <li key={i} className="flex items-start gap-3 text-[13px] leading-[17.88px]">
            <span
              className={cn(
                "mt-0.5 size-4 shrink-0 rounded-full border",
                objective.done ? "border-accent bg-accent/20" : "border-white/20",
              )}
            >
              <span className="sr-only">{objective.done ? "Done:" : "To do:"}</span>
            </span>
            <span className={objective.done ? "text-accent" : "text-[#cbd5e1]"}>
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
        className="h-1.5 overflow-hidden rounded-full border border-white/5 bg-[rgb(0_6_20/0.8)]"
      >
        {/* Minimum width keeps a visible start marker at 0%, as in the design. */}
        <div
          className="h-full min-w-[11px] rounded-full bg-linear-to-r from-accent to-[#fcd34d] shadow-[0_0_8px_rgb(252_163_17/0.7)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </Panel>
  );
}
