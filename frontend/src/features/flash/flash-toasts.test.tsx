import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FlashToasts } from "./flash-toasts";
import { FLASH_COOKIE, isFlashKey } from "./messages";

const toast = vi.hoisted(() => ({
  success: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
}));
vi.mock("sonner", () => ({ toast }));
vi.mock("next/navigation", () => ({ usePathname: () => "/login" }));

const clearCookie = () => (document.cookie = `${FLASH_COOKIE}=; Max-Age=0; Path=/`);

describe("FlashToasts", () => {
  beforeEach(() => {
    Object.values(toast).forEach((fn) => fn.mockReset());
    clearCookie();
  });
  afterEach(clearCookie);

  it("shows the flash message once and consumes the cookie", () => {
    document.cookie = `${FLASH_COOKIE}=signed-out; Path=/`;

    render(<FlashToasts />);

    expect(toast.success).toHaveBeenCalledWith(
      "You're signed out",
      expect.objectContaining({ id: "flash-signed-out" }),
    );
    expect(document.cookie).not.toContain(`${FLASH_COOKIE}=signed-out`);
  });

  it("ignores keys that aren't on the list (no injected text)", () => {
    document.cookie = `${FLASH_COOKIE}=${encodeURIComponent("<img src=x onerror=alert(1)>")}; Path=/`;

    render(<FlashToasts />);

    Object.values(toast).forEach((fn) => expect(fn).not.toHaveBeenCalled());
  });

  it("does nothing without a flash cookie", () => {
    render(<FlashToasts />);
    Object.values(toast).forEach((fn) => expect(fn).not.toHaveBeenCalled());
  });
});

describe("isFlashKey", () => {
  it("only accepts known keys", () => {
    expect(isFlashKey("auth-required")).toBe(true);
    expect(isFlashKey("toString")).toBe(false);
    expect(isFlashKey("anything")).toBe(false);
    expect(isFlashKey(undefined)).toBe(false);
  });
});
