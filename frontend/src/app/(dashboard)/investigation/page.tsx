import type { Route } from "next";
import { redirect } from "next/navigation";

import { caseRoutes } from "@/features/cases/routes";
import { getDashboardSummary } from "@/features/dashboard/data";

// This page only redirects, so it can never render an instant shell.
export const instant = false;

/**
 * Placeholder until an investigations overview is designed: open the
 * workspace of the player's active case, or send them to the dashboard.
 */
export default async function InvestigationPage() {
  const { activeCase } = await getDashboardSummary();
  redirect(activeCase ? caseRoutes.workspace(activeCase.id) : ("/dashboard" as Route));
}
