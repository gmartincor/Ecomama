export const NAV_LINKS = [
  { href: "/tablon", label: "Tablón", icon: "📰" },
  { href: "/listings", label: "Anuncios", icon: "📦" },
  { href: "/map", label: "Mapa", icon: "🗺️" },
] as const;

export const HEADER_CONFIG = {
  height: "h-16",
  spacing: {
    container: "px-4",
    mobile: "py-2.5",
    gap: "gap-3",
  },
  breakpoints: {
    stackLayout: "md",
  },
} as const;
