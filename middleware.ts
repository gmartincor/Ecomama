import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";
import { checkProfileCompletion } from "@/lib/utils/profile-checker";
import {
  ROUTE_CONFIG,
  DEFAULT_REDIRECTS,
  isRouteMatch,
  shouldRedirectSuperadmin,
  shouldRedirectRegularUser,
} from "@/lib/auth/route-config";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isPublicRoute = isRouteMatch(pathname, ROUTE_CONFIG.public);
  const isAuthRoute = ROUTE_CONFIG.auth.includes(pathname as typeof ROUTE_CONFIG.auth[number]);
  const isSuperadminRoute = isRouteMatch(pathname, ROUTE_CONFIG.superadmin);
  const isSharedRoute = isRouteMatch(pathname, ROUTE_CONFIG.shared);
  const isProfileRoute = pathname.startsWith('/profile/me');
  const isDashboardRoute = pathname === '/dashboard';

  if (!session && !isPublicRoute) {
    const url = new URL(DEFAULT_REDIRECTS.unauthorized, request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (session && session.user.role !== "SUPERADMIN" && !isProfileRoute && !isPublicRoute && !isDashboardRoute) {
    const profileStatus = await checkProfileCompletion(session.user.id);
    
    if (!profileStatus.isComplete) {
      return NextResponse.redirect(new URL('/profile/me/edit?firstTime=true', request.url));
    }
  }

  if (isSuperadminRoute && shouldRedirectRegularUser(pathname, session?.user.role)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isSharedRoute) {
    return NextResponse.next();
  }

  if (shouldRedirectSuperadmin(pathname, session?.user.role)) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECTS.superadmin, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
