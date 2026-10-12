import { describe, expect, it } from "vitest";

import { isAuthPage, isProtectedPath, safeRedirectPath } from "./routes";

describe("isProtectedPath", () => {
  it("covers the game sections and their sub-pages", () => {
    expect(isProtectedPath("/dashboard")).toBe(true);
    expect(isProtectedPath("/investigation/case-001/wallets/wallet-b")).toBe(true);
    expect(isProtectedPath("/evidence/case-001")).toBe(true);
  });

  it("leaves public pages and look-alike paths alone", () => {
    expect(isProtectedPath("/")).toBe(false);
    expect(isProtectedPath("/login")).toBe(false);
    expect(isProtectedPath("/dashboards")).toBe(false);
    expect(isProtectedPath("/casesfile")).toBe(false);
  });
});

describe("isAuthPage", () => {
  it("matches login and sign-up only", () => {
    expect(isAuthPage("/login")).toBe(true);
    expect(isAuthPage("/signup")).toBe(true);
    expect(isAuthPage("/loginx")).toBe(false);
  });
});

describe("safeRedirectPath", () => {
  it("keeps game paths, including their query string", () => {
    expect(safeRedirectPath("/investigation/case-001")).toBe("/investigation/case-001");
    expect(safeRedirectPath("/investigation/case-001?preview=solved")).toBe(
      "/investigation/case-001?preview=solved",
    );
  });

  it.each([
    ["missing", undefined],
    ["not a string", 42],
    ["protocol-relative", "//evil.example/dashboard"],
    ["backslash trick", "/\\evil.example"],
    ["absolute URL", "https://evil.example/dashboard"],
    ["javascript URL", "javascript:alert(1)"],
    ["control characters", "/dashboard\n/x"],
    ["public page", "/"],
    ["auth page loop", "/login"],
  ])("falls back to the dashboard for %s", (_label, value) => {
    expect(safeRedirectPath(value)).toBe("/dashboard");
  });
});
