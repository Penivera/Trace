import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Route } from "next";
import { describe, expect, it } from "vitest";

import { LeadDialog } from "./lead-dialog";

const lead = {
  id: "lead-1",
  title: "This wallet received the missing funds.",
  message: "Check the transactions around {{02:40–03:00 UTC}}.",
  actionLabel: "Investigate wallet",
  target: { kind: "wallet" as const, id: "wallet-b" },
};
const href = "/investigation/case-001/wallets/wallet-b" as Route;

const renderDialog = () => render(<LeadDialog lead={lead} actionHref={href} />);
const dialog = () => screen.getByRole("dialog", { hidden: true }) as HTMLDialogElement;

describe("LeadDialog", () => {
  it("opens on arrival with the lead content", () => {
    renderDialog();
    expect(dialog().open).toBe(true);
    expect(dialog()).toHaveAccessibleName("This wallet received the missing funds.");
    expect(screen.getByText("02:40–03:00 UTC")).toHaveClass("font-medium");
  });

  it("links the action to the lead's target", () => {
    renderDialog();
    expect(screen.getByRole("link", { name: "Investigate wallet", hidden: true })).toHaveAttribute(
      "href",
      href,
    );
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
