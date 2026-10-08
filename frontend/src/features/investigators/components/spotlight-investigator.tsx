import Image from "next/image";
import { useId } from "react";

import { cn } from "@/lib/utils/cn";

import type { Investigator } from "../data";

/**
 * The chosen investigator standing under a spotlight that falls from the
 * top-right corner. Fixed 360×880 canvas measured from the design; place it
 * with `className` (e.g. `absolute top-0 right-0`).
 */
export function SpotlightInvestigator({
  investigator,
  className,
}: {
  investigator: Investigator;
  className?: string;
}) {
  const beamId = useId();
  const artwork = investigator.fullBody ?? investigator.image;

  return (
    <div className={cn("pointer-events-none h-[880px] w-[360px] select-none", className)}>
      {/* Floor shadow under the boots. */}
      <div
        aria-hidden
        className="absolute top-[790px] left-[30px] h-[80px] w-[300px] rounded-[50%] bg-[radial-gradient(closest-side,rgb(1_4_16/0.9),transparent)]"
      />

      <div className="absolute top-[267px] left-[10px] h-[638px] w-[268px]">
        <Image
          src={artwork.src}
          alt={investigator.description}
          fill
          preload
          sizes="268px"
          className="object-contain object-bottom"
        />
      </div>

      {/* Light beam, in front of the figure so it washes over the upper body. */}
      <svg
        aria-hidden
        viewBox="0 0 360 880"
        className="absolute inset-0 size-full mix-blend-screen"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={beamId} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e6f0ff" stopOpacity="0.85" />
            <stop offset="0.45" stopColor="#a9c4ff" stopOpacity="0.42" />
            <stop offset="1" stopColor="#7aa2ff" stopOpacity="0.16" />
          </linearGradient>
          <filter id={`${beamId}-blur`}>
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        <polygon
          points="328,46 360,67 258,556 4,609"
          fill={`url(#${beamId})`}
          filter={`url(#${beamId}-blur)`}
        />
      </svg>
    </div>
  );
}
