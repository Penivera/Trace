import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

import type { CurrentUser } from "./session";

/*
 * MOCK: one shared demo account so the team can sign in before the backend's
 * auth endpoints exist. Delete this file once login calls the backend.
 *
 * Credentials come from DEMO_LOGIN_EMAIL / DEMO_LOGIN_PASSWORD. Outside
 * production they default to the values documented in .env.example; in
 * production both must be set or demo login is switched off.
 */

const DEV_DEFAULTS = { email: "agent@trace.demo", password: "TraceAgent#2026" };

export const DEMO_USER: CurrentUser = {
  id: "demo-agent",
  displayName: "Diva Montess",
  avatar: { src: "/avatars/diva-montess.jpg" },
};

function demoCredentials() {
  const email = process.env.DEMO_LOGIN_EMAIL;
  const password = process.env.DEMO_LOGIN_PASSWORD;
  if (email && password) return { email: email.trim().toLowerCase(), password };
  return process.env.NODE_ENV === "production" ? null : DEV_DEFAULTS;
}

/** Compares via fixed-length digests so neither length nor content leaks through timing. */
function sameSecret(a: string, b: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

/** The demo player if the credentials match, otherwise null. */
export function verifyDemoCredentials(email: string, password: string): CurrentUser | null {
  const demo = demoCredentials();
  if (!demo) return null;
  // Evaluate both, so a wrong email takes as long as a wrong password.
  const emailOk = sameSecret(email.trim().toLowerCase(), demo.email);
  const passwordOk = sameSecret(password, demo.password);
  return emailOk && passwordOk ? DEMO_USER : null;
}

/** Players the mock session can resolve. */
export function findUser(id: string): CurrentUser | null {
  return id === DEMO_USER.id ? DEMO_USER : null;
}
