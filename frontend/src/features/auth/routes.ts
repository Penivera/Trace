import type { Route } from "next";

/**
 * Which paths need a signed-in player, and where people land after login.
 * Shared by the Proxy (optimistic redirect) and the login Server Action.
 */

/** Game sections: everything behind the dashboard shell. */
export const PROTECTED_PREFIXES = [
  "/dashboard",
  "/cases",
  "/investigation",
  "/evidence",
  "/academy",
] as const;

/** Pages a signed-in player has no reason to see. */
export const AUTH_PAGES = ["/login", "/signup"] as const;

export const AFTER_LOGIN: Route = "/dashboard" as Route;
export const LOGIN_PAGE: Route = "/login" as Route;

const matches = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

export function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => matches(pathname, prefix));
}

export function isAuthPage(pathname: string) {
  return AUTH_PAGES.some((page) => matches(pathname, page));
}

/**
 * The `next` parameter after login, or the dashboard. Only same-site paths
 * inside the game are accepted, so `?next=` can't be used as an open redirect
 * (`//evil.com`, `/\evil.com`, `https://…`) or bounce back to an auth page.
 */
export function safeRedirectPath(value: unknown): Route {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return AFTER_LOGIN;
  }
  if (value.includes("\\") || /[\u0000-\u001f]/.test(value)) return AFTER_LOGIN;

  // Resolve against a dummy origin: anything that leaves it is rejected.
  const url = new URL(value, "https://trace.invalid");
  if (url.origin !== "https://trace.invalid" || !isProtectedPath(url.pathname)) return AFTER_LOGIN;
  return `${url.pathname}${url.search}` as Route;
}
