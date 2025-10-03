import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";

const publicRoutes = ["/", "/login", "/register", "/communities/map"];
const authRoutes = ["/login", "/register"];
const superadminRoutes = ["/superadmin"];
const regularUserRoutes = ["/community", "/dashboard", "/profile", "/settings", "/requests"];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);
  const isSuperadminRoute = superadminRoutes.some((route) => pathname.startsWith(route));
  const isRegularUserRoute = regularUserRoutes.some((route) => pathname.startsWith(route));

  if (!session && !isPublicRoute) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (session && isAuthRoute) {
    if (session.user.role === "SUPERADMIN") {
      return NextResponse.redirect(new URL("/superadmin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isSuperadminRoute && session?.user.role !== "SUPERADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isRegularUserRoute && session?.user.role === "SUPERADMIN") {
    return NextResponse.redirect(new URL("/superadmin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
