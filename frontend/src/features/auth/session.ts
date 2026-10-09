import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { z } from "zod";

import { findUser } from "./demo-account";
import { LOGIN_PAGE } from "./routes";
import { SESSION_COOKIE, signSession, verifySessionToken } from "./session-token";

export const currentUserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  avatar: z.object({ src: z.string() }),
});

export type CurrentUser = z.infer<typeof currentUserSchema>;

const HOUR = 60 * 60;
/** "Remember me" keeps the player signed in for 30 days; otherwise 12 hours, browser session only. */
const REMEMBER_SECONDS = 30 * 24 * HOUR;
const SESSION_SECONDS = 12 * HOUR;

export async function createSession(userId: string, remember: boolean) {
  const lifetime = remember ? REMEMBER_SECONDS : SESSION_SECONDS;
  const token = await signSession({ sub: userId, exp: Math.floor(Date.now() / 1000) + lifetime });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, // not readable from JavaScript, so XSS can't steal it
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax", // not sent on cross-site POSTs (CSRF)
    path: "/",
    // Without maxAge it's a session cookie that ends with the browser.
    ...(remember && { maxAge: lifetime }),
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/**
 * The signed-in player's session, or a redirect to the login page. This is
 * the real check: the Proxy only redirects early. Call it (or getCurrentUser)
 * wherever player data is read. Memoised per request.
 */
export const verifySession = cache(async () => {
  // Request-time only: the expiry check reads the clock, which must never be
  // frozen into a prerendered shell.
  await connection();
  const session = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) redirect(LOGIN_PAGE);
  return session;
});

/**
 * The signed-in player. MOCK: resolves the demo account until the backend has
 * a `/me` endpoint; then call `serverApi.get("/me", currentUserSchema)`
 * forwarding the session cookie.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser> => {
  const session = await verifySession();
  const user = findUser(session.sub);
  if (!user) redirect(LOGIN_PAGE);
  return user;
});
