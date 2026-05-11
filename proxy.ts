import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");

  if (!isAdminPage) {
    return NextResponse.next();
  }

  const auth = request.cookies.get("admin-auth");

  if (!auth) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
