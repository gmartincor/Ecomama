import { Card } from "@/components/ui/Card";
import type { MemberProfile } from "../types";

type ProfileCardProps = {
  member: MemberProfile;
  onClick?: () => void;
};

export const ProfileCard = ({ member, onClick }: ProfileCardProps) => {
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
        {member.avatar ? (
          <img
            src={member.avatar}
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
          {member.location && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate">📍 {member.location}</p>
          )}
        </div>

        {member.bio && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 w-full">{member.bio}</p>
        )}
      </div>
    </Card>
  );
};
