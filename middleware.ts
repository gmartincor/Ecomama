import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";

// Force Node.js runtime for middleware to avoid Edge Runtime size limits
export const runtime = 'nodejs';

const PUBLIC_ROUTES = ["/", "/login", "/register"];
const AUTH_ROUTES = ["/login", "/register"];
const DASHBOARD_ROUTE = "/dashboard";
const API_AUTH_ROUTES = ["/api/auth"];
const PROFILE_CHECK_ROUTES = ["/api/users/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API auth routes to pass through
  if (API_AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow profile check API routes
  if (PROFILE_CHECK_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const session = await auth();

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isSuperadminRoute = pathname.startsWith('/superadmin');
  const isProfileRoute = pathname.startsWith('/profile/me');
  const isDashboardRoute = pathname === DASHBOARD_ROUTE;

  // Redirect unauthenticated users to login
  if (!session && !isPublicRoute) {
    const url = new URL('/login', request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (session && isAuthRoute) {
    const redirectPath = session.user.role === 'SUPERADMIN' ? '/superadmin/dashboard' : '/tablon';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Allow dashboard route
  if (isDashboardRoute) {
    return NextResponse.next();
  }

  // Profile completion check is now handled client-side via layout
  // to avoid Edge Runtime incompatibility with Prisma

  // Protect superadmin routes
  if (isSuperadminRoute && session?.user.role !== 'SUPERADMIN') {
    return NextResponse.redirect(new URL('/tablon', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
