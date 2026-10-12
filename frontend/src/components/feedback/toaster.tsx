"use client";

import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert } from "lucide-react";
import { Toaster as Sonner } from "sonner";

/**
 * App-wide toasts (Sonner), styled as TRACE case notes: navy glass card,
 * amber edge, Roboto body. Trigger with `toast.success(...)`, `toast.info(...)`
 * etc. from `sonner`; server-side events use flash messages (features/flash).
 * Sonner announces toasts to screen readers and pauses them on hover.
 */
export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      // Below the 72px game header (64px on phones).
      offset={{ top: 84, right: 20 }}
      mobileOffset={{ top: 72, left: 12, right: 12 }}
      visibleToasts={4}
      duration={4500}
      closeButton
      icons={{
        success: <CircleCheck className="size-[18px] text-[#34d399]" />,
        info: <Info className="size-[18px] text-accent" />,
        warning: <TriangleAlert className="size-[18px] text-accent" />,
        error: <CircleAlert className="size-[18px] text-destructive" />,
        loading: <LoaderCircle className="size-[18px] animate-spin text-accent" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-[14px] !border !border-[rgb(0_36_114/0.9)] !bg-[linear-gradient(135deg,#031a52,#010818)] !text-foreground !shadow-[0_18px_40px_-12px_rgb(0_0_0/0.8),inset_0_1px_0_rgb(255_255_255/0.06)] !font-roboto !gap-3 !px-4 !py-3.5",
          title: "!font-bold !text-[13.5px] !leading-5 !tracking-[0.2px]",
          description: "!text-[12.5px] !leading-[18px] !text-[#cbd5e1]",
          success: "!border-l-[3px] !border-l-[#34d399]",
          info: "!border-l-[3px] !border-l-accent",
          warning: "!border-l-[3px] !border-l-accent",
          error: "!border-l-[3px] !border-l-destructive",
          closeButton:
            "!border-white/10 !bg-[#010818] !text-[#94a3b8] hover:!text-foreground hover:!bg-[#031a52]",
          actionButton: "!bg-accent !text-[#020512] !font-bold !rounded-[8px]",
        },
      }}
    />
  );
}
