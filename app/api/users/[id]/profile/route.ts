import { getUserProfile, canViewProfile } from "@/features/profiles/services/profileService";
import { createGetHandler } from "@/lib/api";
import { NotFoundError, ForbiddenError } from "@/lib/utils/api-response";

export const GET = createGetHandler(async ({ session, params }) => {
  const userId = params!.id;

  const canView = await canViewProfile(session!.user.id, userId);
  if (!canView) {
    throw new ForbiddenError('Solo puedes ver perfiles de miembros en tus comunidades');
  }

  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new NotFoundError('Perfil no encontrado');
  }

  return profile;
});
