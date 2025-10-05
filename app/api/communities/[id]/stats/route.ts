import { getCommunityStats } from "@/lib/services/stats-service";
import { isUserMemberOfCommunity } from "@/features/memberships/services/membershipService";
import { createGetHandler } from "@/lib/api";
import { ForbiddenError, NotFoundError } from "@/lib/utils/api-response";

export const GET = createGetHandler(async ({ session, params }) => {
  const communityId = params!.id;

  if (!communityId) {
    throw new NotFoundError('ID de comunidad no proporcionado');
  }

  const isMember = await isUserMemberOfCommunity(session!.user.id, communityId);
  
  if (!isMember) {
    throw new ForbiddenError('Debes ser miembro aprobado para ver las estadísticas de la comunidad');
  }

  return await getCommunityStats(communityId);
});
