export const ROUTE_CONFIG = {
  public: ["/", "/login", "/register", "/communities/map"],
  auth: ["/login", "/register"],
  superadmin: ["/superadmin"],
  shared: ["/profile", "/admin"],
  regularUser: ["/community", "/dashboard", "/settings", "/requests"],
} as const;

export const DEFAULT_REDIRECTS = {
  superadmin: "/superadmin/dashboard",
  user: "/dashboard",
  unauthorized: "/login",
} as const;

export const isRouteMatch = (pathname: string, routes: readonly string[]): boolean => {
  return routes.some((route) => pathname.startsWith(route));
};

export const shouldRedirectSuperadmin = (pathname: string, role?: string): boolean => {
  if (role !== "SUPERADMIN") return false;
  return isRouteMatch(pathname, ROUTE_CONFIG.regularUser);
};

export const shouldRedirectRegularUser = (pathname: string, role?: string): boolean => {
  if (role === "SUPERADMIN") return false;
  return isRouteMatch(pathname, ROUTE_CONFIG.superadmin);
};
