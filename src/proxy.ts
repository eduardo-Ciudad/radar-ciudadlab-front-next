import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE } from "@/lib/session";

export function proxy(request: NextRequest) {
  const authenticated = Boolean(request.cookies.get(ACCESS_COOKIE)?.value);
  const isLogin = request.nextUrl.pathname === "/login";

  if (!authenticated && !isLogin) return NextResponse.redirect(new URL("/login", request.url));
  if (authenticated && isLogin) return NextResponse.redirect(new URL("/sites", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/sites/:path*", "/leads/:path*"],
};
