import { ProfileCard } from "./ProfileCard";
import type { MemberProfile } from "../types";

type MemberGridProps = {
  members: MemberProfile[];
  onMemberClick?: (memberId: string) => void;
  emptyMessage?: string;
};

export const MemberGrid = ({
  members,
  onMemberClick,
  emptyMessage = "No hay miembros",
}: MemberGridProps) => {
  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {members.map((member) => (
        <ProfileCard
          key={member.id}
          member={member}
          onClick={onMemberClick ? () => onMemberClick(member.id) : undefined}
        />
      ))}
    </div>
  );
};
