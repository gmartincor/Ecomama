import { getEvents, createEvent } from "@/features/events/services/eventService";
import { createEventSchema } from "@/lib/validations/eventValidation";
import { createGetHandler, createPostHandler, parseFilters } from "@/lib/api";
import type { EventFilters } from "@/lib/repositories/event-repository";

export const GET = createGetHandler(async ({ searchParams }) => {
  const filters = parseFilters<EventFilters>(searchParams!, {
    type: { type: 'enum', enumValues: ['ANNOUNCEMENT', 'EVENT'] as const },
    isPinned: { type: 'boolean' },
    upcoming: { type: 'boolean' },
  });
  
  return await getEvents(filters);
});

export const POST = createPostHandler(
  async ({ session, body }) => {
    return await createEvent(session!.user.id, body as Parameters<typeof createEvent>[1]);
  },
  createEventSchema
);
