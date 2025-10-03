import { Card } from "@/components/ui/Card";
import type { MemberProfile } from "../types";

type ProfileCardProps = {
  member: MemberProfile;
  onClick?: () => void;
};

export const ProfileCard = ({ member, onClick }: ProfileCardProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      variant={onClick ? "interactive" : "default"}
      className="p-3 sm:p-4"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
        {member.profile?.avatar ? (
          <img
            src={member.profile.avatar}
            alt={member.name}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg sm:text-xl font-semibold">
            {getInitials(member.name)}
          </div>
        )}

        <div className="w-full min-w-0">
          <h3 className="font-semibold text-sm sm:text-base truncate">{member.name}</h3>
          {member.profile?.location && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate">📍 {member.profile.location}</p>
          )}
        </div>

        {member.profile?.bio && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 w-full">{member.profile.bio}</p>
        )}

        <p className="text-xs text-muted-foreground">Miembro desde {formatDate(member.memberSince)}</p>
      </div>
    </Card>
  );
};
