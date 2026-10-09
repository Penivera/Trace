import "server-only";

/*
 * Login throttling: at most MAX_FAILURES failed attempts per key per window.
 *
 * In-memory, so it is per server instance and resets on restart. That's enough
 * to stop casual guessing at the shared demo account; real brute-force
 * protection belongs to the backend (or a shared store such as Redis) once
 * login is real.
 */

const MAX_FAILURES = 5;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_KEYS = 10_000;

type Bucket = { failures: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function current(key: string, now: number) {
  const bucket = buckets.get(key);
  if (bucket && bucket.resetAt <= now) {
    buckets.delete(key);
    return undefined;
  }
  return bucket;
}

/** Minutes until the key may try again, or 0 if it isn't blocked. */
export function retryAfterMinutes(key: string, now = Date.now()) {
  const bucket = current(key, now);
  if (!bucket || bucket.failures < MAX_FAILURES) return 0;
  return Math.max(1, Math.ceil((bucket.resetAt - now) / 60_000));
}

export function recordFailure(key: string, now = Date.now()) {
  const bucket = current(key, now);
  if (bucket) {
    bucket.failures += 1;
    return;
  }
  // Bound memory: drop the oldest entry (Map keeps insertion order).
  if (buckets.size >= MAX_KEYS) buckets.delete(buckets.keys().next().value!);
  buckets.set(key, { failures: 1, resetAt: now + WINDOW_MS });
}

export function clearFailures(key: string) {
  buckets.delete(key);
}
