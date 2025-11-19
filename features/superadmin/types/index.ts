export interface GlobalStats {
  totalUsers: number;
  totalListings: number;
  totalEvents: number;
  activeUsers: number;
}

export interface SuperadminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  listingsCount: number;
  eventsCount: number;
}

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type UserRole = "USER" | "SUPERADMIN";

export interface UpdateUserData {
  role?: UserRole;
  status?: UserStatus;
}
