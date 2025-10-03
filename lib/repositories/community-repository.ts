import { prisma } from '@/lib/prisma/client';
import { BaseRepository } from '@/lib/repositories/base-repository';
import { Community, CommunityStatus } from '@prisma/client';
import { buildWhereClause } from '@/lib/utils/prisma-helpers';

export type CommunityWithAdmin = Community & {
  admin: {
    id: string;
    name: string;
    email: string;
  };
};

export type CommunityFilters = {
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  status?: CommunityStatus;
  search?: string;
};

export type CreateCommunityData = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
};

class CommunityRepository extends BaseRepository<CommunityWithAdmin> {
  protected model = prisma.community;

  async findByIdWithAdmin(id: string): Promise<CommunityWithAdmin | null> {
    return prisma.community.findUnique({
      where: { id },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(filters: CommunityFilters): Promise<CommunityWithAdmin[]> {
    const { latitude, longitude, radiusKm, status, search } = filters;

    const where: any = buildWhereClause({ status });

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { city: { contains: search, mode: 'insensitive' as const } },
        { country: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    const communities = await prisma.community.findMany({
      where,
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (latitude && longitude && radiusKm) {
      return this.filterByRadius(communities, latitude, longitude, radiusKm);
    }

    return communities;
  }

  async createCommunity(data: CreateCommunityData, adminId: string): Promise<CommunityWithAdmin> {
    return prisma.community.create({
      data: {
        ...data,
        adminId,
        status: 'ACTIVE',
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateCommunity(
    id: string,
    data: Partial<Omit<CreateCommunityData, 'adminId'>>
  ): Promise<CommunityWithAdmin> {
    const updateData = buildWhereClause(data);
    
    return prisma.community.update({
      where: { id },
      data: updateData,
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async isUserAdmin(userId: string, communityId: string): Promise<boolean> {
    return this.exists({ id: communityId, adminId: userId });
  }

  async getStats(communityId: string) {
    const [totalMembers, activeMembers, totalListings, totalEvents] = await Promise.all([
      prisma.communityMember.count({
        where: { communityId },
      }),
      prisma.communityMember.count({
        where: { communityId, status: 'APPROVED' },
      }),
      prisma.listing.count({
        where: { communityId },
      }),
      prisma.event.count({
        where: { communityId },
      }),
    ]);

    return {
      totalMembers,
      activeMembers,
      totalListings,
      totalEvents,
    };
  }

  private filterByRadius(
    communities: CommunityWithAdmin[],
    latitude: number,
    longitude: number,
    radiusKm: number
  ): CommunityWithAdmin[] {
    return communities.filter((community) => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        community.latitude,
        community.longitude
      );
      return distance <= radiusKm;
    });
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export const communityRepository = new CommunityRepository();
