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
      className={`p-4 ${onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        {member.profile?.avatar ? (
          <img
            src={member.profile.avatar}
            alt={member.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold">
            {getInitials(member.name)}
          </div>
        )}

        <div>
          <h3 className="font-semibold">{member.name}</h3>
          {member.profile?.location && (
            <p className="text-sm text-gray-600">📍 {member.profile.location}</p>
          )}
        </div>

        {member.profile?.bio && (
          <p className="text-sm text-gray-600 line-clamp-2">{member.profile.bio}</p>
        )}

        <p className="text-xs text-gray-500">Miembro desde {formatDate(member.memberSince)}</p>
      </div>
    </Card>
  );
};
