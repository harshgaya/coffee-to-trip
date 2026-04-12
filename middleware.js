import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("admin_auth")?.value;

  if (
    req.nextUrl.pathname.startsWith("/admin") &&
    !req.nextUrl.pathname.startsWith("/admin/login")
  ) {
    if (token !== "coffeetotrip_secure_2025") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
