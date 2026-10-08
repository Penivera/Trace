import Image from "next/image";

import type { Investigator } from "../data";

/** A standing investigator with a soft floor shadow, used beside case content. */
export function InvestigatorFigure({ investigator }: { investigator: Investigator }) {
  const { src, width, height } = investigator.image;
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-x-[-30%] top-[45%] bottom-[-8%] rounded-[40%] bg-[radial-gradient(closest-side,rgb(2_6_20/0.85),transparent)] blur-md"
      />
      <Image
        src={src}
        alt={investigator.description}
        width={width}
        height={height}
        sizes="160px"
        className="relative h-[229px] w-auto mask-b-from-80%"
      />
    </div>
  );
}
