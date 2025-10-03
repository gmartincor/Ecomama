import { getCommunityMembers } from "@/features/profiles/services/profileService";
import { isUserMemberOfCommunity } from "@/features/memberships/services/membershipService";
import { createGetHandler } from "@/lib/api";
import { ForbiddenError } from "@/lib/utils/api-response";

export const GET = createGetHandler(async ({ session, params }) => {
  const communityId = params!.id;

  const isMember = await isUserMemberOfCommunity(session!.user.id, communityId);
  if (!isMember) {
    throw new ForbiddenError('Debes ser miembro para ver los miembros de la comunidad');
  }

  return await getCommunityMembers(communityId);
});
