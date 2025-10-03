import Link from "next/link";
import type { HeaderUser } from "./types";

type UserAvatarProps = {
  user: HeaderUser;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
};

const avatarClasses = {
  sm: "h-7 w-7 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
};

export const UserAvatar = ({ 
  user, 
  size = "md", 
  clickable = true
}: UserAvatarProps) => {
  const initial = user.name.charAt(0).toUpperCase();

  const content = (
    <div 
      className={`
        flex items-center justify-center rounded-full 
        bg-primary font-medium text-primary-foreground 
        ${avatarClasses[size]}
        ${clickable ? "cursor-pointer hover:opacity-80 hover:scale-105 transition-all" : ""}
      `}
      title={user.name}
      aria-label={`Usuario: ${user.name}`}
    >
      {initial}
    </div>
  );

  return clickable ? <Link href="/profile/me">{content}</Link> : content;
};
