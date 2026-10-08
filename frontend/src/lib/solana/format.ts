/** 1 SOL = 10^9 lamports (the smallest unit of SOL). */
export const LAMPORTS_PER_SOL = 1_000_000_000n;

/** `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU` → `7xKX…gAsU` */
export function shortenAddress(address: string, chars = 4) {
  if (address.length <= chars * 2 + 1) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}

/**
 * Formats a lamport amount as SOL without floating-point rounding errors.
 * Accepts bigint because on-chain amounts can exceed Number.MAX_SAFE_INTEGER.
 */
export function formatSol(lamports: bigint | number, maxDecimals = 4) {
  const value = BigInt(lamports);
  const negative = value < 0n;
  const abs = negative ? -value : value;

  const whole = abs / LAMPORTS_PER_SOL;
  const fraction = (abs % LAMPORTS_PER_SOL)
    .toString()
    .padStart(9, "0")
    .slice(0, maxDecimals)
    .replace(/0+$/, "");

  return `${negative ? "-" : ""}${whole.toLocaleString("en-US")}${fraction ? `.${fraction}` : ""}`;
}
