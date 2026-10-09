import { cn } from "@/lib/utils/cn";

type ProgressStripProps = {
  completed: number;
  total: number;
  className?: string;
};

/** "Investigation in progress" banner with objective progress. */
export function ProgressStrip({ completed, total, className }: ProgressStripProps) {
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <section
      aria-label="Investigation progress"
      className={cn(
        "grid items-center gap-3 rounded-[14px] border border-white/10 bg-[#071548]/85 px-4 py-4 md:h-16 md:grid-cols-[minmax(0,330px)_minmax(0,372px)] md:py-0",
        className,
      )}
    >
      <div>
        <p className="font-display text-[13px] font-black tracking-tight uppercase">
          Investigation in progress
        </p>
        <p className="mt-0.5 text-[10.5px] text-[#8f98b3]">Pick up where you left off.</p>
      </div>
      <div>
        <div className="flex items-center justify-between font-display text-[9px] font-bold uppercase">
          <span>
            {completed} of {total} objectives
          </span>
          <span className="text-accent">{percent}%</span>
        </div>
        <div
          role="progressbar"
          aria-label="Case objectives completed"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-[7px] h-[5px] overflow-hidden rounded-full bg-[#1d2130]"
        >
          <div
            className="h-full rounded-full bg-accent shadow-[0_0_8px_var(--accent)]"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </section>
  );
}
