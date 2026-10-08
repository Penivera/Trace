import Image from "next/image";

/**
 * Full-bleed investigation-room background re-hued to the brand navy.
 * Place inside a `relative isolate` container; it sits behind all content.
 */
export function BrandBackdrop({ fadeBottom = true }: { fadeBottom?: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <Image
        src="/trace-hero-bg.jpg"
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* "color" blend re-hues the purple/teal photo to brand navy but keeps its detail. */}
      <div className="absolute inset-0 bg-primary mix-blend-color" />
      <div className="absolute inset-0 bg-background/45" />
      {/* Soft glow toward the upper middle, where page content sits. */}
      <div className="absolute inset-x-0 top-0 h-3/4 bg-[radial-gradient(60%_55%_at_50%_35%,color-mix(in_srgb,var(--primary)_70%,transparent),transparent)]" />
      {/* Darken the top for header legibility. */}
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-background/80 to-transparent" />
      {fadeBottom && (
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background to-transparent" />
      )}
    </div>
  );
}
