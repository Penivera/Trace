import type { LoginValues, SignupValues } from "./schemas";

/**
 * Auth endpoints are not defined by the backend yet. These throw until they
 * are wired to `api.post(...)` with response schemas, so the forms surface a
 * clear message instead of pretending to succeed.
 */
export class AuthNotConnectedError extends Error {
  override readonly name = "AuthNotConnectedError";
  constructor() {
    super("Sign-in isn't connected yet. The backend endpoints are on the way.");
  }
}

export async function login(_values: LoginValues): Promise<never> {
  throw new AuthNotConnectedError();
}

export async function signup(_values: SignupValues): Promise<never> {
  throw new AuthNotConnectedError();
}
