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
  "case-002": {
    id: "case-002",
    number: "Case 002",
    title: "The 120,000 wETH Wormhole Bridge Exploit",
    brief: [
      "{{120,000 wETH}} (~$325M USD) was fraudulently minted on the Wormhole Solana Bridge.",
      "On {{February 2, 2022 at 18:24 UTC}}, an attacker exploited a vulnerability in the Wormhole core program on Solana.",
      "The attacker bypassed Guardian signature verification by injecting a fake Instructions sysvar account via deprecated {{load_instruction_at}}.",
      "A fraudulent Validator Action Approval (VAA) was posted via {{post_vaa}}, enabling {{complete_wrapped}} to mint 120,000 unbacked wETH.",
      "The attacker bridged 93,750 ETH directly to Ethereum address {{0x629e7Da20197a5429d30da36E77d06CdF796b71A}}.",
    ],
    objectives: [
      "Inspect the signature verification bypass transaction (tx-verify-bypass).",
      "Examine the fraudulent Guardian post_vaa authorization record.",
      "Trace the complete_wrapped mint transaction that spawned 120,000 wETH.",
      "Trace the capital outflow bridging 93,750 ETH across to Ethereum.",
      "Submit your forensic conclusion on the exploit vector and exit address.",
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
  "case-002": {
    id: "case-002",
    number: "Case 002",
    codename: "Operation Secp256k1 Bypass",
    difficulty: "Veteran",
    status: "open",
    briefing: [
      "{{120,000 wETH}} (~$325M USD) was fraudulently minted on the Wormhole Solana Bridge.",
      "On {{February 2, 2022 at 18:24 UTC}}, an attacker exploited a vulnerability in the Wormhole core program on Solana.",
      "The attacker bypassed Guardian signature verification by injecting a fake Instructions sysvar account via deprecated {{load_instruction_at}}.",
      "A fraudulent Validator Action Approval (VAA) was posted via {{post_vaa}}, enabling {{complete_wrapped}} to mint 120,000 unbacked wETH.",
      "The attacker bridged 93,750 ETH directly to Ethereum address {{0x629e7Da20197a5429d30da36E77d06CdF796b71A}}.",
    ],
    knownInformation: {
      initialWallet: "wormDTUJ...LBCgUb",
      missingAmount: "120,000 wETH ($325M)",
      approximateTime: "18 : 24 UTC",
    },
    objectives: [
      "Inspect the signature verification bypass transaction (tx-verify-bypass).",
      "Examine the fraudulent Guardian post_vaa authorization record.",
      "Trace the complete_wrapped mint transaction that spawned 120,000 wETH.",
      "Trace the capital outflow bridging 93,750 ETH across to Ethereum.",
      "Submit your forensic conclusion on the exploit vector and exit address.",
    ],
  },
};

/** Retrieve case file from backend serverApi or fallback to known case files. */
export async function getCaseFile(caseId: string): Promise<CaseFile | null> {
  try {
    const { serverApi } = await import("@/lib/api/server");
    return await serverApi.get(`/cases/${caseId}/file`, caseFileSchema);
  } catch {
    const found = caseFiles[caseId];
    return found ? caseFileSchema.parse(found) : null;
  }
}

/** Retrieve case brief from backend serverApi or fallback to known cases. */
export async function getCaseBrief(caseId: string): Promise<CaseBrief | null> {
  try {
    const { serverApi } = await import("@/lib/api/server");
    return await serverApi.get(`/cases/${caseId}`, caseBriefSchema);
  } catch {
    const found = cases[caseId];
    return found ? caseBriefSchema.parse(found) : null;
  }
}
