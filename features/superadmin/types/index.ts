export interface GlobalStats {
  totalUsers: number;
  totalCommunities: number;
  totalListings: number;
  totalEvents: number;
  activeUsers: number;
  activeCommunities: number;
  inactiveCommunities: number;
  totalTransactions: number;
}

export interface SuperadminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  communitiesCount: number;
  listingsCount: number;
  eventsCount: number;
}

export interface SuperadminCommunity {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  membersCount: number;
  listingsCount: number;
  eventsCount: number;
}

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";

export interface UpdateUserData {
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateCommunityStatusData {
  status: "ACTIVE" | "INACTIVE";
  reason?: string;
}
