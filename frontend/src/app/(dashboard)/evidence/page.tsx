import type { Route } from "next";
import { redirect } from "next/navigation";

import { caseRoutes } from "@/features/cases/routes";
import { getDashboardSummary } from "@/features/dashboard/data";

// This page only redirects, so it can never render an instant shell.
export const instant = false;

/** Placeholder until an evidence overview is designed: open the active case's evidence. */
export default async function EvidenceIndexPage() {
  const { activeCase } = await getDashboardSummary();
  redirect(activeCase ? caseRoutes.evidence(activeCase.id) : ("/dashboard" as Route));
}
