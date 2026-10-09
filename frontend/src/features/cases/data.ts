import { z } from "zod";

export const caseBriefSchema = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  /**
   * Paragraphs. Wrap text in `{{…}}` to highlight it (amounts, times, key phrases).
   * Use \u00a0 (non-breaking space) inside short values like "20 SOL" so they never split across lines.
   */
  brief: z.array(z.string()),
  objectives: z.array(z.string()),
});

export type CaseBrief = z.infer<typeof caseBriefSchema>;

/** MOCK case content until the backend serves cases. Keyed by case id. */
const cases: Record<string, CaseBrief> = {
  "case-001": {
    id: "case-001",
    number: "Case 001",
    title: "Trace the missing 20 SOL",
    brief: [
      "{{20 SOL}} disappeared. Find out where it went.",
      "At {{02:43 UTC}}, a project's treasury wallet sent {{20 SOL}} to an unknown wallet.",
      "No one authorized the transfer.",
      "The treasury wallet had been holding funds for an upcoming project launch. Minutes after the transfer, the receiving wallet moved the funds again.",
      "Someone is moving the money. Your job is to {{find out where it went.}}",
    ],
    objectives: [
      "Identify the transaction where the 20 SOL left the treasury.",
      "Investigate the wallet that received the funds.",
      "Find out where the 20 SOL went after arriving.",
      "Save the transactions and wallets that help explain the trail.",
      "Use your investigation board to reconstruct the movement of the funds.",
      "Explain where the money went and what happened to it.",
    ],
  },
};

export const caseIds = Object.keys(cases);

/** The case file the player reviews after accepting, before the investigation starts. */
export const caseFileSchema = z.object({
  id: z.string(),
  number: z.string(),
  codename: z.string(),
  difficulty: z.string(),
  status: z.enum(["open", "solved", "closed"]),
  /** Paragraphs, with the same `{{…}}` highlight markup as the brief. */
  briefing: z.array(z.string()),
  knownInformation: z.object({
    /** Shortened address for display. Solana addresses are case-sensitive: never re-case them. */
    initialWallet: z.string(),
    missingAmount: z.string(),
    approximateTime: z.string(),
  }),
  objectives: z.array(z.string()),
});

export type CaseFile = z.infer<typeof caseFileSchema>;

/** MOCK case files until the backend serves them. Values copied from the design. */
const caseFiles: Record<string, CaseFile> = {
  "case-001": {
    id: "case-001",
    number: "Case 001",
    codename: "The Missing Treasury",
    difficulty: "Rookie",
    status: "open",
    briefing: [
      "At {{02:43 UTC}}, 20 SOL disappeared from a project's treasury wallet.",
      "The funds were moved through several wallets.",
      "Your task is to determine where the money went and identify the trail that connects the wallets.",
    ],
    knownInformation: {
      initialWallet: "7XH3 . . . 92KD",
      missingAmount: "20 SOL",
      approximateTime: "02 : 3 MIN",
    },
    objectives: [
      "Find the transaction where the funds left the treasury",
      "Identify the receiving wallet",
      "Trace the movement of the funds",
      "Collect important evidence",
      "Build your theory",
    ],
  },
};

/** Replace with `serverApi.get(\`/cases/${caseId}/file\`, caseFileSchema)` once available. */
export async function getCaseFile(caseId: string): Promise<CaseFile | null> {
  const found = caseFiles[caseId];
  return found ? caseFileSchema.parse(found) : null;
}

/** Replace with `serverApi.get(\`/cases/${caseId}\`, caseBriefSchema)` once available. */
export async function getCaseBrief(caseId: string): Promise<CaseBrief | null> {
  const found = cases[caseId];
  return found ? caseBriefSchema.parse(found) : null;
}
