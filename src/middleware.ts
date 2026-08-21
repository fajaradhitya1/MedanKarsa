import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Paksa middleware berjalan di Node.js runtime untuk menghindari error native module
export const runtime = "nodejs";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = (req.auth?.user as any)?.role;
  const isLoggedIn = !!req.auth;
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};