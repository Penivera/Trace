import Image from "next/image";

import { cn } from "@/lib/utils/cn";

import type { Investigator } from "../data";

/** The selected investigator framed in a dark circle (crop tuned for the half-body art). */
export function InvestigatorPortrait({
  investigator,
  className,
}: {
  investigator: Investigator;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full bg-[#030820] shadow-[0_20px_50px_-15px_rgb(0_0_0/0.8)]",
        className,
      )}
    >
      {/* Head-to-waist crop: art scaled past the circle and offset so the figure is centred. */}
      <Image
        src={investigator.image.src}
        alt={investigator.description}
        width={investigator.image.width}
        height={investigator.image.height}
        sizes="260px"
        loading="eager"
        className="absolute top-[-16%] left-[-14%] h-auto w-[110%] max-w-none"
      />
    </div>
  );
}
