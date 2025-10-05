import { getEvents, createEvent } from "@/features/events/services/eventService";
import { hasUserAccessToCommunity } from "@/features/memberships/services/membershipService";
import { createEventSchema } from "@/lib/validations/eventValidation";
import { createGetHandler, createPostHandler, parseFilters } from "@/lib/api";
import { ForbiddenError } from "@/lib/utils/api-response";
import type { EventFilters } from "@/features/events/types";

export const GET = createGetHandler(async ({ session, params, searchParams }) => {
  const communityId = params!.id;

  const hasAccess = await hasUserAccessToCommunity(session!.user.id, communityId);
  if (!hasAccess) {
    throw new ForbiddenError('Debes ser miembro para ver eventos');
  }

  const filters = parseFilters<EventFilters>(searchParams!, {
    type: { type: 'enum', enumValues: ['ANNOUNCEMENT', 'EVENT'] as const },
    isPinned: { type: 'boolean' },
    authorId: { type: 'string' },
  });

  return await getEvents(communityId, filters);
});

export const POST = createPostHandler(
  async ({ session, params, body }) => {
    const communityId = params!.id;

    const hasAccess = await hasUserAccessToCommunity(session!.user.id, communityId);
    if (!hasAccess) {
      throw new ForbiddenError('Debes ser miembro para crear eventos');
    }

    return await createEvent(communityId, session!.user.id, {
      type: body.type,
      title: body.title,
      description: body.description,
      eventDate: body.eventDate ? new Date(body.eventDate) : null,
      location: body.location || null,
    });
  },
  createEventSchema
);
