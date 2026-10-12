import { Wallet } from "lucide-react";

import { cn } from "@/lib/utils/cn";

/*
 * Loading state that shows what TRACE is about: the missing SOL hops from
 * wallet to wallet under a detective's magnifying lens, the trail is drawn
 * behind it, and each wallet ripples and lights up as the funds land. A
 * counter ("wallet 3 of 5") ticks along in step.
 *
 * CSS-only (keyframes in globals.css), so it can be a Suspense fallback with no
 * client JS. Every animation is behind `motion-safe:`; with reduced motion the
 * finished trail is shown, standing still.
 */

/** Wallets on the trail, in the 520×150 drawing's px coordinates. */
const WALLETS = [
  { label: "Treasury", x: 40, y: 88 },
  { label: "Wallet B", x: 150, y: 44 },
  { label: "Wallet C", x: 260, y: 100 },
  { label: "Wallet D", x: 370, y: 52 },
  { label: "Exchange", x: 480, y: 88 },
];

const TRAIL = `M${WALLETS.map(({ x, y }) => `${x} ${y}`).join(" L")}`;

/**
 * One loop, in seconds; must match the trace-* animations in globals.css. The
 * lens travels for 80% of it, so it reaches wallet i at i × 20%.
 */
const CYCLE = 3.2;
const arrival = (i: number) => `${(i * 0.2 * CYCLE).toFixed(2)}s`;

const STATUS_LINES = [
  "Scanning the ledger…",
  "Following the money…",
  "Linking wallets…",
  "Decoding transactions…",
];

export function TraceLoader({
  label = "Tracing the funds",
  className,
}: {
  /** Headline under the trail. */
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-[60svh] flex-col items-center justify-center gap-7 px-4 text-center lg:min-h-[620px]",
        className,
      )}
    >
      {/* Fixed-size drawing (path coordinates are px); shrunk on narrow screens. */}
      <div
        aria-hidden
        className="relative h-[150px] w-[520px] shrink-0 max-sm:scale-[0.62] sm:max-md:scale-90 lg:my-8 lg:scale-[1.3]"
      >
        {/* Evidence-board dot grid, fading out towards the edges. */}
        <div className="absolute -inset-x-10 -inset-y-8 bg-[radial-gradient(rgb(148_163_184/0.18)_1px,transparent_1.5px)] mask-radial-from-30% mask-radial-to-70% bg-size-[14px_14px]" />

        <svg viewBox="0 0 520 150" className="absolute inset-0 size-full overflow-visible">
          <path
            d={TRAIL}
            fill="none"
            stroke="rgb(0 36 114 / 0.9)"
            strokeWidth="2"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
          {/* The trail being uncovered behind the lens. */}
          <path
            d={TRAIL}
            pathLength={1}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1"
            className="drop-shadow-[0_0_6px_rgb(252_163_17/0.6)] motion-safe:animate-trace-draw"
          />
        </svg>

        {WALLETS.map(({ label, x, y }, i) => (
          <div
            key={label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: x, top: y }}
          >
            {/* Ripple when the funds land. */}
            <span
              className="absolute top-0 left-1/2 hidden size-9 -translate-x-1/2 rounded-[11px] border border-accent motion-safe:block motion-safe:animate-trace-ripple"
              style={{ animationDelay: arrival(i) }}
            />
            <span
              className="grid size-9 place-items-center rounded-[11px] border border-accent bg-[#011b55] text-accent motion-safe:animate-trace-ping"
              style={{ animationDelay: arrival(i) }}
            >
              <Wallet className="size-4" strokeWidth={2} />
            </span>
            <span className="absolute top-full mt-2 font-mono text-[10px] tracking-[0.08em] whitespace-nowrap text-[#94a3b8] uppercase">
              {label}
            </span>
          </div>
        ))}

        {/* The funds under the investigator's lens, carrying their amount. */}
        <div
          className="absolute top-0 left-0 hidden [offset-anchor:center] [offset-rotate:0deg] motion-safe:block motion-safe:animate-trace-packet"
          style={{ offsetPath: `path("${TRAIL}")` }}
        >
          <div className="relative grid size-10 place-items-center">
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full border border-accent/60 bg-[#000614]/90 px-2 py-0.5 font-mono text-[10px] font-bold whitespace-nowrap text-accent shadow-[0_0_10px_rgb(252_163_17/0.35)]">
              20 SOL
            </span>
            {/* Lens: glass, rim and handle. */}
            <span className="absolute inset-0 rounded-full border-2 border-[#fcd34d] bg-[radial-gradient(circle_at_35%_30%,rgb(255_255_255/0.35),rgb(252_163_17/0.12)_45%,rgb(0_6_20/0.2))] shadow-[0_0_16px_rgb(252_163_17/0.55)] backdrop-blur-[1px]" />
            <span className="absolute top-[34px] left-[33px] h-2.5 w-1 rotate-[-45deg] rounded-full bg-[#fcd34d]" />
            <span className="size-2.5 rounded-full bg-[#fcd34d] shadow-[0_0_10px_3px_rgb(252_163_17/0.8)]" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        {/* "Wallet n of 5", in step with the lens (lines change at each arrival). */}
        <p
          aria-hidden
          className="flex items-center gap-1.5 font-mono text-[11px] leading-4 tracking-[0.14em] text-[#94a3b8] uppercase"
        >
          Wallet
          <span className="inline-block h-4 overflow-hidden text-accent">
            <span className="flex flex-col motion-safe:animate-trace-counter">
              {WALLETS.map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </span>
          </span>
          of {WALLETS.length}
        </p>
        <p className="font-display text-[22px] leading-tight font-black tracking-wide uppercase lg:text-[26px]">
          {label}
        </p>
        {/* Rotating status line; the first one stays put with reduced motion. */}
        <div aria-hidden className="h-5 overflow-hidden">
          <ul className="font-mono text-[12px] leading-5 tracking-[0.06em] text-accent motion-safe:animate-trace-ticker">
            {STATUS_LINES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <p className="max-w-[340px] font-roboto text-[13px] leading-5 text-[#94a3b8]">
          Every case is built from real Solana activity. Hang tight while the trail loads.
        </p>
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  );
}
