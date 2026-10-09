import Image from "next/image";

import { cn } from "@/lib/utils/cn";

import { featuredInvestigator } from "../data";

/**
 * Tracy, the lead investigator, in a 250px circle (Figma: Desktop - 5 › Group 16).
 * The art is clipped to a 221.65×197.74 pill inside the circle, with a soft
 * floor shadow under the cut, exactly as layered in Figma.
 */
export function LeadInvestigatorPortrait({ className }: { className?: string }) {
  const art = featuredInvestigator.fullBody;

  return (
    <div className={cn("relative size-[250px]", className)}>
      <div className="absolute inset-0 rounded-full bg-[#020a23]" />
      <div className="absolute top-[46.42px] left-[14.66px] h-[197.74px] w-[221.65px] overflow-hidden rounded-[110.75px]">
        <Image
          src={art.src}
          alt={featuredInvestigator.description}
          width={art.width}
          height={art.height}
          sizes="1163px"
          loading="eager"
          className="absolute top-0 left-[-218.85%] h-[367.32%] w-[524.58%] max-w-none"
        />
      </div>
      <Image
        src="/effects/floor-shadow-portrait.svg"
        alt=""
        aria-hidden
        width={304}
        height={246}
        className="absolute top-[76.63px] left-[-31.67px] h-[245.77px] w-[303.58px] max-w-none"
      />
    </div>
  );
}
