import type { User, UserProfile } from "@prisma/client";

export type UserSummary = Pick<User, "id" | "name" | "email">;

export type ProfileWithUser = UserProfile & {
  user: UserSummary;
};
