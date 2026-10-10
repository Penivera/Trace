import { z } from "zod";

/** The scored result of a finished case. Computed by the backend, never in the browser. */
const caseOutcomeSchema = z.object({
  caseId: z.string(),
  title: z.string(),
  summary: z.string(),
  score: z.number().int().nonnegative(),
  maxScore: z.number().int().positive(),
  clues: z.object({ found: z.number().int(), total: z.number().int() }),
  evidenceCollected: z.number().int().nonnegative(),
  traces: z.object({ correct: z.number().int(), total: z.number().int() }),
  hintsUsed: z.number().int().nonnegative(),
});

export type CaseOutcome = z.infer<typeof caseOutcomeSchema>;

/** MOCK outcomes, values from the Figma "Case solved" screen. */
const outcomes: Record<string, CaseOutcome> = {
  "case-001": {
    caseId: "case-001",
    title: "The missing 20 SOL",
    summary: "You followed the trail to the end. The vault mysteries have been decoded.",
    score: 100,
    maxScore: 100,
    clues: { found: 5, total: 5 },
    evidenceCollected: 2,
    traces: { correct: 5, total: 5 },
    hintsUsed: 0,
  },
};

export const outcomeCaseIds = Object.keys(outcomes);

export async function getCaseOutcome(caseId: string): Promise<CaseOutcome | null> {
  try {
    const { serverApi } = await import("@/lib/api/server");
    return await serverApi.get(`/cases/${caseId}/outcome`, caseOutcomeSchema);
  } catch {
    const found = outcomes[caseId];
    return found ? caseOutcomeSchema.parse(found) : null;
  }
}
