export type Community = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  adminId: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
};

export type CommunityAdmin = {
  id: string;
  name: string;
  email: string;
};

export type CommunityWithRelations = Community & {
  admin: CommunityAdmin;
  _count?: {
    members: number;
    listings: number;
    events: number;
  };
};

export type CommunityFormData = {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
};

export type GeocodingResult = {
  displayName: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
};

export type LocationCoordinates = {
  latitude: number;
  longitude: number;
};

export type CommunityFilters = {
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  status?: "ACTIVE" | "INACTIVE";
  search?: string;
};
