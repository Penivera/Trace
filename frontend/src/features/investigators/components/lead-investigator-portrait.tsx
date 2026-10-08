import Image from "next/image";

import { cn } from "@/lib/utils/cn";

import { featuredInvestigator } from "../data";

/** Tracy, the lead investigator, in a circular portrait. */
export function LeadInvestigatorPortrait({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative size-[206px] overflow-hidden rounded-full bg-[#030820] shadow-[0_20px_50px_-15px_rgb(0_0_0/0.8)]",
        className,
      )}
    >
      {/* Head-and-shoulders crop of the full-length artwork. */}
      <Image
        src={featuredInvestigator.image.src}
        alt={featuredInvestigator.description}
        width={featuredInvestigator.image.width}
        height={featuredInvestigator.image.height}
        sizes="262px"
        className="absolute top-[48px] left-[-65px] h-auto w-[262px] max-w-none"
      />
    </div>
  );
}
