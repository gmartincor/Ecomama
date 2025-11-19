import Link from "next/link";

type LogoProps = {
  href?: string;
  compact?: boolean;
};

export const Logo = ({ href = "/feed", compact = false }: LogoProps) => {
  return (
    <Link href={href} className="flex items-center gap-2 group">
      <span className="text-2xl transition-transform group-hover:scale-110">🌱</span>
      {!compact && (
        <span className="text-xl md:text-2xl font-bold text-primary group-hover:opacity-80 transition-opacity">
          Ecomama
        </span>
      )}
    </Link>
  );
};
