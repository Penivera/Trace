import { describe, expect, it } from "vitest";

import { evidenceSubmissionSchema, getEvidencePrompt } from "./data";

describe("evidenceSubmissionSchema", async () => {
  const prompt = (await getEvidencePrompt("case-001"))!;
  const schema = evidenceSubmissionSchema(prompt);
  const valid = {
    destination: "exchange",
    scenario: "layered",
    theory: "The 20 SOL hopped through three fresh wallets to an exchange.",
  };

  it("accepts a complete submission", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("rejects options the case never offered (tampered form)", () => {
    expect(schema.safeParse({ ...valid, destination: "treasury" }).success).toBe(false);
    expect(schema.safeParse({ ...valid, scenario: "hacked" }).success).toBe(false);
  });

  it("requires a theory of reasonable length", () => {
    const result = schema.safeParse({ ...valid, theory: "  too short  " });
    expect(result.error?.issues[0]?.path).toEqual(["theory"]);
  });

  it("never exposes which answer is correct", () => {
    expect(JSON.stringify(prompt)).not.toMatch(/correct|answer|solution/i);
  });
});
