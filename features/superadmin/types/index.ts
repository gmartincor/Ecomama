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
  role: "USER" | "ADMIN" | "SUPERADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
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

export interface UpdateUserData {
  role?: "USER" | "ADMIN" | "SUPERADMIN";
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface UpdateCommunityStatusData {
  status: "ACTIVE" | "INACTIVE";
  reason?: string;
}
