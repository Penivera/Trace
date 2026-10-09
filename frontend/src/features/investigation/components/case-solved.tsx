import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import type { CaseOutcome } from "../outcome";

/*
 * "Case solved" (Figma: Trace Game Design › Desktop - 18). Sizes are the
 * Figma values at 1:1; fractional pixels come from the design's own scale.
 */

type Portrait = { src: string; width: number; height: number; alt: string };

/** Round, glowing portrait above the card. Crop reproduces the Figma framing (head to waist). */
function VictoryAvatar({ portrait }: { portrait: Portrait }) {
  return (
    <div className="relative size-[214.76px]">
      <div className="absolute -inset-[13.42px] rounded-full border-[1.68px] border-dashed border-accent/30" />
      <div className="absolute -inset-[6.71px] rounded-full bg-linear-to-r from-accent/50 via-[rgb(99_102_241/0.2)] to-accent/50 blur-[3.36px]" />
      <div className="relative size-full overflow-hidden rounded-full bg-linear-to-b from-accent via-[#051851] to-[#1e1b4b] shadow-[0_0_40.27px_rgb(5_24_81/0.9)]">
        <Image
          src={portrait.src}
          alt={portrait.alt}
          width={portrait.width}
          height={portrait.height}
          sizes="232px"
          loading="eager"
          className="absolute top-[-8.4px] left-[-38.7px] h-auto w-[231.6px] max-w-none"
        />
      </div>
    </div>
  );
}

function CornerNotch({ className }: { className: string }) {
  return <span aria-hidden className={cn("absolute size-[13.8px] border-accent/70", className)} />;
}

function Stat({ icon, label, children }: { icon: string; label: string; children: ReactNode }) {
  return (
    <div className="flex h-[46.58px] items-center justify-between rounded-[10.35px] border-[0.86px] border-white/8 bg-linear-to-b from-[rgb(7_23_66/0.7)] to-[rgb(3_11_36/0.8)] px-[14.66px]">
      <dt className="flex items-center gap-[6.9px] text-[12.08px] leading-[17.25px] font-medium text-[#d1d5db]">
        <Image src={icon} alt="" width={14} height={14} className="size-[13.8px]" />
        {label}
      </dt>
      <dd className="text-[15.53px] leading-[24.15px] font-black tracking-[0.39px] text-[#f5f5f5]">
        {children}
      </dd>
    </div>
  );
}

function OutOf({ value, total }: { value: number; total: number }) {
  return (
    <>
      <span className="text-accent">{value}</span> / {total}
    </>
  );
}

type CaseSolvedProps = {
  outcome: CaseOutcome;
  portrait: Portrait;
  homeHref: Route;
  nextCaseHref: Route;
};

export function CaseSolved({ outcome, portrait, homeHref, nextCaseHref }: CaseSolvedProps) {
  const perfect = outcome.score === outcome.maxScore;

  return (
    <section
      aria-labelledby="case-solved-title"
      className="relative isolate flex w-[1104px] max-w-full justify-center overflow-hidden rounded-[40px] bg-[#010614] p-[34.5px] font-roboto"
    >
      {/* Atmosphere: amber glow behind the avatar, tactical grid, sparkles. */}
      <div aria-hidden className="absolute inset-[0_0_37.5px_0] -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(854.8px_1009.8px_at_552px_299.8px,rgb(252_163_17/0.18)_0%,rgb(129_94_49/0.39)_21%,rgb(67_59_65/0.495)_31.5%,rgb(36_41_73/0.5475)_36.75%,rgb(5_24_81/0.6)_42%,rgb(3_15_51/0.79)_60%,rgb(1_6_20/0.98)_78%)]" />
        <Image
          src="/effects/grid-scanlines.png"
          alt=""
          fill
          sizes="1104px"
          className="object-cover opacity-25"
        />
        <Image src="/effects/sparkles.png" alt="" fill sizes="1104px" />
      </div>

      <div className="relative flex w-full max-w-[662.4px] flex-col items-center">
        <div
          aria-hidden
          className="absolute top-[-55.2px] left-[165.6px] size-[331.2px] rounded-full bg-accent/15 blur-[27.6px]"
        />

        <div className="pb-[46.98px]">
          <VictoryAvatar portrait={portrait} />
        </div>

        {/* Card with a gradient hairline border and "cyber" corner notches. */}
        <div className="relative w-[733.13px] shrink-0 rounded-[20.7px] bg-linear-to-b from-accent/60 via-[rgb(5_24_81/0.4)] to-accent/30 p-[1.29px] shadow-[0_0_51.75px_-8.63px_rgb(5_24_81/0.9)]">
          <div className="relative h-[775px] overflow-hidden rounded-[19.84px] border-[0.86px] border-white/5 bg-[rgb(2_9_29/0.9)] backdrop-blur-[10.35px]">
            <div
              aria-hidden
              className="absolute top-[-88.41px] left-[120.32px] size-[517.5px] rounded-full bg-[repeating-conic-gradient(rgb(252_163_17/0.08)_0deg_15deg,transparent_15deg_30deg)] opacity-35"
            />
            <CornerNotch className="top-[10.35px] left-[10.35px] border-t-[1.73px] border-l-[1.73px]" />
            <CornerNotch className="top-[10.35px] right-[10.19px] border-t-[1.73px] border-r-[1.73px]" />
            <CornerNotch className="bottom-[10.79px] left-[10.35px] border-b-[1.73px] border-l-[1.73px] border-accent/40" />
            <CornerNotch className="right-[10.19px] bottom-[10.79px] border-r-[1.73px] border-b-[1.73px] border-accent/40" />

            {/* Title */}
            <div className="absolute inset-x-0 top-[138px] flex flex-col items-center gap-[17.25px] px-6 text-center">
              <p className="flex items-center gap-[6.9px] px-[12.08px] py-[3.45px] font-display text-[27.6px] leading-[17.25px] font-black tracking-[3.38px] text-accent uppercase">
                <span aria-hidden className="size-[6.9px] rounded-full bg-accent" />
                Case solved
              </p>
              <h1
                id="case-solved-title"
                className="pt-[3.88px] font-display text-[40px] leading-[1.62] font-black text-white uppercase [text-shadow:0_0_34.5px_rgb(5_24_81/0.8),0_1.73px_17.25px_rgb(255_255_255/0.35)]"
              >
                {outcome.title}
              </h1>
              <p className="w-[561.49px] max-w-full text-[13.8px] leading-[20.7px] font-semibold text-[#d1d5db]">
                {outcome.summary}
              </p>
            </div>

            {/* Score */}
            <div className="absolute top-[338.17px] right-[34.34px] left-[34.5px]">
              <div className="relative flex flex-col gap-[6.9px] rounded-[13.8px] border-[0.86px] border-accent/22 bg-[linear-gradient(141.61deg,rgb(8_24_69/0.65)_0%,rgb(2_9_31/0.85)_100%)] p-[25.01px] shadow-[0_17.25px_43.13px_-8.63px_rgb(0_0_0/0.8),inset_0_0.86px_0.86px_0.86px_rgb(255_255_255/0.15)] backdrop-blur-[6.04px]">
                <span
                  aria-hidden
                  className="absolute inset-x-[34.5px] top-0 h-[1.73px] bg-linear-to-r from-transparent via-accent/80 to-transparent"
                />
                <p className="flex items-center gap-[6.9px] border-b-[0.86px] border-white/10 pb-[11.21px] text-[12.08px] leading-[17.25px] font-bold tracking-[1.21px] text-[#d1d5db] uppercase">
                  <span
                    aria-hidden
                    className="size-[8.63px] rounded-[1.73px] bg-[#10e599] shadow-[0_0_6.9px_#10e599]"
                  />
                  Investigation score
                </p>
                <p className="flex items-baseline justify-center gap-[10.35px] pt-[6.9px] text-center">
                  <span className="text-[62.1px] leading-[62.1px] font-black tracking-[-1.55px] text-accent [text-shadow:0_0_32.78px_rgb(16_229_153/0.35),0_0_15.53px_#d39228]">
                    {outcome.score}
                  </span>
                  <span className="text-[31.05px] leading-[34.5px] font-bold text-[#9ca3af]">
                    / {outcome.maxScore}
                  </span>
                </p>
                {perfect && (
                  <p className="text-center text-[10.35px] leading-[13.8px] font-bold tracking-[1.04px] text-accent uppercase [text-shadow:0_0_27.6px_rgb(252_163_17/0.3),0_0_13.8px_rgb(252_163_17/0.65)]">
                    ★ Perfect score achieved ★
                  </p>
                )}
                <dl className="grid grid-cols-2 gap-[10.35px] pt-[13.8px] pb-[10.35px]">
                  <Stat icon="/icons/outcome/clues.svg" label="Clues discovered">
                    <OutOf value={outcome.clues.found} total={outcome.clues.total} />
                  </Stat>
                  <Stat icon="/icons/outcome/evidence.svg" label="Evidence collected">
                    <span className="text-accent">{outcome.evidenceCollected}</span>
                  </Stat>
                  <Stat icon="/icons/outcome/traces.svg" label="Correct Traces">
                    <OutOf value={outcome.traces.correct} total={outcome.traces.total} />
                  </Stat>
                  <Stat icon="/icons/outcome/hints.svg" label="Hints used">
                    <span className="text-accent">{outcome.hintsUsed}</span>
                  </Stat>
                </dl>
              </div>
            </div>

            {/* Actions */}
            <div className="absolute top-[688.6px] right-[29.43px] left-[39.41px] flex items-center justify-center gap-[12.08px] pt-[6.9px]">
              <Link
                href={homeHref}
                className="flex items-center gap-[6.9px] rounded-[10.35px] border-[0.86px] border-white/15 bg-[rgb(1_6_20/0.8)] px-[21.56px] py-[11.21px] font-display text-[12.08px] leading-[17.25px] font-bold tracking-[0.6px] text-[#d1d5db] uppercase shadow-[0_0.86px_1.73px_rgb(0_0_0/0.05)] transition-colors hover:border-white/30"
              >
                <Image
                  src="/icons/outcome/home.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="size-[13.8px]"
                />
                Home
              </Link>
              <Link
                href={nextCaseHref}
                className="flex items-center gap-[8.63px] rounded-[10.35px] bg-linear-to-r from-accent via-[#ffbb33] to-accent px-[27.6px] py-[12.08px] font-display text-[12.08px] leading-[17.25px] font-black tracking-[1.21px] text-[#010614] uppercase shadow-[0_0_21.56px_rgb(252_163_17/0.55)] transition-[filter] hover:brightness-110"
              >
                Start new case
                <Image
                  src="/icons/outcome/arrow.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="size-[13.8px]"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
