import { profileSchema } from "@/lib/validations/profile";
import { getUserProfile, updateUserProfile } from "@/features/profiles/services/profileService";
import { createGetHandler, createPutHandler } from "@/lib/api";

export const GET = createGetHandler(async ({ session }) => {
  return await getUserProfile(session!.user.id);
});

export const PUT = createPutHandler(
  async ({ session, body }) => {
    return await updateUserProfile(session!.user.id, body as Parameters<typeof updateUserProfile>[1]);
  },
  profileSchema
);
