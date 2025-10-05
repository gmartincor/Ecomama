import { getCommunityStats } from "@/lib/services/stats-service";
import { hasUserAccessToCommunity } from "@/features/memberships/services/membershipService";
import { createGetHandler } from "@/lib/api";
import { ForbiddenError, NotFoundError } from "@/lib/utils/api-response";

export const GET = createGetHandler(async ({ session, params }) => {
  const communityId = params!.id;

  if (!communityId) {
    throw new NotFoundError('ID de comunidad no proporcionado');
  }

  const hasAccess = await hasUserAccessToCommunity(session!.user.id, communityId);
  
  if (!hasAccess) {
    throw new ForbiddenError('Debes ser miembro aprobado para ver las estadísticas de la comunidad');
  }

  return await getCommunityStats(communityId);
});
