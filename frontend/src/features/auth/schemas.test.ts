import { describe, expect, it } from "vitest";

import { loginSchema, signupSchema } from "./schemas";

describe("loginSchema", () => {
  it("normalizes the email before validating it", () => {
    const result = loginSchema.parse({
      email: "  Alex@Example.COM ",
      password: "x",
      remember: false,
    });
    expect(result.email).toBe("alex@example.com");
  });

  it("rejects an invalid email and an empty password", () => {
    const result = loginSchema.safeParse({ email: "alex", password: "", remember: false });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.path[0])).toEqual(["email", "password"]);
  });
});

describe("signupSchema", () => {
  const valid = {
    username: "alex_trace",
    email: "alex@example.com",
    password: "correct-horse",
    confirmPassword: "correct-horse",
  };

  it("accepts valid input", () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it("reports mismatched passwords on the confirm field", () => {
    const result = signupSchema.safeParse({ ...valid, confirmPassword: "different" });
    expect(result.error?.issues[0]).toMatchObject({
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });
  });

  it.each([
    ["too short", "ab"],
    ["invalid characters", "alex trace!"],
  ])("rejects a username that is %s", (_, username) => {
    expect(signupSchema.safeParse({ ...valid, username }).success).toBe(false);
  });

  it("requires a minimum password length", () => {
    const result = signupSchema.safeParse({
      ...valid,
      password: "short",
      confirmPassword: "short",
    });
    expect(result.error?.issues[0]?.path).toEqual(["password"]);
  });
});
