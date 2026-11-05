import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/session-token";

export function proxy(request: NextRequest) {
  const loggedIn = isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  const onLogin = request.nextUrl.pathname === "/admin/login";

  if (onLogin && loggedIn) return NextResponse.redirect(new URL("/admin/parts", request.url));
  if (!onLogin && !loggedIn) return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
