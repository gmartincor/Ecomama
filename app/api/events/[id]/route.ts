import { getEventById, updateEvent, deleteEvent, isUserAdminOfEventCommunity } from "@/features/events/services/eventService";
import { updateEventSchema } from "@/lib/validations/eventValidation";
import { createGetHandler, createPutHandler, createDeleteHandler } from "@/lib/api";
import { NotFoundError } from "@/lib/utils/api-response";

export const GET = createGetHandler(async ({ params }) => {
  const eventId = params!.id;
  const event = await getEventById(eventId);

  if (!event) {
    throw new NotFoundError("Evento no encontrado");
  }

  return event;
});

export const PUT = createPutHandler(
  async ({ params, body }) => {
    const eventId = params!.id;
    return await updateEvent(eventId, body);
  },
  updateEventSchema,
  async ({ session, params }) => {
    const eventId = params!.id;
    return await isUserAdminOfEventCommunity(session!.user.id, eventId);
  }
);

export const DELETE = createDeleteHandler(
  async ({ params }) => {
    const eventId = params!.id;
    await deleteEvent(eventId);
    return { success: true };
  },
  async ({ session, params }) => {
    const eventId = params!.id;
    return await isUserAdminOfEventCommunity(session!.user.id, eventId);
  }
);
