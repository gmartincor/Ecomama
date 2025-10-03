import type { User, Community, CommunityMember, UserProfile, Listing, Event } from "@prisma/client";

export type UserSummary = Pick<User, "id" | "name" | "email">;

export type CommunitySummary = Pick<Community, "id" | "name" | "city" | "country">;

export type ProfileWithUser = UserProfile & {
  user: UserSummary;
};

export type MemberProfile = {
  id: string;
  name: string;
  email: string;
  profile: UserProfile | null;
  memberSince: Date;
};
