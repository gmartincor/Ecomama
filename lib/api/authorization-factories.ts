import { UserRole } from '@prisma/client';
import { communityRepository } from '@/lib/repositories/community-repository';
import { membershipRepository } from '@/lib/repositories/membership-repository';
import { listingRepository } from '@/lib/repositories/listing-repository';
import { eventRepository } from '@/lib/repositories/event-repository';
import type { AuthorizationCheck } from '@/lib/api/authorization';

type ResourceType = 'listing' | 'event' | 'community' | 'membership';

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
        return await eventRepository.isUserAdminOfCommunity(session.user.id, resourceId);
      case 'community':
        return await communityRepository.isUserAdmin(session.user.id, resourceId);
      default:
        return false;
    }
  };
};

export const createCommunityAdminCheck = (
  getCommunityId: (params: Record<string, any>) => string
): AuthorizationCheck => {
  return async ({ session, params }) => {
    if (!session) return false;
    
    if (session.user.role === UserRole.SUPERADMIN) return true;

    const communityId = getCommunityId(params!);
    return await communityRepository.isUserAdmin(session.user.id, communityId);
  };
};

export const createCommunityMemberCheck = (
  getCommunityId: (params: Record<string, any>) => string
): AuthorizationCheck => {
  return async ({ session, params }) => {
    if (!session) return false;
    
    const communityId = getCommunityId(params!);
    return await membershipRepository.isUserMember(session.user.id, communityId);
  };
};

export const communityAdminFromId = createCommunityAdminCheck((params) => params.id);
export const communityMemberFromId = createCommunityMemberCheck((params) => params.id);
export const listingOwnerCheck = createResourceOwnershipCheck('listing', (params) => params.id);
export const eventOwnerCheck = createResourceOwnershipCheck('event', (params) => params.id);
export const communityOwnerCheck = createResourceOwnershipCheck('community', (params) => params.id);
