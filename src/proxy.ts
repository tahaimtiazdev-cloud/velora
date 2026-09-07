import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PROTECTED_PREFIXES = ["/account"];
const AUTH_PAGES = ["/login", "/register"];

/**
 * Optimistic route protection (reads the session from the JWT cookie only —
 * no DB hit). This is a fast first line of defense; the actual page
 * components still call requireUser()/auth() themselves as the real
 * authorization check, per Next.js's own guidance that proxy/middleware
 * should not be the only line of defense.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname === p);

  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && req.auth) {
    return NextResponse.redirect(new URL("/account", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*", "/login", "/register"],
};
