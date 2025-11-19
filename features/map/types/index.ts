export type MapEvent = {
  id: string;
  type: string;
  title: string;
  description: string;
  eventDate: Date | null;
  location: string | null;
  latitude: number;
  longitude: number;
  isPinned: boolean;
  author: { id: string; name: string };
  itemType: 'event';
};

export type MapListing = {
  id: string;
  type: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  city: string | null;
  country: string | null;
  author: { id: string; name: string };
  itemType: 'listing';
};

export type MapItem = MapEvent | MapListing;

export type MapFilters = {
  includeEvents?: boolean;
  includeListings?: boolean;
  eventType?: string;
  listingType?: string;
};

export type MapBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};
