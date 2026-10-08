import "server-only";

import { cookies } from "next/headers";

import { defaultInvestigatorId, getInvestigator, type Investigator } from "./data";

/**
 * MOCK persistence: the chosen investigator is kept in a cookie until the
 * backend stores it on the player profile. Then replace both functions with
 * API calls; callers stay the same.
 */
export const SELECTED_INVESTIGATOR_COOKIE = "trace_investigator";

export const selectedInvestigatorCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
} as const;

/**
 * Product decision (2026-10-08): until the backend endpoints are integrated,
 * every case page shows the default investigator (the one in the designs).
 * SELECT still records the choice, so switching back is just this flag, or
 * replacing the body below with the player-profile API call.
 */
const SHOW_PLAYER_CHOICE = false;

/** The player's chosen investigator, or the default one if none was picked (or the cookie is junk). */
export async function getSelectedInvestigator(): Promise<Investigator> {
  const fallback = getInvestigator(defaultInvestigatorId)!;
  if (!SHOW_PLAYER_CHOICE) return fallback;

  const id = (await cookies()).get(SELECTED_INVESTIGATOR_COOKIE)?.value;
  return getInvestigator(id) ?? fallback;
}
