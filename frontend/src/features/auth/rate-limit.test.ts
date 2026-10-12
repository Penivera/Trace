import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { clearFailures, recordFailure, retryAfterMinutes } = await import("./rate-limit");

describe("login rate limit", () => {
  it("blocks a key after five failures until the window ends", () => {
    const key = "1.2.3.4|agent@trace.demo";
    const start = 1_000_000;

    for (let i = 0; i < 4; i++) recordFailure(key, start);
    expect(retryAfterMinutes(key, start)).toBe(0);

    recordFailure(key, start);
    expect(retryAfterMinutes(key, start)).toBe(10);
    expect(retryAfterMinutes(key, start + 9 * 60_000)).toBe(1);
    expect(retryAfterMinutes(key, start + 10 * 60_000)).toBe(0);
  });

  it("keeps keys separate and clears on success", () => {
    const now = 2_000_000;
    for (let i = 0; i < 5; i++) recordFailure("a", now);
    expect(retryAfterMinutes("b", now)).toBe(0);

    clearFailures("a");
    expect(retryAfterMinutes("a", now)).toBe(0);
  });
});
