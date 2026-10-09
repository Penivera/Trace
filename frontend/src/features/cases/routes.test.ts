import { expect, it } from "vitest";

import { caseRoutes } from "./routes";

it("puts the briefing, offer and case file under /cases", () => {
  expect(caseRoutes.briefing("case-001")).toBe("/cases/case-001");
  expect(caseRoutes.offer("case-001")).toBe("/cases/case-001/accept");
  expect(caseRoutes.file("case-001")).toBe("/cases/case-001/file");
});

it("puts the workspace and its drill-downs under /investigation", () => {
  expect(caseRoutes.workspace("case-001")).toBe("/investigation/case-001");
  expect(caseRoutes.transaction("case-001", "tx-3")).toBe(
    "/investigation/case-001/transactions/tx-3",
  );
});

it("resolves lead targets to their pages", () => {
  expect(caseRoutes.target("case-001", { kind: "wallet", id: "wallet-b" })).toBe(
    "/investigation/case-001/wallets/wallet-b",
  );
  expect(caseRoutes.target("case-001", { kind: "transaction", id: "tx-3" })).toBe(
    "/investigation/case-001/transactions/tx-3",
  );
});

it("puts the notebook under /evidence", () => {
  expect(caseRoutes.evidence("case-001")).toBe("/evidence/case-001");
});

it("encodes ids so they cannot break out of their path segment", () => {
  expect(caseRoutes.wallet("case-001", "a/b?c")).toBe("/investigation/case-001/wallets/a%2Fb%3Fc");
});
