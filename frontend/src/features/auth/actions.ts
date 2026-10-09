"use server";

import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { setFlash } from "@/features/flash/server";

import { verifyDemoCredentials } from "./demo-account";
import { clearFailures, recordFailure, retryAfterMinutes } from "./rate-limit";
import { LOGIN_PAGE, safeRedirectPath } from "./routes";
import { loginSchema } from "./schemas";
import { createSession, deleteSession } from "./session";
import { SessionConfigError } from "./session-token";

/** Either why sign-in failed, or where to go next (always a safe, same-site game path). */
export type LoginResult = { error: string } | { redirectTo: Route; displayName: string };

/** Best-effort client IP for throttling (set by the hosting proxy). */
async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/**
 * Sign in. Server Actions are public endpoints, so everything is re-checked
 * here: input shape, throttling, credentials. Next.js also rejects
 * cross-origin calls to Server Actions (Origin vs Host), which covers CSRF.
 * On success it returns the destination rather than calling redirect(): the
 * form calls this directly, and a redirect thrown from an awaited action would
 * land in the form's error handling.
 */
export async function loginAction(values: unknown, next?: unknown): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return { error: "Enter a valid email and password." };
  const { email, password, remember } = parsed.data;

  const throttleKey = `${await clientIp()}|${email}`;
  const wait = retryAfterMinutes(throttleKey);
  if (wait > 0) {
    return { error: `Too many attempts. Try again in ${wait} minute${wait === 1 ? "" : "s"}.` };
  }

  const user = verifyDemoCredentials(email, password);
  if (!user) {
    recordFailure(throttleKey);
    // Same message for unknown email and wrong password: don't confirm which accounts exist.
    return { error: "Incorrect email or password." };
  }

  try {
    await createSession(user.id, remember);
  } catch (error) {
    if (error instanceof SessionConfigError) {
      console.error(`[auth] ${error.message}`);
      return { error: "Sign-in isn't configured on this server yet." };
    }
    throw error;
  }
  clearFailures(throttleKey);

  return { redirectTo: safeRedirectPath(next), displayName: user.displayName };
}

export async function logoutAction() {
  await deleteSession();
  await setFlash("signed-out");
  redirect(LOGIN_PAGE);
}
