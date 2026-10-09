"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { caseIds } from "@/features/cases/data";
import { setFlash } from "@/features/flash/server";
import { caseRoutes } from "@/features/cases/routes";
import { getInvestigator } from "@/features/investigators/data";
import {
  SELECTED_INVESTIGATOR_COOKIE,
  selectedInvestigatorCookieOptions,
} from "@/features/investigators/selection";

/**
 * SELECT on the dashboard: remember the investigator, then open the case.
 * Form values are untrusted input, so both ids are checked against known values
 * (this also means the redirect can only ever target a real case page).
 */
export async function selectInvestigator(formData: FormData) {
  const investigatorId = formData.get("investigatorId");
  const caseId = formData.get("caseId");

  const investigator =
    typeof investigatorId === "string" ? getInvestigator(investigatorId) : undefined;
  if (!investigator) throw new Error("Unknown investigator");

  (await cookies()).set(
    SELECTED_INVESTIGATOR_COOKIE,
    investigator.id,
    selectedInvestigatorCookieOptions,
  );
  await setFlash("investigator-selected");

  if (typeof caseId === "string" && caseIds.includes(caseId)) {
    redirect(caseRoutes.briefing(caseId));
  }
  redirect("/cases");
}
