import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

export type AuthCharacter = {
  src: string;
  width: number;
  height: number;
  /**
   * Horizontal placement, relative to the centred card. The source PNGs carry
   * different amounts of transparent padding, so each one is tuned by hand.
   */
  positionClassName: string;
  /** Rendered width as a CSS length, for `sizes` (height is 58vh × aspect ratio). */
  renderedWidth: string;
};

/**
 * Centres the auth card and stands decorative investigators beside it on
 * large screens, anchored to the bottom of the viewport like the home hero.
 */
export function AuthScene({
  characters,
  children,
}: {
  characters: AuthCharacter[];
  children: ReactNode;
}) {
  return (
    <div className="relative flex flex-1 items-center justify-center px-5 pt-4 pb-12 lg:pb-16">
      {characters.map((character) => (
        <Image
          key={character.src}
          src={character.src}
          alt=""
          width={character.width}
          height={character.height}
          sizes={character.renderedWidth}
          className={cn(
            "pointer-events-none absolute bottom-0 hidden h-[58vh] w-auto max-w-none select-none lg:block",
            "mask-b-from-85% [animation-delay:150ms] motion-safe:animate-rise",
            character.positionClassName,
          )}
        />
      ))}
      <div className="relative z-10 flex w-full justify-center motion-safe:animate-fade-up">
        {children}
      </div>
    </div>
  );
}
