import { describe, expect, it } from "vitest";

import { formatSol, shortenAddress } from "./format";

describe("shortenAddress", () => {
  it("keeps the first and last characters of a long address", () => {
    expect(shortenAddress("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU")).toBe("7xKX…gAsU");
  });

  it("returns short strings unchanged", () => {
    expect(shortenAddress("abc")).toBe("abc");
  });
});

describe("formatSol", () => {
  it("converts lamports to SOL", () => {
    expect(formatSol(1_500_000_000)).toBe("1.5");
  });

  it("truncates to maxDecimals without rounding up", () => {
    expect(formatSol(1_999_999_999n, 2)).toBe("1.99");
  });

  it("handles amounts above Number.MAX_SAFE_INTEGER exactly", () => {
    expect(formatSol(12_345_678_901_234_567_890n)).toBe("12,345,678,901.2345");
  });

  it("formats negative amounts", () => {
    expect(formatSol(-250_000_000)).toBe("-0.25");
  });
});
