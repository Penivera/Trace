import { type NextRequest, NextResponse } from "next/server";

import { AFTER_LOGIN, isAuthPage, isProtectedPath, LOGIN_PAGE } from "@/features/auth/routes";
import { SESSION_COOKIE, verifySessionToken } from "@/features/auth/session-token";
import { FLASH_COOKIE, type FlashKey, flashCookieOptions } from "@/features/flash/messages";

/**
 * Prefetches run the Proxy too (e.g. the landing page prefetching /dashboard).
 * They must not queue a toast for a page the visitor hasn't opened.
 */
function isPrefetch(request: NextRequest) {
  return (
    request.headers.has("next-router-prefetch") ||
    /prefetch/i.test(request.headers.get("sec-purpose") ?? request.headers.get("purpose") ?? "")
  );
}

function withFlash(response: NextResponse, request: NextRequest, key: FlashKey) {
  if (!isPrefetch(request)) response.cookies.set(FLASH_COOKIE, key, flashCookieOptions);
  return response;
}

/**
 * Runs before every game and auth page (see `config.matcher`).
 *
 * - Signed-out visitors to a game page are sent to /login, which brings them
 *   back afterwards via `?next=` (validated by `safeRedirectPath`).
 * - Signed-in players visiting /login or /signup go to the dashboard.
 *
 * The cookie's signature is verified here, so a forged or edited cookie
 * doesn't get through. This is still only the early check: data access
 * re-checks with `verifySession()`, because a Proxy can be skipped by a
 * matcher mistake and layouts don't re-render on every navigation.
 *
 * Redirects also leave a flash message so the next page can explain why.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session && isProtectedPath(pathname)) {
    const login = new URL(LOGIN_PAGE, request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    const response = NextResponse.redirect(login);
    // Clear an expired or tampered cookie instead of re-checking it every request.
    if (token) response.cookies.delete(SESSION_COOKIE);
    return withFlash(response, request, token ? "session-expired" : "auth-required");
  }

  if (session && isAuthPage(pathname)) {
    return withFlash(
      NextResponse.redirect(new URL(AFTER_LOGIN, request.url)),
      request,
      "already-signed-in",
    );
  }

  return NextResponse.next();
}

export const config = {
  // Only the routes the rules above care about; static files and /api never run it.
  matcher: [
    "/dashboard/:path*",
    "/cases/:path*",
    "/investigation/:path*",
    "/evidence/:path*",
    "/academy/:path*",
    "/login",
    "/signup",
  ],
};
