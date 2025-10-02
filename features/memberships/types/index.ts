export type MembershipStatus = "PENDING" | "APPROVED" | "REJECTED" | "REMOVED";
export type MembershipRole = "ADMIN" | "MEMBER";

export type CommunityMember = {
  id: string;
  userId: string;
  communityId: string;
  role: MembershipRole;
  status: MembershipStatus;
  requestMessage: string;
  responseMessage: string | null;
  requestedAt: Date;
  respondedAt: Date | null;
  joinedAt: Date | null;
};

export type MemberWithUser = CommunityMember & {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type MemberWithCommunity = CommunityMember & {
  community: {
    id: string;
    name: string;
    city: string;
    country: string;
  };
};

export type MembershipRequestFilters = {
  status?: MembershipStatus;
  communityId?: string;
  userId?: string;
};
