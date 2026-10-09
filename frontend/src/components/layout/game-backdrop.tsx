import Image from "next/image";

/**
 * Background of the signed-in game screens, as layered in Figma: a navy
 * gradient, a second 74% gradient, and the control-room art at 20% opacity
 * placed at the exact offset used by 17 of the 18 Figma frames (the art's framed border produces the
 * darker strip at the bottom of each screen).
 * Place inside a `relative isolate` container on a `.design-canvas`.
 */
export function GameBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 overflow-hidden bg-[linear-gradient(178.05deg,#000614_1.96%,#002472_44.67%,#011b55_84.12%)]"
    >
      <div className="absolute inset-y-0 -left-1.5 w-[calc(100%+6px)] bg-[linear-gradient(177.64deg,rgb(0_6_20/0.74)_1.96%,rgb(0_36_114/0.74)_44.67%,rgb(1_27_85/0.74)_84.12%)]">
        <Image
          src="/backgrounds/case-room.jpg"
          alt=""
          width={1306}
          height={816}
          preload
          sizes="2325px"
          className="absolute top-[-94px] left-[-114px] h-[1453px] w-[2325px] max-w-none object-cover opacity-20"
        />
      </div>
    </div>
  );
}
