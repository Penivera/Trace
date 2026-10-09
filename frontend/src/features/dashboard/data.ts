import { z } from "zod";

export const dashboardSummarySchema = z.object({
  activeCase: z.object({ id: z.string(), label: z.string() }).nullable(),
  objectives: z.object({ completed: z.number().int(), total: z.number().int() }),
  evidenceCount: z.number().int(),
  academy: z.object({ completed: z.number().int(), total: z.number().int() }),
});

export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;

/**
 * MOCK until the backend exposes the player's progress. Replace the body with
 * `serverApi.get("/me/dashboard", dashboardSummarySchema)`; callers stay the same.
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  return dashboardSummarySchema.parse({
    activeCase: { id: "case-001", label: "Case 001" },
    objectives: { completed: 1, total: 5 },
    evidenceCount: 0,
    academy: { completed: 0, total: 8 },
  });
}
