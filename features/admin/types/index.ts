export interface CommunityStats {
  membersCount: number;
  pendingRequestsCount: number;
  activeListingsCount: number;
  eventsCount: number;
  offersCount: number;
  demandsCount: number;
}

export interface UpdateCommunityData {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface AdminMember {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: "ADMIN" | "MEMBER";
  status: "APPROVED" | "REMOVED";
  joinedAt: string;
  listingsCount: number;
  eventsCount: number;
}
