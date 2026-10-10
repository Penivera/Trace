import { z } from "zod";

/**
 * The final question of a case. Only the *choices* live here: which option is
 * correct must stay on the server (anything sent to the browser is readable).
 */
const evidencePromptSchema = z.object({
  caseId: z.string(),
  /** Trail wallet ids the player can pick as the final destination. */
  destinationWalletIds: z.array(z.string()).min(2),
  scenarios: z.array(z.object({ id: z.string(), label: z.string() })).min(2),
  theoryPlaceholder: z.string(),
});

export type EvidencePrompt = z.infer<typeof evidencePromptSchema>;

export const THEORY_MIN_LENGTH = 20;
export const THEORY_MAX_LENGTH = 2000;

/** MOCK prompts by case, copied from the design. */
const prompts: Record<string, EvidencePrompt> = {
  "case-001": {
    caseId: "case-001",
    destinationWalletIds: ["wallet-b", "wallet-c", "wallet-d", "exchange"],
    scenarios: [
      { id: "direct", label: "A single direct transfer" },
      { id: "layered", label: "Layered through multiple wallets then cashed out" },
      { id: "swapped", label: "Swapped into a token then back" },
      { id: "burned", label: "Burned to a null address" },
    ],
    theoryPlaceholder:
      "Explain the trail in your own words... e.g. 'The 20 SOL left the treasury at 02:43, hopped through three fresh wallets, and ended at an exchange deposit address.'",
  },
};

export const evidenceCaseIds = Object.keys(prompts);

export async function getEvidencePrompt(caseId: string): Promise<EvidencePrompt | null> {
  try {
    const { serverApi } = await import("@/lib/api/server");
    return await serverApi.get(`/cases/${caseId}/evidence-prompt`, evidencePromptSchema);
  } catch {
    const found = prompts[caseId];
    return found ? evidencePromptSchema.parse(found) : null;
  }
}

/**
 * Validates a submission against the case's own choices, so a tampered form
 * can't submit an option that was never offered.
 */
export function evidenceSubmissionSchema(prompt: EvidencePrompt) {
  return z.object({
    destination: z.enum(prompt.destinationWalletIds as [string, ...string[]], {
      error: "Choose the wallet where the funds ended up",
    }),
    scenario: z.enum(prompt.scenarios.map((s) => s.id) as [string, ...string[]], {
      error: "Choose what happened to the funds",
    }),
    theory: z
      .string()
      .trim()
      .min(THEORY_MIN_LENGTH, `Explain the trail in at least ${THEORY_MIN_LENGTH} characters`)
      .max(THEORY_MAX_LENGTH, `Keep your theory under ${THEORY_MAX_LENGTH} characters`),
  });
}

export type EvidenceFormState =
  | { status: "idle" }
  | {
      status: "invalid";
      fieldErrors: Partial<Record<"destination" | "scenario" | "theory", string>>;
      values: { destination?: string; scenario?: string; theory?: string };
    }
  | { status: "received"; message: string };
