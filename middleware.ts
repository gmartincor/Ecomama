import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";
import { checkProfileCompletion } from "@/lib/utils/profile-checker";

const PUBLIC_ROUTES = ["/", "/login", "/register"];
const AUTH_ROUTES = ["/login", "/register"];
const DASHBOARD_ROUTE = "/dashboard";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isSuperadminRoute = pathname.startsWith('/superadmin');
  const isProfileRoute = pathname.startsWith('/profile/me');
  const isDashboardRoute = pathname === DASHBOARD_ROUTE;

  if (!session && !isPublicRoute) {
    const url = new URL('/login', request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (session && isAuthRoute) {
    const redirectPath = session.user.role === 'SUPERADMIN' ? '/superadmin/dashboard' : '/feed';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (isDashboardRoute) {
    return NextResponse.next();
  }

  if (session && session.user.role !== "SUPERADMIN" && !isProfileRoute && !isPublicRoute) {
    const profileStatus = await checkProfileCompletion(session.user.id);
    
    if (!profileStatus.isComplete) {
      return NextResponse.redirect(new URL('/profile/me/edit?firstTime=true', request.url));
    }
  }

  if (isSuperadminRoute && session?.user.role !== 'SUPERADMIN') {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
