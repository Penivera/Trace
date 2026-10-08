import { expect, it } from "vitest";

import { walletName } from "./transaction-detail";

it("adds 'the' only to descriptive wallet names", () => {
  expect(walletName("Treasury Wallet")).toBe("the Treasury Wallet");
  expect(walletName("Unknown wallet")).toBe("the Unknown wallet");
  expect(walletName("Wallet B")).toBe("Wallet B");
});
