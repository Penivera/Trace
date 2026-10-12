import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { signSession, verifySessionToken } from "./session-token";

const inAnHour = () => Math.floor(Date.now() / 1000) + 3600;

// There is no built-in secret; each test supplies one (a test-only value).
beforeEach(() => {
  vi.stubEnv("SESSION_SECRET", "test-only-secret-".padEnd(40, "x"));
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("session token", () => {
  it("round-trips a signed session", async () => {
    const token = await signSession({ sub: "demo-agent", exp: inAnHour() });
    expect(await verifySessionToken(token)).toMatchObject({ sub: "demo-agent" });
  });

  it("rejects an edited payload", async () => {
    const token = await signSession({ sub: "demo-agent", exp: inAnHour() });
    const [, signature] = token.split(".");
    const forgedBody = btoa(JSON.stringify({ sub: "admin", exp: inAnHour() }))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    expect(await verifySessionToken(`${forgedBody}.${signature}`)).toBeNull();
  });

  it("rejects a token signed with another secret", async () => {
    vi.stubEnv("SESSION_SECRET", "a".repeat(40));
    const token = await signSession({ sub: "demo-agent", exp: inAnHour() });
    vi.stubEnv("SESSION_SECRET", "b".repeat(40));
    expect(await verifySessionToken(token)).toBeNull();
  });

  it("rejects an expired session", async () => {
    const token = await signSession({ sub: "demo-agent", exp: inAnHour() });
    expect(await verifySessionToken(token, Date.now() + 2 * 3600 * 1000)).toBeNull();
  });

  it.each([undefined, "", "garbage", "a.b.c", "!!!.???"])(
    "rejects malformed input %j",
    async (value) => {
      expect(await verifySessionToken(value)).toBeNull();
    },
  );

  it.each(["development", "production"])("fails closed without a secret (%s)", async (env) => {
    vi.stubEnv("NODE_ENV", env);
    vi.stubEnv("SESSION_SECRET", "");
    await expect(signSession({ sub: "demo-agent", exp: inAnHour() })).rejects.toThrow(
      /SESSION_SECRET/,
    );
    expect(await verifySessionToken("anything.at-all")).toBeNull();
  });
});
