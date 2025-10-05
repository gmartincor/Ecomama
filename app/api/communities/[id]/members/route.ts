import { getCommunityMembers } from "@/features/profiles/services/profileService";
import { hasUserAccessToCommunity } from "@/features/memberships/services/membershipService";
import { createGetHandler } from "@/lib/api";
import { ForbiddenError } from "@/lib/utils/api-response";

export const GET = createGetHandler(async ({ session, params }) => {
  const communityId = params!.id;

  const hasAccess = await hasUserAccessToCommunity(session!.user.id, communityId);
  if (!hasAccess) {
    throw new ForbiddenError('Debes ser miembro para ver los miembros de la comunidad');
  }

  return await getCommunityMembers(communityId);
});
