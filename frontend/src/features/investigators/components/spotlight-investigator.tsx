import Image from "next/image";

import { cn } from "@/lib/utils/cn";

import type { Investigator } from "../data";

/**
 * The chosen investigator standing under a spotlight that falls from the
 * top-right corner (Figma: Desktop - 6). The box is 462×1073 with its origin
 * at Figma canvas x=1266, y=0; place it with `className`.
 *
 * The beam is Figma's render with the background subtracted, so it is drawn
 * with additive blending (`plus-lighter`) and lights whatever is behind it.
 */
export function SpotlightInvestigator({
  investigator,
  className,
}: {
  investigator: Investigator;
  className?: string;
}) {
  const art = investigator.fullBody;

  return (
    <div className={cn("pointer-events-none relative h-[1073px] w-[462px] select-none", className)}>
      <Image
        src="/effects/spotlight-floor.png"
        alt=""
        width={412}
        height={183}
        className="absolute top-[890px] left-[50.4px] max-w-none"
      />

      {art ? (
        // Scaled so the figure is 611px tall, head at canvas y=391.
        <Image
          src={art.src}
          alt={investigator.description}
          width={art.width}
          height={art.height}
          sizes="333px"
          preload
          className="absolute top-[306.2px] left-[36.4px] h-auto w-[332.1px] max-w-none"
        />
      ) : (
        <div className="absolute top-[391px] left-[120px] h-[611px] w-[220px]">
          <Image
            src={investigator.image.src}
            alt={investigator.description}
            fill
            preload
            sizes="220px"
            className="object-contain object-bottom"
          />
        </div>
      )}

      <Image
        src="/effects/spotlight-beam.png"
        alt=""
        width={462}
        height={760}
        preload
        className="absolute top-0 left-[0.4px] max-w-none mix-blend-plus-lighter"
      />
    </div>
  );
}
