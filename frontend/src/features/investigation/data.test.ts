import { describe, expect, it } from "vitest";

import { getWorkspace, isSolved } from "./data";

describe("isSolved", () => {
  it("is true only when every objective is done", () => {
    expect(
      isSolved({
        objectives: [
          { text: "a", done: true },
          { text: "b", done: true },
        ],
      }),
    ).toBe(true);
    expect(
      isSolved({
        objectives: [
          { text: "a", done: true },
          { text: "b", done: false },
        ],
      }),
    ).toBe(false);
    expect(isSolved({ objectives: [] })).toBe(false);
  });
});

describe("getWorkspace", () => {
  it("returns the in-progress case by default", async () => {
    const workspace = await getWorkspace("case-001");
    expect(workspace && isSolved(workspace)).toBe(false);
    expect(workspace?.lead).not.toBeNull();
  });

  it("previews the solved case with no pending lead", async () => {
    const workspace = await getWorkspace("case-001", "solved");
    expect(workspace && isSolved(workspace)).toBe(true);
    expect(workspace?.lead).toBeNull();
  });
});
