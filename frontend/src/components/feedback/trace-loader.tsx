import { cn } from "@/lib/utils/cn";

/*
 * Loading state that shows what TRACE is about: a packet of SOL hopping from
 * wallet to wallet while the trail is drawn behind it, each wallet lighting up
 * as the funds arrive.
 *
 * CSS-only (keyframes in globals.css), so it can be a Suspense fallback with no
 * client JS. Every animation is behind `motion-safe:`; with reduced motion the
 * finished trail is shown, standing still.
 */

/** Wallets on the trail, in the 520×140 drawing's px coordinates. */
const WALLETS = [
  { label: "Treasury", x: 40, y: 78 },
  { label: "Wallet B", x: 150, y: 38 },
  { label: "Wallet C", x: 260, y: 92 },
  { label: "Wallet D", x: 370, y: 46 },
  { label: "Exchange", x: 480, y: 78 },
];

const TRAIL = `M${WALLETS.map(({ x, y }) => `${x} ${y}`).join(" L")}`;

/** One loop, in seconds. The packet spends 80% of it travelling (see globals.css). */
const CYCLE = 3.2;

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
        className="relative h-[140px] w-[520px] shrink-0 max-sm:scale-[0.62] sm:max-md:scale-90 lg:my-6 lg:scale-[1.35]"
      >
        <svg viewBox="0 0 520 140" className="absolute inset-0 size-full overflow-visible">
          <path
            d={TRAIL}
            fill="none"
            stroke="rgb(0 36 114 / 0.9)"
            strokeWidth="2"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
          {/* The trail being uncovered behind the packet. */}
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
            <span
              className="grid size-7 place-items-center rounded-full border border-accent bg-[#011b55] font-mono text-[11px] font-bold text-accent motion-safe:animate-trace-ping"
              style={{ animationDelay: `${(i * 0.2 * CYCLE).toFixed(2)}s` }}
            >
              {i + 1}
            </span>
            <span className="absolute top-full mt-1.5 font-mono text-[10px] tracking-[0.08em] whitespace-nowrap text-[#94a3b8] uppercase">
              {label}
            </span>
          </div>
        ))}

        {/* The funds: hidden when motion is reduced (the trail is already drawn). */}
        <span
          className="absolute top-0 left-0 hidden size-3 rounded-full bg-[#fcd34d] shadow-[0_0_12px_4px_rgb(252_163_17/0.7)] [offset-anchor:center] [offset-rotate:0deg] motion-safe:block motion-safe:animate-trace-packet"
          style={{ offsetPath: `path("${TRAIL}")` }}
        />
      </div>

      <div className="flex flex-col items-center gap-2">
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
