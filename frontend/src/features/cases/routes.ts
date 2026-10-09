import type { Route } from "next";

const id = (value: string) => encodeURIComponent(value);

/**
 * URLs for the case flow, grouped by the sidebar section they belong to:
 * CASES (briefing → offer → case file) → INVESTIGATION (workspace) → EVIDENCE.
 */
export const caseRoutes = {
  // CASES
  briefing: (caseId: string) => `/cases/${id(caseId)}` as Route,
  offer: (caseId: string) => `/cases/${id(caseId)}/accept` as Route,
  file: (caseId: string) => `/cases/${id(caseId)}/file` as Route,

  // INVESTIGATION
  workspace: (caseId: string) => `/investigation/${id(caseId)}` as Route,
  // Screens below are not designed yet; links resolve to the 404 page until they are.
  wallet: (caseId: string, walletId: string) =>
    `/investigation/${id(caseId)}/wallets/${id(walletId)}` as Route,
  transaction: (caseId: string, transactionId: string) =>
    `/investigation/${id(caseId)}/transactions/${id(transactionId)}` as Route,

  /** End-of-case results (not designed yet). */
  outcome: (caseId: string) => `/investigation/${id(caseId)}/outcome` as Route,

  /** Resolve a lead/link target (`{ kind, id }`) to its page. */
  target: (caseId: string, target: { kind: "transaction" | "wallet"; id: string }): Route =>
    target.kind === "wallet"
      ? caseRoutes.wallet(caseId, target.id)
      : caseRoutes.transaction(caseId, target.id),

  // EVIDENCE
  evidence: (caseId: string) => `/evidence/${id(caseId)}` as Route,
};
