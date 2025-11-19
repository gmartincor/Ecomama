import { UserRole } from '@prisma/client';
import { listingRepository } from '@/lib/repositories/listing-repository';
import { eventRepository } from '@/lib/repositories/event-repository';
import type { AuthorizationCheck } from '@/lib/api/authorization';

type ResourceType = 'listing' | 'event';

export const createResourceOwnershipCheck = (
  resourceType: ResourceType,
  getResourceId: (params: Record<string, any>) => string
): AuthorizationCheck => {
  return async ({ session, params }) => {
    if (!session) return false;
    
    if (session.user.role === UserRole.SUPERADMIN) return true;

    const resourceId = getResourceId(params!);

    switch (resourceType) {
      case 'listing':
        return await listingRepository.isAuthor(session.user.id, resourceId);
      case 'event':
        return await eventRepository.isAuthor(session.user.id, resourceId);
      default:
        return false;
    }
  };
};

export const listingOwnerCheck = createResourceOwnershipCheck('listing', (params) => params.id);
export const eventOwnerCheck = createResourceOwnershipCheck('event', (params) => params.id);
