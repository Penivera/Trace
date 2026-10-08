"use client";

import { ChevronDown, LogOut } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

type UserMenuProps = {
  displayName: string;
  avatar: { src: string; position: string };
};

export function UserMenu({ displayName, avatar }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape while open.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-10 items-center gap-3 rounded-lg border border-white/10 pr-3 pl-4",
          "bg-linear-to-r from-[#06113a] to-[#0a1b55] transition-colors hover:border-white/20",
        )}
      >
        <span className="font-display text-[11px] font-black tracking-wide text-accent uppercase">
          {displayName}
        </span>
        <span className="relative size-7 overflow-hidden rounded-full bg-primary ring-2 ring-accent">
          <Image
            src={avatar.src}
            alt=""
            fill
            sizes="84px"
            className="scale-[2.6] object-cover"
            style={{ objectPosition: avatar.position, transformOrigin: avatar.position }}
          />
        </span>
        <ChevronDown
          className={cn("size-3.5 text-white/60 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-white/10 bg-background/95 py-1 shadow-2xl backdrop-blur-md"
        >
          <Link
            role="menuitem"
            href={"/login" as Route}
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-primary"
          >
            <LogOut className="size-4 text-muted" />
            Log out
          </Link>
        </div>
      )}
    </div>
  );
}
