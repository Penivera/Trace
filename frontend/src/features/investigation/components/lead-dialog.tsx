"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";

import { renderHighlights } from "@/lib/text/highlight";
import { cn } from "@/lib/utils/cn";

import type { Lead } from "../data";

type LeadDialogProps = {
  lead: Lead;
  /** Where following the lead goes (the transaction or wallet it points at). */
  actionHref: Route;
  /** Override the wait before the lead pops up (0 = immediately). Defaults depend on `lead.trigger`. */
  delayMs?: number;
};

/** "arrival" leads wait this long, so the player can take in the page first. */
export const LEAD_DIALOG_DELAY_MS = 3000;
/** "idle" leads appear after this long without clicks, typing or scrolling. */
export const LEAD_DIALOG_IDLE_MS = 6000;

/** Interactions that show the player is busy; each one restarts an idle countdown. */
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;

/**
 * Lead modal ("New lead", "Trace update"). It pops up every time the player is
 * on a page that has a lead (product decision); "Later" or Escape closes it.
 * Native <dialog>: focus is trapped inside and the page behind becomes inert.
 */
export function LeadDialog({ lead, actionHref, delayMs }: LeadDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const idle = lead.trigger === "idle";
  const wait = delayMs ?? (idle ? LEAD_DIALOG_IDLE_MS : LEAD_DIALOG_DELAY_MS);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    let timer: number | undefined;
    const open = () => {
      if (!dialog.open) dialog.showModal();
      stopListening();
    };
    const restart = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(open, wait);
    };
    const stopListening = () => {
      for (const type of ACTIVITY_EVENTS) window.removeEventListener(type, restart, true);
    };

    if (wait <= 0) open();
    else restart();
    if (idle) {
      // Capture phase + passive: see every interaction without slowing scrolling.
      for (const type of ACTIVITY_EVENTS) {
        window.addEventListener(type, restart, { capture: true, passive: true });
      }
    }

    // Must close on cleanup: Next keeps the previous page mounted but hidden
    // (React <Activity>) after navigating, and a hidden *modal* dialog still
    // makes the whole document inert, so the next page couldn't be clicked.
    // Cleanup runs when the page is hidden; the effect re-runs (re-opening the
    // lead) when it's shown again. Leaving before the wait cancels the pop-up.
    return () => {
      window.clearTimeout(timer);
      stopListening();
      dialog.close();
    };
  }, [lead.id, wait, idle]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={cn(
        "m-auto w-[min(447px,calc(100vw-2rem))] rounded-2xl border border-white/10 p-0 text-foreground",
        "bg-linear-to-br from-[#06144f] via-[#071a5e] to-[#0a2275]",
        "shadow-[0_30px_80px_-20px_rgb(0_0_0/0.85),6px_6px_0_-5px_var(--accent),inset_0_1px_0_rgb(255_255_255/0.06)]",
        "backdrop:bg-[#020a23]/55 backdrop:backdrop-blur-[5px]",
        "motion-safe:open:animate-fade-up",
      )}
    >
      <div className="px-[26px] pt-[28px] pb-[26px]">
        <span className="inline-flex h-[26px] items-center rounded-full border border-violet-500/40 bg-[#05081a] px-4 font-display text-[10px] font-black tracking-[0.18em] text-accent uppercase shadow-[0_0_12px_-2px_rgb(139_92_246/0.6)]">
          {lead.badge}
        </span>

        <h2
          id={titleId}
          className="mt-[22px] font-display text-base font-black tracking-tight uppercase"
        >
          {lead.title}
        </h2>
        <p className="mt-3 text-xs leading-[22px] text-foreground/80">
          {renderHighlights(lead.message, "font-medium text-foreground")}
        </p>

        <div className="mt-7 flex items-center gap-6">
          <Link
            href={actionHref}
            autoFocus
            className="grid h-11 flex-1 place-items-center rounded-xl bg-accent font-display text-[13px] font-black text-accent-foreground uppercase shadow-[0_8px_20px_-6px_rgb(139_92_246/0.55)] transition-[filter] hover:brightness-110"
          >
            {lead.actionLabel}
          </Link>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="px-2 font-display text-[13px] font-black uppercase transition-colors hover:text-accent"
          >
            Later
          </button>
        </div>
      </div>
    </dialog>
  );
}
