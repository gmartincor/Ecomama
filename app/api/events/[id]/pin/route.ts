import { togglePinEvent } from "@/features/events/services/eventService";
import { pinEventSchema } from "@/lib/validations/eventValidation";
import { createPutHandler, requireSuperAdmin } from "@/lib/api";
import { extractId } from "@/lib/utils/route-helpers";

export const PUT = createPutHandler(
  async ({ params, body }) => {
    const eventId = extractId(params!.id);
    const { isPinned } = body as { isPinned: boolean };
    return await togglePinEvent(eventId, isPinned);
  },
  pinEventSchema,
  requireSuperAdmin
);
