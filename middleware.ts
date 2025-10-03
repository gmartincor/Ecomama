import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";
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

  if (!session && !isPublicRoute) {
    const url = new URL(DEFAULT_REDIRECTS.unauthorized, request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (session && isAuthRoute) {
    const redirectUrl =
      session.user.role === "SUPERADMIN"
        ? DEFAULT_REDIRECTS.superadmin
        : DEFAULT_REDIRECTS.user;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (isSuperadminRoute && shouldRedirectRegularUser(pathname, session?.user.role)) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECTS.user, request.url));
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
