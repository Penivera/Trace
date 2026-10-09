"use server";

import { z } from "zod";

import {
  evidenceSubmissionSchema,
  getEvidencePrompt,
  type EvidenceFormState,
} from "@/features/evidence/data";

/**
 * Receives the player's conclusion. Form data is untrusted: it is validated
 * against the case's own options before anything else happens.
 * TODO: forward to the backend, which scores it (the answer never leaves the server).
 */
export async function submitEvidence(
  caseId: string,
  _previous: EvidenceFormState,
  formData: FormData,
): Promise<EvidenceFormState> {
  const prompt = await getEvidencePrompt(caseId);
  if (!prompt) throw new Error("Unknown case");

  const values = {
    destination: (formData.get("destination") as string | null) ?? undefined,
    scenario: (formData.get("scenario") as string | null) ?? undefined,
    theory: (formData.get("theory") as string | null) ?? undefined,
  };

  const parsed = evidenceSubmissionSchema(prompt).safeParse(values);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      status: "invalid",
      values,
      fieldErrors: {
        destination: fieldErrors.destination?.[0],
        scenario: fieldErrors.scenario?.[0],
        theory: fieldErrors.theory?.[0],
      },
    };
  }

  return {
    status: "received",
    message:
      "Evidence received. Scoring isn't connected yet: the backend will check your conclusion.",
  };
}
