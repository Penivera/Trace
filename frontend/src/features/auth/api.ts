import type { SignupValues } from "./schemas";

/**
 * Sign-up isn't defined by the backend yet. This throws until it is wired to
 * `api.post(...)` with a response schema, so the form surfaces a clear message
 * instead of pretending to succeed. (Login uses the demo-account Server Action
 * in ./actions.ts for now.)
 */
export class AuthNotConnectedError extends Error {
  override readonly name = "AuthNotConnectedError";
  constructor() {
    super("Sign-up isn't open yet. Ask the team for the demo login in the meantime.");
  }
}

export async function signup(_values: SignupValues): Promise<never> {
  throw new AuthNotConnectedError();
}
