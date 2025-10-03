import { togglePinEvent, isUserAdminOfEventCommunity } from "@/features/events/services/eventService";
import { pinEventSchema } from "@/lib/validations/eventValidation";
import { createPutHandler } from "@/lib/api";

export const PUT = createPutHandler(
  async ({ params, body }) => {
    const eventId = params!.id;
    return await togglePinEvent(eventId, body.isPinned);
  },
  pinEventSchema,
  async ({ session, params }) => {
    const eventId = params!.id;
    return await isUserAdminOfEventCommunity(session!.user.id, eventId);
  }
);
