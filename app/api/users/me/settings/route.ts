import { getUserSettings, updateUserSettings } from "@/features/settings/services/settingsService";
import { createGetHandler, createPutHandler } from "@/lib/api";
import { z } from "zod";

const updateSettingsSchema = z.object({
  defaultCommunityId: z.string().nullable().optional(),
  emailNotifications: z.boolean().optional(),
});

export const GET = createGetHandler(async ({ session }) => {
  return await getUserSettings(session!.user.id);
});

export const PUT = createPutHandler(
  async ({ session, body }) => {
    return await updateUserSettings(session!.user.id, body);
  },
  updateSettingsSchema
);
