import { type NextRequest, NextResponse } from "next/server";

import { AFTER_LOGIN, isAuthPage, isProtectedPath, LOGIN_PAGE } from "@/features/auth/routes";
import { SESSION_COOKIE, verifySessionToken } from "@/features/auth/session-token";

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
    return response;
  }

  if (session && isAuthPage(pathname)) {
    return NextResponse.redirect(new URL(AFTER_LOGIN, request.url));
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
