import { getUserCommunities } from "@/features/memberships/services/userCommunityService";
import { createGetHandler } from "@/lib/api";

export const GET = createGetHandler(async ({ session }) => {
  return await getUserCommunities(session!.user.id);
});
