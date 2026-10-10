import { z } from "zod";

const walletSummarySchema = z.object({
  id: z.string(),
  label: z.string(),
  /** Shortened for display. Solana addresses are case-sensitive: never re-case them. */
  address: z.string(),
});

const timelineEntrySchema = z.object({
  id: z.string(),
  /** UTC time of day, as shown on chain explorers. */
  time: z.string(),
  direction: z.enum(["in", "out"]),
  /** Integer lamports (1 SOL = 10^9). Format with `formatSol`, never float math. */
  amountLamports: z.number().int().nonnegative(),
  /** Other side of the transfer, shortened; null when not yet identified. */
  counterparty: z.string().nullable(),
  flagged: z.boolean(),
});

/** What a lead or link points at; pages turn it into a URL. */
const targetSchema = z.object({
  kind: z.enum(["transaction", "wallet"]),
  id: z.string(),
});

/** A "New lead" nudge shown when the player arrives on a page. */
const leadSchema = z.object({
  id: z.string(),
  /** Pill above the title, e.g. "New lead" or "Trace update". */
  badge: z.string(),
  /**
   * "arrival": shortly after the page opens.
   * "idle": only once the player has done nothing for a while (a nudge when stuck).
   */
  trigger: z.enum(["arrival", "idle"]),
  title: z.string(),
  /** Same `{{…}}` emphasis markup as case text. */
  message: z.string(),
  actionLabel: z.string(),
  target: targetSchema,
});

export type Lead = z.infer<typeof leadSchema>;
export type Target = z.infer<typeof targetSchema>;

export const workspaceSchema = z.object({
  caseId: z.string(),
  caseNumber: z.string(),
  codename: z.string(),
  objectives: z.array(z.object({ text: z.string(), done: z.boolean() })),
  investigator: z.object({ rank: z.string(), state: z.string() }),
  hint: z.string(),
  investigating: walletSummarySchema.extend({
    balanceLamports: z.number().int().nonnegative(),
    transactionCount: z.number().int().nonnegative(),
    tokenCount: z.number().int().nonnegative(),
  }),
  timeline: z.array(timelineEntrySchema),
  /** Wallets on the trail, in the order the funds moved. */
  trail: z.array(walletSummarySchema),
  /** Wallets seen in the case that are not on the money trail (e.g. a fee/dust recipient). */
  otherWallets: z.array(walletSummarySchema),
  evidenceCount: z.number().int().nonnegative(),
  lead: leadSchema.nullable(),
});

export type Workspace = z.infer<typeof workspaceSchema>;
export type TimelineEntry = z.infer<typeof timelineEntrySchema>;

const SOL = 1_000_000_000;

/** MOCK workspace state, values copied from the design. */
const workspaces: Record<string, Workspace> = {
  "case-001": {
    caseId: "case-001",
    caseNumber: "Case 001",
    codename: "The Missing Treasury",
    objectives: [
      { text: "Find the transaction where the funds left the treasury", done: false },
      { text: "Identify the receiving wallet", done: false },
      { text: "Trace the movement of the funds", done: false },
      { text: "Collect important evidence", done: false },
      { text: "Build your theory", done: false },
    ],
    investigator: { rank: "Rookie Investigator", state: "Investigating" },
    hint: "Start with the treasury's outgoing transfers around 02:43 UTC. Which one doesn't fit the pattern?",
    investigating: {
      id: "treasury",
      label: "Treasury Wallet",
      address: "7xH3k9 ... 92KD",
      balanceLamports: 50 * SOL,
      transactionCount: 342,
      tokenCount: 18,
    },
    timeline: [
      {
        id: "tx-1",
        time: "02:39:07",
        direction: "in",
        amountLamports: 5 * SOL,
        counterparty: "4K2c...11ZZ",
        flagged: false,
      },
      {
        id: "tx-2",
        time: "02:41:37",
        direction: "in",
        amountLamports: 10 * SOL,
        counterparty: "6A2c...11ZZ",
        flagged: false,
      },
      {
        id: "tx-3",
        time: "02:43:18",
        direction: "out",
        amountLamports: 20 * SOL,
        counterparty: "9J4K...82PL",
        flagged: true,
      },
      {
        id: "tx-4",
        time: "02:51:04",
        direction: "in",
        amountLamports: 2 * SOL,
        counterparty: "5B3d...22ff",
        flagged: false,
      },
      {
        id: "tx-5",
        time: "03:04:42",
        direction: "out",
        amountLamports: 1.5 * SOL,
        counterparty: null,
        flagged: false,
      },
    ],
    trail: [
      { id: "treasury", label: "Treasury Wallet", address: "7xH3k9 ... 92KD" },
      { id: "wallet-b", label: "Wallet B", address: "9J4K ... 82PL" },
      { id: "wallet-c", label: "Wallet C", address: "3P8N ... 45QR" },
      { id: "wallet-d", label: "Wallet D", address: "6P9R ... 78ST" },
      { id: "exchange", label: "Exchange Wallet", address: "8T3W ... 90UV" },
    ],
    otherWallets: [{ id: "unknown-1f5g", label: "Unknown wallet", address: "1F5g ... 44UU" }],
    evidenceCount: 0,
    lead: {
      id: "lead-time-window",
      title: "Something happened here.",
      message:
        "Start by checking the transactions around {{02:40–03:00 UTC}}. Look for anything that stands out.",
      actionLabel: "View transactions",
      badge: "New lead",
      trigger: "arrival",
      target: { kind: "transaction", id: "tx-3" },
    },
  },
};

/** Replace with `serverApi.get(\`/cases/${caseId}/workspace\`, workspaceSchema)` once available. */
/** A case is solved once every objective is done (derived, never stored separately). */
export function isSolved(workspace: Pick<Workspace, "objectives">) {
  return workspace.objectives.length > 0 && workspace.objectives.every((o) => o.done);
}

/**
 * MOCK preview of a finished case, until the backend tracks real progress:
 * every objective done, no pending lead.
 */
export type WorkspacePreview = "solved";

export async function getWorkspace(
  caseId: string,
  preview?: WorkspacePreview,
): Promise<Workspace | null> {
  let workspace: Workspace | null = null;
  try {
    const { serverApi } = await import("@/lib/api/server");
    workspace = await serverApi.get(`/cases/${caseId}/workspace`, workspaceSchema);
  } catch {
    const found = workspaces[caseId];
    workspace = found ? workspaceSchema.parse(found) : null;
  }
  if (!workspace) return null;
  if (preview !== "solved") return workspace;
  return {
    ...workspace,
    objectives: workspace.objectives.map((o) => ({ ...o, done: true })),
    lead: null,
  };
}

const transactionSchema = z.object({
  id: z.string(),
  /** Transaction signature, shortened for display (base58: never re-case it). */
  signature: z.string(),
  status: z.enum(["confirmed", "finalized", "failed"]),
  time: z.string(),
  amountLamports: z.number().int().nonnegative(),
  /** Wallet ids from the case trail; labels and addresses are looked up there. */
  fromWalletId: z.string(),
  toWalletId: z.string(),
  /** Player progress at this point. MOCK: the backend decides when an objective is met. */
  progress: z.object({ completed: z.number().int(), total: z.number().int() }),
  lead: leadSchema.nullable(),
});

export type Transaction = z.infer<typeof transactionSchema>;

/** Any wallet known to the case, on the trail or not. */
export function findCaseWallet(workspace: Pick<Workspace, "trail" | "otherWallets">, id: string) {
  return [...workspace.trail, ...workspace.otherWallets].find((w) => w.id === id);
}

/** MOCK transaction details by case, then transaction id. Signatures are placeholders. */
const transactions: Record<string, Record<string, Transaction>> = {
  "case-001": {
    "tx-3": {
      id: "tx-3",
      signature: "5fJ8...2K9L",
      status: "confirmed",
      time: "02:43:18 UTC",
      amountLamports: 20 * SOL,
      fromWalletId: "treasury",
      toWalletId: "wallet-b",
      progress: { completed: 1, total: 5 },
      lead: {
        id: "lead-receiving-wallet",
        title: "This wallet received the missing funds.",
        message: "Don't assume it's the final destination. Check what happened next.",
        actionLabel: "Investigate wallet",
        badge: "New lead",
        trigger: "arrival",
        target: { kind: "wallet", id: "wallet-b" },
      },
    },
    "tx-b-out": {
      id: "tx-b-out",
      signature: "3Gk2...Rw7M",
      status: "confirmed",
      time: "02:51:04 UTC",
      amountLamports: 20 * SOL,
      fromWalletId: "wallet-b",
      toWalletId: "wallet-c",
      progress: { completed: 1, total: 5 },
      lead: {
        id: "lead-funds-moving",
        badge: "Trace update",
        trigger: "idle",
        title: "The funds are moving.",
        message: "Keep following the 20 SOL through each hop until you find where it ends.",
        actionLabel: "Keep tracing",
        target: { kind: "wallet", id: "wallet-c" },
      },
    },
    "tx-b-dust": {
      id: "tx-b-dust",
      signature: "8Nq4...Dz1X",
      status: "confirmed",
      time: "02:55:20 UTC",
      amountLamports: 0.05 * SOL,
      fromWalletId: "wallet-b",
      toWalletId: "unknown-1f5g",
      progress: { completed: 1, total: 5 },
      lead: null,
    },
    "tx-c-out": {
      id: "tx-c-out",
      signature: "6Tw9...Kp4B",
      status: "confirmed",
      time: "02:58:37 UTC",
      amountLamports: 20 * SOL,
      fromWalletId: "wallet-c",
      toWalletId: "wallet-d",
      progress: { completed: 1, total: 5 },
      lead: null,
    },
    "tx-c-dust": {
      id: "tx-c-dust",
      signature: "2Lm5...Vh8Q",
      status: "confirmed",
      time: "03:01:12 UTC",
      amountLamports: 0.05 * SOL,
      fromWalletId: "wallet-c",
      toWalletId: "unknown-1f5g",
      progress: { completed: 1, total: 5 },
      lead: null,
    },
  },
};

export const transactionParams = Object.entries(transactions).flatMap(([caseId, byId]) =>
  Object.keys(byId).map((transactionId) => ({ caseId, transactionId })),
);

export async function getTransaction(caseId: string, id: string): Promise<Transaction | null> {
  try {
    const { serverApi } = await import("@/lib/api/server");
    return await serverApi.get(`/cases/${caseId}/transactions/${id}`, transactionSchema);
  } catch {
    const found = transactions[caseId]?.[id];
    return found ? transactionSchema.parse(found) : null;
  }
}

const walletActivitySchema = z.object({
  id: z.string(),
  time: z.string(),
  direction: z.enum(["in", "out"]),
  amountLamports: z.number().int().nonnegative(),
  /** Readable other side: a wallet label, or a shortened address if unknown. */
  counterparty: z.string(),
  /** Marked "KEY": matters to the case. */
  key: z.boolean(),
  /** The lead the player should follow next (amber outline). */
  flagged: z.boolean(),
  /** Where the row's link goes: the transaction, or the counterparty wallet. */
  link: targetSchema,
});

const walletDetailSchema = z.object({
  id: z.string(),
  label: z.string(),
  /** Full base58 address (case-sensitive). */
  address: z.string(),
  description: z.string(),
  balanceLamports: z.number().int().nonnegative(),
  transactionCount: z.number().int().nonnegative(),
  tokenCount: z.number().int().nonnegative(),
  /** ISO dates (YYYY-MM-DD); formatted for display in UTC. */
  firstActivity: z.iso.date(),
  lastActivity: z.iso.date(),
  /** Trail wallet ids on either side of this one. */
  receivedFromWalletId: z.string().nullable(),
  sentToWalletId: z.string().nullable(),
  activity: z.array(walletActivitySchema),
});

export type WalletDetail = z.infer<typeof walletDetailSchema>;
export type WalletActivity = z.infer<typeof walletActivitySchema>;

/** MOCK wallet details by case, then trail wallet id. Values copied from the design. */
const wallets: Record<string, Record<string, WalletDetail>> = {
  "case-001": {
    "wallet-b": {
      id: "wallet-b",
      label: "Wallet B",
      address: "9J4Kp2Lm8Qr5Vx3Nw7Zc1Tb6Fd4Gh9Mn2Qp8Rv5Vx3N82PL",
      description: "A freshly created wallet with no prior history. Received the missing funds.",
      balanceLamports: 0.5 * SOL,
      transactionCount: 12,
      tokenCount: 3,
      firstActivity: "2026-10-01",
      lastActivity: "2026-10-01",
      receivedFromWalletId: "treasury",
      sentToWalletId: "wallet-c",
      activity: [
        {
          id: "wb-1",
          time: "02:43:18",
          direction: "in",
          amountLamports: 20 * SOL,
          counterparty: "Treasury Wallet",
          key: true,
          flagged: false,
          link: { kind: "transaction", id: "tx-3" },
        },
        {
          id: "wb-2",
          time: "02:51:04",
          direction: "out",
          amountLamports: 20 * SOL,
          counterparty: "Wallet C",
          key: true,
          flagged: true,
          link: { kind: "transaction", id: "tx-b-out" },
        },
        {
          id: "wb-3",
          time: "02:55:20",
          direction: "out",
          amountLamports: 0.05 * SOL,
          counterparty: "1F5g...44UU",
          key: false,
          flagged: false,
          link: { kind: "transaction", id: "tx-b-dust" },
        },
      ],
    },
    "wallet-c": {
      id: "wallet-c",
      label: "Wallet C",
      address: "3P8NxQ7Lm2Vr5Kd9Wt4Zc6Hb1Fg8Jn3Ys7Mq2Ru5Ek45QR",
      description:
        "Another freshly created wallet. Received the 20 SOL from Wallet B minutes later.",
      balanceLamports: 0.5 * SOL,
      transactionCount: 12,
      tokenCount: 3,
      firstActivity: "2026-10-01",
      lastActivity: "2026-10-01",
      receivedFromWalletId: "wallet-b",
      sentToWalletId: "wallet-d",
      activity: [
        {
          id: "wc-1",
          time: "02:51:04",
          direction: "in",
          amountLamports: 20 * SOL,
          counterparty: "Wallet B",
          key: true,
          flagged: false,
          link: { kind: "transaction", id: "tx-b-out" },
        },
        {
          id: "wc-2",
          time: "02:58:37",
          direction: "out",
          amountLamports: 20 * SOL,
          counterparty: "Wallet D",
          key: true,
          flagged: true,
          link: { kind: "transaction", id: "tx-c-out" },
        },
        {
          id: "wc-3",
          time: "03:01:12",
          direction: "out",
          amountLamports: 0.05 * SOL,
          counterparty: "1F5g...44UU",
          key: false,
          flagged: false,
          link: { kind: "transaction", id: "tx-c-dust" },
        },
      ],
    },
  },
};

export const walletParams = Object.entries(wallets).flatMap(([caseId, byId]) =>
  Object.keys(byId).map((walletId) => ({ caseId, walletId })),
);

export async function getWalletDetail(caseId: string, id: string): Promise<WalletDetail | null> {
  try {
    const { serverApi } = await import("@/lib/api/server");
    return await serverApi.get(`/cases/${caseId}/wallets/${id}`, walletDetailSchema);
  } catch {
    const found = wallets[caseId]?.[id];
    return found ? walletDetailSchema.parse(found) : null;
  }
}
