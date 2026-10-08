import Image from "next/image";

import { cn } from "@/lib/utils/cn";

import type { Investigator } from "../data";

/**
 * Full-length investigator (falls back to half-body art) with a floor shadow.
 * Size and position it with `className`; the art is bottom-aligned inside.
 */
export function InvestigatorStanding({
  investigator,
  className,
  sizes,
}: {
  investigator: Investigator;
  className?: string;
  sizes: string;
}) {
  const artwork = investigator.fullBody ?? investigator.image;

  return (
    <div className={cn("pointer-events-none select-none", className)}>
      <div
        aria-hidden
        className="absolute bottom-[-4%] left-1/2 h-[9%] w-[95%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(1_4_16/0.85),transparent)]"
      />
      <Image
        src={artwork.src}
        alt={investigator.description}
        fill
        sizes={sizes}
        // Half-body art ends mid-leg: fade it out instead of a hard cut.
        className={cn("object-contain object-bottom", !investigator.fullBody && "mask-b-from-75%")}
      />
    </div>
  );
}
