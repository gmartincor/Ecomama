import { prisma } from '@/lib/prisma/client';
import { BaseRepository } from '@/lib/repositories/base-repository';
import { CommunityMember, MemberStatus } from '@prisma/client';

export type MemberWithUser = CommunityMember & {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type MemberWithCommunity = CommunityMember & {
  community: {
    id: string;
    name: string;
    city: string;
    country: string;
  };
};

class MembershipRepository extends BaseRepository<CommunityMember> {
  protected model = prisma.communityMember;

  async findByUserAndCommunity(
    userId: string,
    communityId: string
  ): Promise<CommunityMember | null> {
    return this.findFirst({ userId, communityId });
  }

  async existsActiveRequest(userId: string, communityId: string): Promise<boolean> {
    return this.exists({
      userId,
      communityId,
      status: { in: ['PENDING', 'APPROVED'] },
    });
  }

  async createRequest(
    userId: string,
    communityId: string,
    message: string
  ): Promise<CommunityMember> {
    return this.create({
      userId,
      communityId,
      requestMessage: message,
      status: 'PENDING',
      role: 'MEMBER',
      requestedAt: new Date(),
    });
  }

  async findRequestsByUser(userId: string): Promise<MemberWithCommunity[]> {
    return prisma.communityMember.findMany({
      where: { userId },
      include: {
        community: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
          },
        },
      },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async findPendingRequestsByCommunity(communityId: string): Promise<MemberWithUser[]> {
    return prisma.communityMember.findMany({
      where: {
        communityId,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { requestedAt: 'asc' },
    });
  }

  async approveRequest(requestId: string, responseMessage?: string): Promise<CommunityMember> {
    return this.update(requestId, {
      status: 'APPROVED',
      responseMessage,
      respondedAt: new Date(),
      joinedAt: new Date(),
    });
  }

  async rejectRequest(requestId: string, responseMessage?: string): Promise<CommunityMember> {
    return this.update(requestId, {
      status: 'REJECTED',
      responseMessage,
      respondedAt: new Date(),
    });
  }

  async getApprovedCommunityIds(userId: string): Promise<string[]> {
    const memberships = await prisma.communityMember.findMany({
      where: {
        userId,
        status: 'APPROVED',
      },
      select: {
        communityId: true,
      },
    });

    return memberships.map((m) => m.communityId);
  }

  async isUserMember(userId: string, communityId: string): Promise<boolean> {
    return this.exists({
      userId,
      communityId,
      status: 'APPROVED',
    });
  }
}

export const membershipRepository = new MembershipRepository();
