import { getEventById, updateEvent, deleteEvent } from "@/features/events/services/eventService";
import { updateEventSchema } from "@/lib/validations/eventValidation";
import { createGetHandler, createPutHandler, createDeleteHandler, eventOwnerCheck } from "@/lib/api";
import { NotFoundError } from "@/lib/utils/api-response";
import { extractId } from "@/lib/utils/route-helpers";

export const GET = createGetHandler(async ({ params }) => {
  const eventId = extractId(params!.id);
  const event = await getEventById(eventId);

  if (!event) {
    throw new NotFoundError("Evento no encontrado");
  }

  return event;
});

export const PUT = createPutHandler(
  async ({ params, body }) => {
    const eventId = extractId(params!.id);
    return await updateEvent(eventId, body as Parameters<typeof updateEvent>[1]);
  },
  updateEventSchema,
  eventOwnerCheck
);

export const DELETE = createDeleteHandler(
  async ({ params }) => {
    const eventId = extractId(params!.id);
    await deleteEvent(eventId);
    return { success: true };
  },
  eventOwnerCheck
);
