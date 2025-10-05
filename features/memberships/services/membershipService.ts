import { membershipRepository, MemberWithUser, MemberWithCommunity } from '@/lib/repositories/membership-repository';
import type { CommunityMember } from '@prisma/client';

export const createMembershipRequest = async (
  userId: string,
  communityId: string,
  message: string
): Promise<CommunityMember> => {
  const hasActiveRequest = await membershipRepository.existsActiveRequest(userId, communityId);

  if (hasActiveRequest) {
    throw new Error('You already have an active request or membership');
  }

  return membershipRepository.createRequest(userId, communityId, message);
};

export const getMembershipRequestsByUser = async (userId: string): Promise<MemberWithCommunity[]> => {
  return membershipRepository.findRequestsByUser(userId);
};

export const getPendingRequestsByCommunity = async (communityId: string): Promise<MemberWithUser[]> => {
  return membershipRepository.findPendingRequestsByCommunity(communityId);
};

export const approveMembershipRequest = async (
  requestId: string,
  responseMessage?: string
): Promise<CommunityMember> => {
  return membershipRepository.approveRequest(requestId, responseMessage);
};

export const rejectMembershipRequest = async (
  requestId: string,
  responseMessage?: string
): Promise<CommunityMember> => {
  return membershipRepository.rejectRequest(requestId, responseMessage);
};

export const getUserApprovedCommunities = async (userId: string): Promise<string[]> => {
  return membershipRepository.getApprovedCommunityIds(userId);
};

export const isUserMemberOfCommunity = async (
  userId: string,
  communityId: string
): Promise<boolean> => {
  return membershipRepository.isUserMember(userId, communityId);
};

export const hasUserAccessToCommunity = async (
  userId: string,
  communityId: string
): Promise<boolean> => {
  const { communityRepository } = await import('@/lib/repositories/community-repository');
  const [isAdmin, isMember] = await Promise.all([
    communityRepository.isUserAdmin(userId, communityId),
    membershipRepository.isUserMember(userId, communityId),
  ]);
  return isAdmin || isMember;
};

export const getUserMembershipInCommunity = async (
  userId: string,
  communityId: string
): Promise<CommunityMember | null> => {
  return membershipRepository.findByUserAndCommunity(userId, communityId);
};
