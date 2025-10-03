import { createCommunitySchema } from "@/lib/validations/community";
import { createCommunity, getAllCommunities } from "@/features/communities/services/communityService";
import { createGetHandler, createPostHandler, requireSuperAdmin, parseFilters } from "@/lib/api";
import type { CommunityFilters } from "@/features/communities/types";

export const GET = createGetHandler(async ({ searchParams }) => {
  const filters = parseFilters<CommunityFilters>(searchParams!, {
    latitude: { type: 'number' },
    longitude: { type: 'number' },
    radiusKm: { type: 'number' },
    status: { type: 'enum', enumValues: ['ACTIVE', 'INACTIVE'] as const },
    search: { type: 'string' },
  });

  return await getAllCommunities(filters);
}, false);

export const POST = createPostHandler(
  async ({ body }) => {
    return await createCommunity(body, body.adminId);
  },
  createCommunitySchema,
  requireSuperAdmin
);
