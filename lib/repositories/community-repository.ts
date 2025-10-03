import { prisma } from '@/lib/prisma/client';
import { BaseRepository } from '@/lib/repositories/base-repository';
import { Community, CommunityStatus } from '@prisma/client';

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

export type UpdateCommunityData = Partial<CreateCommunityData>;

const ADMIN_SELECT = {
  id: true,
  name: true,
  email: true,
};

class CommunityRepository extends BaseRepository<CommunityWithAdmin> {
  protected model = prisma.community;

  async findByIdWithAdmin(id: string): Promise<CommunityWithAdmin | null> {
    return this.findById(id, {
      include: {
        admin: { select: ADMIN_SELECT },
      },
    });
  }

  async findAll(filters: CommunityFilters): Promise<CommunityWithAdmin[]> {
    const { latitude, longitude, radiusKm, status, search } = filters;

    const where: any = this.buildSafeUpdateData({ status });

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { city: { contains: search, mode: 'insensitive' as const } },
        { country: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    const communities = await this.findMany(where, {
      include: { admin: { select: ADMIN_SELECT } },
      orderBy: { createdAt: 'desc' },
    });

    if (latitude && longitude && radiusKm) {
      return this.filterByRadius(communities, latitude, longitude, radiusKm);
    }

    return communities;
  }

  async createCommunity(data: CreateCommunityData, adminId: string): Promise<CommunityWithAdmin> {
    return this.create(
      {
        ...data,
        adminId,
        status: 'ACTIVE',
      },
      {
        include: { admin: { select: ADMIN_SELECT } },
      }
    );
  }

  async updateCommunity(id: string, data: UpdateCommunityData): Promise<CommunityWithAdmin> {
    const updateData = this.buildSafeUpdateData(data);
    
    return this.update(
      id, 
      updateData, 
      {
        include: { admin: { select: ADMIN_SELECT } },
      }
    );
  }

  async isUserAdmin(userId: string, communityId: string): Promise<boolean> {
    return this.exists({ id: communityId, adminId: userId });
  }

  async getStats(communityId: string) {
    const [totalMembers, activeMembers, totalListings, totalEvents] = await Promise.all([
      prisma.communityMember.count({ where: { communityId } }),
      prisma.communityMember.count({ where: { communityId, status: 'APPROVED' } }),
      prisma.listing.count({ where: { communityId } }),
      prisma.event.count({ where: { communityId } }),
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
    const EARTH_RADIUS_KM = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export const communityRepository = new CommunityRepository();
