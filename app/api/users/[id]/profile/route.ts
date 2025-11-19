import { getUserProfile } from "@/features/profiles/services/profileService";
import { createGetHandler } from "@/lib/api";
import { NotFoundError } from "@/lib/utils/api-response";
import { extractId } from "@/lib/utils/route-helpers";

export const GET = createGetHandler(async ({ params }) => {
  const userId = extractId(params!.id);

  const profile = await getUserProfile(userId);
  if (!profile) {
    throw new NotFoundError('Perfil no encontrado');
  }

  return profile;
});
