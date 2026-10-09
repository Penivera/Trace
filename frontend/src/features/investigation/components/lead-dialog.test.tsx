import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Route } from "next";
import { describe, expect, it, vi } from "vitest";

import { LeadDialog } from "./lead-dialog";

const lead = {
  id: "lead-1",
  badge: "New lead",
  trigger: "arrival" as const,
  title: "This wallet received the missing funds.",
  message: "Check the transactions around {{02:40–03:00 UTC}}.",
  actionLabel: "Investigate wallet",
  target: { kind: "wallet" as const, id: "wallet-b" },
};
const href = "/investigation/case-001/wallets/wallet-b" as Route;

const renderDialog = () => render(<LeadDialog lead={lead} actionHref={href} delayMs={0} />);
const dialog = () => screen.getByRole("dialog", { hidden: true }) as HTMLDialogElement;

describe("LeadDialog", () => {
  it("opens on arrival with the lead content", () => {
    renderDialog();
    expect(dialog().open).toBe(true);
    expect(dialog()).toHaveAccessibleName("This wallet received the missing funds.");
    expect(screen.getByText("02:40–03:00 UTC")).toHaveClass("text-white");
  });

  it("links the action to the lead's target", () => {
    renderDialog();
    expect(screen.getByRole("link", { name: "Investigate wallet", hidden: true })).toHaveAttribute(
      "href",
      href,
    );
  });

  it("waits for the delay before popping up, and never opens if the page is left first", () => {
    vi.useFakeTimers();
    try {
      const { unmount } = render(<LeadDialog lead={lead} actionHref={href} delayMs={3000} />);
      expect(dialog().open).toBe(false);
      act(() => vi.advanceTimersByTime(2999));
      expect(dialog().open).toBe(false);
      act(() => vi.advanceTimersByTime(1));
      expect(dialog().open).toBe(true);

      unmount();
      render(<LeadDialog lead={lead} actionHref={href} delayMs={3000} />).unmount();
      act(() => vi.advanceTimersByTime(5000)); // timer from the unmounted copy must not fire
    } finally {
      vi.useRealTimers();
    }
  });

  it("idle leads wait for inactivity: any interaction restarts the countdown", () => {
    vi.useFakeTimers();
    try {
      const idleLead = { ...lead, badge: "Trace update", trigger: "idle" as const };
      render(<LeadDialog lead={idleLead} actionHref={href} delayMs={6000} />);
      expect(screen.getByText("Trace update")).toBeInTheDocument();

      act(() => vi.advanceTimersByTime(5000));
      act(() => {
        window.dispatchEvent(new Event("pointerdown")); // player is doing something
      });
      act(() => vi.advanceTimersByTime(5000));
      expect(dialog().open).toBe(false); // only 5s idle since the click

      act(() => vi.advanceTimersByTime(1000));
      expect(dialog().open).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("closes when its page goes away, so it can't leave the next page inert", () => {
    const { unmount } = renderDialog();
    const node = dialog();
    expect(node.open).toBe(true);
    unmount();
    expect(node.open).toBe(false);
  });

  it("'Later' closes it, and it pops up again on the next visit", async () => {
    const user = userEvent.setup();
    const { unmount } = renderDialog();

    await user.click(screen.getByRole("button", { name: "Later", hidden: true }));
    expect(dialog().open).toBe(false);

    unmount();
    renderDialog();
    expect(dialog().open).toBe(true);
  });
});
