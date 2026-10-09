import type { Route } from "next";
import { redirect } from "next/navigation";

import { caseRoutes } from "@/features/cases/routes";
import { getDashboardSummary } from "@/features/dashboard/data";

// This page only redirects, so it can never render an instant shell.
export const instant = false;

/**
 * Placeholder until the cases list is designed: open the player's active
 * case, or send them to pick an investigator on the dashboard.
 */
export default async function CasesPage() {
  const { activeCase } = await getDashboardSummary();
  redirect(activeCase ? caseRoutes.briefing(activeCase.id) : ("/dashboard" as Route));
}
