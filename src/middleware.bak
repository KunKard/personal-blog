import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple middleware without auth() wrapper so the site works without Supabase configured.
// When auth is set up, uncomment the auth import and use auth() wrapper pattern.
export function middleware(req: NextRequest) {
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  // Allow public access to login page and all non-admin routes
  if (!req.nextUrl.pathname.startsWith("/admin") || isLoginPage) {
    return NextResponse.next();
  }

  // For admin routes (except login), check for session cookie
  const sessionCookie =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
