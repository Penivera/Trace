import Image from "next/image";

import { cn } from "@/lib/utils/cn";

import type { Investigator } from "../data";

/**
 * The chosen investigator beside the case objectives (Figma: Desktop - 5 ›
 * Group 11): figure clipped head-to-thigh in a 166.68×243.36 box, standing on
 * a 232×34.55 navy plinth, with two floor shadows. Coordinates are relative to
 * the group's top-left (Figma canvas x=1440, y=435); place with `className`.
 */
export function BriefingCompanion({
  investigator,
  className,
}: {
  investigator: Investigator;
  className?: string;
}) {
  const art = investigator.fullBody;

  return (
    <div className={cn("pointer-events-none relative h-[350px] w-[310px] select-none", className)}>
      <div className="absolute top-0 left-[68.48px] h-[243.36px] w-[166.68px] overflow-hidden">
        {art ? (
          // Same framing as Figma's crop of the full-length art.
          <Image
            src={art.src}
            alt={investigator.description}
            width={art.width}
            height={art.height}
            sizes="204px"
            loading="eager"
            className="absolute top-[0.3px] left-[-37.2px] h-auto w-[203.5px] max-w-none"
          />
        ) : (
          <Image
            src={investigator.image.src}
            alt={investigator.description}
            fill
            sizes="167px"
            className="object-contain object-top"
          />
        )}
      </div>
      <div className="absolute top-[237.36px] left-[46px] h-[34.55px] w-[232.02px] rounded-[4px] bg-[#041d62]" />
      <Image
        src="/effects/floor-shadow-a.svg"
        alt=""
        width={283}
        height={225}
        className="absolute top-[130.4px] left-[0.4px] h-[224.78px] w-[282.59px] max-w-none"
      />
      <Image
        src="/effects/floor-shadow-b.svg"
        alt=""
        width={292}
        height={234}
        className="absolute top-[112.9px] left-[89.9px] h-[233.78px] w-[291.59px] max-w-none"
      />
    </div>
  );
}
